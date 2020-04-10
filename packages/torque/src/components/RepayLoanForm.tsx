import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IRepayEstimate } from "../domain/IRepayEstimate";
import { IWalletDetails } from "../domain/IWalletDetails";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { WalletType } from "../domain/WalletType";
import { TorqueProvider } from "../services/TorqueProvider";
import { OpsEstimatedResult } from "./OpsEstimatedResult";
import { RepayLoanSlider } from "./RepayLoanSlider";

export interface IRepayLoanFormProps {
  walletDetails: IWalletDetails;
  loanOrderState: IBorrowedFundsState;

  didSubmit: boolean;
  toggleDidSubmit: (submit: boolean) => void;
  onSubmit: (request: RepayLoanRequest) => void;
  onClose: () => void;
}

interface IRepayLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  inputAmountText: string;
  currentValue: number;
  selectedValue: number;
  repayAmount: BigNumber;
  repayManagementAddress: string | null;
  gasAmountNeeded: BigNumber;
  balanceTooLow: boolean;
}

export class RepayLoanForm extends Component<IRepayLoanFormProps, IRepayLoanFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputTextChange: Subject<string>;

  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IRepayLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 0,
      maxValue: 100,
      inputAmountText: "",
      assetDetails: null,
      currentValue: 100,
      selectedValue: 100,
      repayAmount: props.loanOrderState.amountOwed,
      repayManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: IRepayEstimate) => {
        this.setState({
          ...this.state,
          repayAmount: value.repayAmount,
          inputAmountText: value.repayAmount.toString()
        });
      });

    this._inputTextChange = new Subject<string>();
    this._inputTextChange
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxConvertToBigNumber(value)),
        switchMap(value => this.rxGetEstimatePercent(value))
      )
      .subscribe((value: IRepayEstimate) => {
        this.setState({
          ...this.state,
          currentValue: value.repayPercent ? value.repayPercent : 0,
          repayAmount: value.repayAmount
        });
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanRepayParams(
      this.props.walletDetails,
      this.props.loanOrderState,
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanRepayAddress(
        this.props.walletDetails,
        this.props.loanOrderState
      ).then(repayManagementAddress => {
        TorqueProvider.Instance.getLoanRepayGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              minValue: collateralState.minValue,
              maxValue: collateralState.maxValue,
              assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
              currentValue: collateralState.currentValue,
              selectedValue: collateralState.currentValue,
              repayManagementAddress: repayManagementAddress,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this.selectedValueUpdate.next(this.state.selectedValue);
              // this._inputTextChange.next(this.state.inputAmountText);
            }
          );
        });
      });
    });
  }

  public componentDidUpdate(
    prevProps: Readonly<IRepayLoanFormProps>,
    prevState: Readonly<IRepayLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanRepayAddress(
        this.props.walletDetails,
        this.props.loanOrderState
      ).then(repayManagementAddress => {
        TorqueProvider.Instance.getLoanRepayGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              repayManagementAddress: repayManagementAddress,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this.selectedValueUpdate.next(this.state.selectedValue);
              // this._inputTextChange.next(this.state.inputAmountText);
            }
          );
        });
      });
    }
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <form className="repay-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          {this.props.walletDetails.walletType === WalletType.Web3 ? (
            <React.Fragment>
              <div className="repay-loan-form__input-container" style={this.props.walletDetails.walletType === WalletType.Web3 ? { paddingBottom: `1rem` } : undefined}>
                <input
                  ref={this._setInputRef}
                  className="repay-loan-form__input-container__input-amount"
                  type="text"
                  onChange={this.onTradeAmountChange}
                  placeholder={`Enter amount`}
                  value={this.state.inputAmountText}
                />
              </div>

              <RepayLoanSlider
                readonly={false}
                minValue={this.state.minValue}
                maxValue={this.state.maxValue}
                value={this.state.currentValue}
                onUpdate={this.onUpdate}
                onChange={this.onChange}
              />

              <div className="repay-loan-form__tips">
                <div className="repay-loan-form__tip">Current state</div>
                <div className="repay-loan-form__tip">Full repayment</div>
              </div>

              <hr className="repay-loan-form__delimiter" />
            </React.Fragment>
          ) : null}

          <OpsEstimatedResult
            assetDetails={this.state.assetDetails}
            actionTitle="You will repay"
            amount={this.state.repayAmount}
            precision={6}
          />
          <div className={`repay-loan-form-insufficient-balance ${!this.state.balanceTooLow ? `repay-loan-form-insufficient-balance--hidden` : ``}`}>
            Insufficient {this.state.assetDetails.displayName} balance in your wallet!
              </div>
        </section>
        <section className="dialog-actions">
          <div className="repay-loan-form__actions-container">
            <button type="submit" className={`btn btn-size--small ${this.props.didSubmit ? `btn-disabled` : ``}`}>
              {this.props.didSubmit ? "Submitting..." : "Repay"}
            </button>
          </div>
        </section>
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<IRepayEstimate> => {
    return new Observable<IRepayEstimate>(observer => {
      TorqueProvider.Instance.getLoanRepayEstimate(
        this.props.walletDetails,
        this.props.loanOrderState,
        selectedValue
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private rxConvertToBigNumber = (textValue: string): Observable<BigNumber> => {
    const repayAmount = new BigNumber(textValue);

    return new Observable<BigNumber>(observer => {
      observer.next(repayAmount);
    });
  };

  private rxGetEstimatePercent = (repayAmount: BigNumber): Observable<IRepayEstimate> => {

    return new Observable<IRepayEstimate>(observer => {
      TorqueProvider.Instance.getLoanRepayPercent(
        this.props.walletDetails,
        this.props.loanOrderState,
        repayAmount
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private onChange = (value: number) => {
    this.setState({ ...this.state, selectedValue: value, currentValue: value });
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value });
  };

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let repayAmount = this.state.repayAmount;
    if (this.state.repayAmount.lt(0)) {
      repayAmount = new BigNumber(0);
    }

    if (!this.props.didSubmit) {
      this.props.toggleDidSubmit(true);

      let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.loanAsset);
      if (this.props.loanOrderState.loanAsset === Asset.ETH) {
        assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
      }
      const precision = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals || 18;
      const amountInBaseUnits = new BigNumber(repayAmount.multipliedBy(10 ** precision).toFixed(0, 1));
      if (assetBalance.lt(amountInBaseUnits)) {
        this.props.toggleDidSubmit(false);

        this.setState({
          ...this.state,
          balanceTooLow: true
        });

        return;

      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false
        });
      }

      const percentData = await TorqueProvider.Instance.getLoanRepayPercent(
        this.props.walletDetails,
        this.props.loanOrderState,
        repayAmount
      );

      this.props.onSubmit(
        new RepayLoanRequest(
          this.props.walletDetails,
          this.props.loanOrderState.loanAsset,
          this.props.loanOrderState.collateralAsset,
          this.props.loanOrderState.accountAddress,
          this.props.loanOrderState.loanOrderHash,
          repayAmount,
          percentData.repayPercent ? new BigNumber(percentData.repayPercent) : new BigNumber(0),
          this.props.loanOrderState.amountOwed
        )
      );
    }
  };

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let amountText = event.target.value ? event.target.value : "";

    let repayAmount = new BigNumber(amountText);
    if (repayAmount.lt(0)) {
      repayAmount = new BigNumber(0);
      amountText = "0"
    } else if (repayAmount.gt(this.props.loanOrderState.amountOwed)) {
      repayAmount = this.props.loanOrderState.amountOwed;
      amountText = repayAmount.toString();
    }

    this.setState({
      ...this.state,
      inputAmountText: amountText,
      repayAmount: repayAmount
    }, () => {
      // emitting next event for processing with rx.js
      this._inputTextChange.next(this.state.inputAmountText);
    });
  };
}
