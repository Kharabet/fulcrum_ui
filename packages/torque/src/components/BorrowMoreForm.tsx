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
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { OpsEstimatedResult } from "./OpsEstimatedResult";
import { RepayLoanSlider } from "./RepayLoanSlider";
import { CollateralSlider } from "./CollateralSlider";
import { LoaderData } from "./LoaderData";

export interface IBorrowMoreFormProps {
  loanOrderState: IBorrowedFundsState;

  onSubmit: (request: RepayLoanRequest) => void;
  onClose: () => void;
}

interface IBorrowMoreFormState {
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

  didSubmit: boolean;
  
  isLoading: boolean;
}

export class BorrowMoreForm extends Component<IBorrowMoreFormProps, IBorrowMoreFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputTextChange: Subject<string>;

  private readonly selectedValueUpdate: Subject<number>;

  constructor(props: IBorrowMoreFormProps, context?: any) {
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
      balanceTooLow: false,
      didSubmit: false,
        isLoading: false
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
          inputAmountText: Number(value.repayAmount.toFixed(5))==0?"0":value.repayAmount.toFixed(5)
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
      this.props.loanOrderState,
    ).then(collateralState => {
      TorqueProvider.Instance.getLoanRepayAddress(
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
    prevProps: Readonly<IBorrowMoreFormProps>,
    prevState: Readonly<IBorrowMoreFormState>,
    snapshot?: any
  ): void {
    if (
      prevProps.loanOrderState.accountAddress !== this.props.loanOrderState.accountAddress ||
      prevProps.loanOrderState.loanOrderHash !== this.props.loanOrderState.loanOrderHash ||
      prevState.selectedValue !== this.state.selectedValue
    ) {
      TorqueProvider.Instance.getLoanRepayAddress(
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
        {/* <CollateralSlider
              readonly={true}
              showExactCollaterization={positionSafetyText !== "Safe"}
              minValue={sliderMin}
              maxValue={sliderMax}
              value={sliderValue}
            /> */}
          

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

          {/* <hr className="repay-loan-form__delimiter" /> */}
       
{/* 
          <OpsEstimatedResult
            assetDetails={this.state.assetDetails}
            actionTitle="You will repay"
            amount={this.state.repayAmount}
            precision={6}
          />
           */}
          <div className="input-container">
                  <div className="input-row">
                    <span className="asset-icon">{this.state.assetDetails.reactLogoSvg.render()}</span>
                    {this.state.isLoading
                      ? <LoaderData />
                      : <React.Fragment>
                        <input
                          ref={this._setInputRef}
                          className="input-amount"
                          type="number"
                          step="any"
                          placeholder={`Enter amount`}
                          value={this.state.inputAmountText}
                          onChange={this.onTradeAmountChange}
                        />
                      </React.Fragment>
                    }
                  </div>
                </div>

        </section>
        <section className="dialog-actions">
          <div className="repay-loan-form__actions-container">
            <button type="submit" className={`btn btn-size--small ${this.state.didSubmit ? `btn-disabled` : ``}`}>
              {this.state.didSubmit ? "Submitting..." : "Repay"}
            </button>
          </div>
        </section>
      </form>
    );
  }

  private rxGetEstimate = (selectedValue: number): Observable<IRepayEstimate> => {
    return new Observable<IRepayEstimate>(observer => {
      TorqueProvider.Instance.getLoanRepayEstimate(
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

    if (!this.state.didSubmit) {
      this.setState({...this.state, didSubmit: true});

      let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.loanAsset);
      if (this.props.loanOrderState.loanAsset === Asset.ETH) {
        assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
      }
      const precision = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals || 18;
      const amountInBaseUnits = new BigNumber(repayAmount.multipliedBy(10 ** precision).toFixed(0, 1));
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

      const percentData = await TorqueProvider.Instance.getLoanRepayPercent(
        this.props.loanOrderState,
        repayAmount
      );

      this.props.onSubmit(
        new RepayLoanRequest(
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
    const regexp = /^[-]?((\d+(\.\d{0,5})?)|(\.\d{0,5}}))$/;
    if (amountText === "" || regexp.test(amountText)) {
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
  }
  };
}
