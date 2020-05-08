import { BigNumber } from "@0x/utils";
import React, { Component, FormEvent, ChangeEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IExtendEstimate } from "../domain/IExtendEstimate";
import { TorqueProvider } from "../services/TorqueProvider";
import { ExtendLoanSlider } from "./ExtendLoanSlider";
import { InputAmount } from "./InputAmount";

export interface IExtendLoanFormProps {
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: ExtendLoanRequest) => void;
  onClose: () => void;
}

interface IExtendLoanFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  currentValue: number;
  selectedValue: number;
  depositAmount: BigNumber;
  extendManagementAddress: string | null;
  gasAmountNeeded: BigNumber;
  balanceTooLow: boolean;

  didSubmit: boolean;
  interestAmount: number;
  inputAmountText: string,
  maxDepositAmount: BigNumber;
}

export class ExtendLoanForm extends Component<IExtendLoanFormProps, IExtendLoanFormState> {
  private readonly _inputDecimals = 6;
  private readonly _inputTextChange: Subject<string>;
  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IExtendLoanFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 1,
      maxValue: 365,
      assetDetails: null,
      currentValue: 90,
      selectedValue: 90,
      depositAmount: new BigNumber(0),
      extendManagementAddress: null,
      gasAmountNeeded: new BigNumber(0),
      balanceTooLow: false,
      didSubmit: false,
      interestAmount: 0,
      inputAmountText: "",
      maxDepositAmount: new BigNumber(0)
    };

    this.selectedValueUpdate = new Subject<number>();
    this.selectedValueUpdate
      .pipe(
        debounceTime(100),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe((value: IExtendEstimate) => {
        this.setState({
          ...this.state,
          depositAmount: value.depositAmount
        });
      });
    this._inputTextChange = new Subject<string>();
    this._inputTextChange
      .pipe(
        debounceTime(100),
      )
      .subscribe((value: string) => {
        this.setState({
          ...this.state,
          inputAmountText: value
        })
      });
  }

  public componentDidMount(): void {
    TorqueProvider.Instance.getLoanExtendParams(
      this.props.loanOrderState
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanExtendManagementAddress(
        this.props.loanOrderState
      ).then(extendManagementAddress => {
        let inputAmountText = this.state.maxDepositAmount.multipliedBy(this.state.selectedValue).dividedBy(this.state.maxValue).toFixed(this._inputDecimals).toString();
        this.setState(
          {
            ...this.state,
            minValue: collateralState.minValue,
            maxValue: collateralState.maxValue,
            assetDetails: AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null,
            currentValue: collateralState.currentValue,
            selectedValue: collateralState.currentValue,
            extendManagementAddress: extendManagementAddress,
            inputAmountText: inputAmountText
          },
          () => {
            this.selectedValueUpdate.next(this.state.selectedValue);
            this._inputTextChange.next(this.state.inputAmountText);
          }
        );
      });
    });
    this.getMaxDepositAmount();
  }

  public componentDidUpdate(
    prevProps: Readonly<IExtendLoanFormProps>,
    prevState: Readonly<IExtendLoanFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanExtendManagementAddress(
        this.props.loanOrderState
      ).then(extendManagementAddress => {
        TorqueProvider.Instance.getLoanExtendGasAmount().then(gasAmountNeeded => {
          this.setState(
            {
              ...this.state,
              extendManagementAddress: extendManagementAddress,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this.selectedValueUpdate.next(this.state.selectedValue);
              this._inputTextChange.next(this.state.inputAmountText);
            }
          );
        });
      });
    }

    if (prevState.interestAmount !== this.state.interestAmount) {
      this.updateDepositAmount(this.state.interestAmount);
    }
  }

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    let daysLeft;
    if (this.props.loanOrderState.loanData) {
      daysLeft = this.props.loanOrderState.loanData.loanEndUnixTimestampSec.minus(Date.now() / 1000).dividedBy(86400).toFixed(1);
    }

    return (
      <form className="extend-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <div className="extend-loan-form__info-extended-by-container">
            <div className="extend-loan-form__info-extended-by-msg">This date will be extended by</div>
            <div className="extend-loan-form__info-extended-by-price">
              {this.state.selectedValue} {this.pluralize("day", "days", this.state.selectedValue)}
            </div>
          </div>

          <ExtendLoanSlider
            readonly={false}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.currentValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="extend-loan-form__tips">
            <div className="extend-loan-form__tip">Min</div>
            <div className="extend-loan-form__tip">Max</div>
          </div>

          <div className="extend-loan-form__info-extended-by-msg mb-20">You will send</div>
          <InputAmount
            asset={this.state.assetDetails.reactLogoSvg}
            inputAmountText={this.state.inputAmountText}
            updateInterestAmount={this.updateInterestAmount}
            onTradeAmountChange={this.onTradeAmountChange}
            interestAmount={this.state.interestAmount}
          />
          {this.state.balanceTooLow
            ? <React.Fragment>
              <div className="extend-loan-form__insufficient-balance">
                Insufficient {this.state.assetDetails.displayName} balance in your wallet!
              </div>
            </React.Fragment>
            : null
          }
        </section>
        <section className="dialog-actions">
          <div className="extend-loan-form__actions-container">
            <button type="submit" className={`btn btn-size--small ${this.state.didSubmit ? `btn-disabled` : ``}`}>
              {this.state.didSubmit ? "Submitting..." : "Extend"}
            </button>
          </div>
        </section>
      </form>
    );
  }

  private pluralize = (singular: string, plural: string, value: number) => {
    const isPlural = value !== 1;
    return isPlural ? plural : singular;
  };

  private rxGetEstimate = (selectedValue: number): Observable<IExtendEstimate> => {
    return new Observable<IExtendEstimate>(observer => {
      TorqueProvider.Instance.getLoanExtendEstimate(
        this.props.loanOrderState.interestOwedPerDay,
        selectedValue
      ).then(value => {
        observer.next(value);
      });
    });
  };

  private onChange = (value: number) => {
    let depositAmount = this.state.maxDepositAmount.multipliedBy(value).dividedBy(this.state.maxValue);
    let depositAmountText = depositAmount.toFixed(this._inputDecimals).toString();
    this.setState({
      ...this.state,
      selectedValue: value,
      currentValue: value,
      depositAmount: depositAmount,
      inputAmountText: depositAmountText,
      interestAmount: 0
    });
  };

  private onUpdate = (value: number) => {
    let depositAmount = this.state.maxDepositAmount.multipliedBy(value).dividedBy(this.state.maxValue);
    let depositAmountText = depositAmount.toFixed(this._inputDecimals).toString();
    this.setState({
      ...this.state,
      selectedValue: value,
      depositAmount: depositAmount,
      inputAmountText: depositAmountText,
      interestAmount: 0
    });
  };

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.depositAmount.lte(0)) {
      return;
    }

    if (!this.state.didSubmit) {
      this.setState({ ...this.state, didSubmit: true });

      let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.loanAsset);
      if (this.props.loanOrderState.loanAsset === Asset.ETH) {
        assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
      }
      const precision = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals || 18;
      const amountInBaseUnits = new BigNumber(this.state.depositAmount.multipliedBy(10 ** precision).toFixed(0, 1));
      if (assetBalance.lt(amountInBaseUnits)) {

        this.setState({
          ...this.state,
          balanceTooLow: true,
          didSubmit: false
        });

        return;

      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false
        });
      }

      this.props.onSubmit(
        new ExtendLoanRequest(
          this.props.loanOrderState.loanAsset,
          this.props.loanOrderState.accountAddress,
          this.props.loanOrderState.loanOrderHash,
          this.state.depositAmount
        )
      );
    }
  };

  public onTradeAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    let inputAmountText = event.target.value ? event.target.value : "";
    let depositAmount = new BigNumber(inputAmountText);
    let selectedValue = this.getSelectedValue(inputAmountText);

    this.setState({
      ...this.state,
      depositAmount: depositAmount,
      inputAmountText: inputAmountText,
      selectedValue: selectedValue,
      currentValue: selectedValue,
      interestAmount: 0
    });
    this._inputTextChange.next(inputAmountText);
    this.selectedValueUpdate.next(this.state.selectedValue);
  };

  public updateDepositAmount = (value: number) => {
    if (value !== 0) {
      let depositAmount = this.state.maxDepositAmount.multipliedBy(value);
      let depositAmountText = depositAmount.toFixed(this._inputDecimals).toString();
      let selectedValue = value === 1 ? value * this.state.maxValue : value * (this.state.maxValue - this.state.minValue);
      this.setState({
        ...this.state,
        depositAmount: depositAmount,
        inputAmountText: depositAmountText,
        selectedValue: selectedValue,
        currentValue: selectedValue
      });
      this._inputTextChange.next(this.state.inputAmountText);
      this.selectedValueUpdate.next(this.state.selectedValue);
    }
  }

  public updateInterestAmount = (interest: number) => {
    this.setState({ ...this.state, interestAmount: interest })
  }

  private getMaxDepositAmount = async () => {
    let maxDepositAmount = await TorqueProvider.Instance.getLoanExtendEstimate(this.props.loanOrderState.interestOwedPerDay, this.state.maxValue);
    this.setState({ ...this.state, maxDepositAmount: maxDepositAmount.depositAmount });
    return maxDepositAmount.depositAmount;
  }
  
  public getSelectedValue = (value: string) => {
    let maxDepositAmountText = this.state.maxDepositAmount.toString();
    let maxDepositAmountNumber = Number(maxDepositAmountText);
    let depositAmountText = new BigNumber(value);
    let depositAmountNumber = Number(depositAmountText);
    let selectedValue = Math.round(depositAmountNumber * this.state.maxValue / maxDepositAmountNumber);
    return selectedValue;
  }
}
