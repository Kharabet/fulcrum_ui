import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { ActionType } from "../domain/ActionType";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowMoreState } from "../domain/IBorrowMoreState";
import { IBorrowMoreEstimate } from "../domain/IBorrowMoreEstimate";
import { BorrowRequest } from "../domain/BorrowRequest";
import { TorqueProvider } from "../services/TorqueProvider";
import { Rail } from "./Rail";
import { Loader } from "./Loader";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import TagManager from "react-gtm-module";

export interface IBorrowMoreFormProps {
  loanOrderState: IBorrowedFundsState;
  onSubmit?: (value: BorrowRequest) => void;
  onDecline: () => void;
}

interface IBorrowMoreFormState {
  borrowMoreLoanOrderState: IBorrowedFundsState;
  borrowAmount: BigNumber;
  inputAmountText: string;
  didSubmit: boolean;
  isLoading: boolean;
}

export class BorrowMoreForm extends Component<IBorrowMoreFormProps, IBorrowMoreFormState> {

  private _input: HTMLInputElement | null = null;

  private readonly _inputTextChange: Subject<string>;

  constructor(props: IBorrowMoreFormProps, context?: any) {
    super(props, context);

    this.state = {
      borrowMoreLoanOrderState: Object.assign({}, props.loanOrderState),
      borrowAmount: new BigNumber(0),
      inputAmountText: "",
      didSubmit: false,
      isLoading: false
    };

    this._inputTextChange = new Subject<string>();
    this._inputTextChange
      .pipe(
        debounceTime(100)
      )
      .subscribe(async (inputAmountText: string) => {

        await this.getCollateralPercent(inputAmountText);
      });
  }


  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public componentDidMount(): void {

    // let sliderValue = this.props.loanOrderState.collateralizedPercent.multipliedBy(100).plus(100).toNumber();

    // //115%
    // const sliderMin = this.props.loanOrderState.loanData!.maintenanceMargin.div(10 ** 18).plus(100).toNumber();
    // //300%
    // let sliderMax = sliderMin + 185;

    // if (sliderValue > sliderMax) {
    //   sliderMax = sliderValue;
    // } else if (sliderValue < sliderMin) {
    //   sliderValue = sliderMin;
    // }

    // this.setState({
    //   ...this.state,
    //   selectedValue: sliderValue,
    //   minValue: sliderMin,
    //   maxValue: sliderMax
    // });

  };


  public componentDidUpdate(prevProps: Readonly<IBorrowMoreFormProps>, prevState: Readonly<IBorrowMoreFormState>, snapshot?: any): void {
    // if (this.state.depositAmount !== prevState.depositAmount
    //   || this.state.loanAsset !== prevState.loanAsset) {
    //   this.changeStateLoading();
    // }
  }


  public render() {
    const assetDetails = AssetsDictionary.assets.get(this.state.borrowMoreLoanOrderState.loanAsset) || null;

    if (assetDetails === null) {
      return null;
          }

    const loan = this.state.inputAmountText === ""
      ? this.props.loanOrderState
      : this.state.borrowMoreLoanOrderState;



    const positionSafetyText = TorqueProvider.Instance.getPositionSafetyText(loan);
    const collateralizedStateSelector = positionSafetyText === "Safe" ?
      "safe" :
      positionSafetyText === "Danger" ?
        "danger" :
        "unsafe";

    //115%
    const sliderMin = loan.loanData!.maintenanceMargin.div(10 ** 18).toNumber();
    //300%
    const sliderMax = sliderMin + 185;

    let sliderValue = loan.collateralizedPercent.multipliedBy(100).toNumber();
    if (sliderValue > sliderMax) {
      sliderValue = sliderMax;
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin;
    }

    return (
      <form className="borrow-more-loan-form" onSubmit={this.onSubmitClick}>
        <section className="dialog-content">
          <div className="borrow-more-loan-form__body">
            <div className="d-flex j-c-sb">

              <div>
                {this.state.isLoading
                  ? <Loader quantityDots={4} sizeDots={'middle'} title={''} isOverlay={false} />
                  : (
                    <React.Fragment>
                      <div
                        title={`${loan.collateralizedPercent.multipliedBy(100).plus(100).toFixed(18)}%`}
                        className={`borrow-more-loan-form__body-collateralized ${collateralizedStateSelector}`}>
                        <span className="value">{loan.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}</span>%
                </div>
                    </React.Fragment>)}
                <div className="borrow-more-loan-form__body-collateralized-label">Collateralized</div>

              </div>

              <div className={`borrow-more-loan-form__body-collateralized-state ${collateralizedStateSelector}`}>
                {positionSafetyText}
              </div>
            </div>
          </div>

          <Rail sliderValue={sliderValue} sliderMax={sliderMax} />

          <div className="input-container mt-30">
            <div className="input-row">
              <span className="asset-icon">{assetDetails.reactLogoSvg.render()}</span>
              {this.state.isLoading
                ? <Loader quantityDots={4} sizeDots={'middle'} title={''} isOverlay={false} />
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

          <div className="borrow-more-loan-form__actions-container">
            {loan.collateralizedPercent.times(100).plus(100).lte(115) || !Number(this.state.inputAmountText) ? (
              <button type="button" className="btn btn-size--small" onClick={this.props.onDecline}>
                Close
              </button>
            ) : (
                <button type="submit" className={`btn btn-size--small ${this.state.didSubmit ? `btn-disabled` : ``}`}>
                  {this.state.didSubmit ? "Submitting..." : "Borrow"}
                </button>

              )}
          </div>
        </section>
      </form >
    );
  }

  // private rxGetEstimate = (inputAmount: BigNumber): Observable<BigNumber> => {

  //   return new Observable<BigNumber>(observer => {

  //     TorqueProvider.Instance.getBorrowDepositEstimate(
  //       this.props.loanOrderState.loanAsset,
  //       this.props.loanOrderState.collateralAsset,
  //       inputAmount
  //     ).then(value => {
  //       observer.next(value.depositAmount);
  //     });
  //   });
  // };

  // private rxConvertToBigNumber = (textValue: string): Observable<BigNumber> => {
  //   return new Observable<BigNumber>(observer => {
  //     observer.next(new BigNumber(textValue));
  //   });
  // };


  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    if (this.state.borrowAmount.lte(0)) {
      return;
    }

    if (this.props.onSubmit && !this.state.didSubmit) {
      this.setState({ ...this.state, didSubmit: true });

      const randomNumber = Math.floor(Math.random() * 100000) + 1;
      const usdAmount = await TorqueProvider.Instance.getSwapToUsdRate(this.props.loanOrderState.loanAsset);
      let usdPrice = this.state.borrowAmount
      if (usdPrice !== null) {
        usdPrice = usdPrice.multipliedBy(usdAmount)
      }
      const tagManagerArgs = {
        dataLayer: {
          event: 'purchase',
          transactionId: randomNumber,
          transactionTotal: new BigNumber(usdPrice),
          transactionProducts: [{
            name: "Borrow-" + this.props.loanOrderState.loanAsset,
            sku: "Borrow-" + this.props.loanOrderState.loanAsset + '-' + this.props.loanOrderState.collateralAsset,
            category: "Borrow",
            price: new BigNumber(usdPrice),
            quantity: 1
          }],
        }
      }
      //console.log("tagManagerArgs = ", tagManagerArgs)
      TagManager.dataLayer(tagManagerArgs)

      this.props.onSubmit(
        new BorrowRequest(
          this.props.loanOrderState.loanId,
          this.props.loanOrderState.loanAsset,
          this.state.borrowAmount,
          this.props.loanOrderState.collateralAsset,
          new BigNumber(0)
        )
      );
    }
  };

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    let amountText = event.target.value ? event.target.value : "";
    if (amountText === "") return;
    const regexp = /^((\d{0,3}(\.\d{0,5})?)|(\.\d{0,5}}))$/;
    if (regexp.test(amountText)) {
      // setting inputAmountText to update display at the same time


        this.setState({
          ...this.state,
          inputAmountText: amountText,
          borrowAmount: new BigNumber(amountText)
        }, () => {
          // emitting next event for processing with rx.js
        this._inputTextChange.next(amountText);
        });
      }
  };


  // private checkBalanceTooLow = async (collateralAsset: Asset) => {
  //   const borrowEstimate = await this.getBorrowEstimate();
  //   const decimals = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
  //   let assetBalance = this.props.loanOrderState.collateralAmount.multipliedBy(10 ** decimals);
  //   if (collateralAsset === Asset.ETH) {
  //     console.log(TorqueProvider.Instance.gasBufferForTxn.toFixed())
  //     assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
  //   }
  //   const amountInBaseUnits = new BigNumber(borrowEstimate.depositAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
  //   return assetBalance.lt(borrowEstimate.depositAmount);
  // }


  // private getBorrowEstimate = async () => {

  //   const borrowEstimate = await TorqueProvider.Instance.getBorrowDepositEstimate(this.props.loanOrderState.loanAsset, this.props.loanOrderState.collateralAsset, this.state.borrowAmount);
  //   return borrowEstimate;
  // }

  private getCollateralPercent = async (inputAmountText: string) => {

    // const deposit = this.props.loanOrderState.collateralAmount.multipliedBy(1.005).dp(5, BigNumber.ROUND_CEIL);
    // const loanAmount = new BigNumber(inputAmountText).plus(this.props.loanOrderState.amountOwed);
    // const defaultValue = this.props.loanOrderState.collateralizedPercent.times(100).plus(100);
    // const collateralToLoanRate = await TorqueProvider.Instance.getSwapRate(this.props.loanOrderState.collateralAsset, this.props.loanOrderState.loanAsset);
    // const collaterzizationRatio = collateralToLoanRate.times(deposit).div(loanAmount);
    // let selectedValue = collaterzizationRatio;

    // const positionSafetyText = selectedValue.gt(125) ?
    //   "Safe" :
    //   selectedValue.gt(115) ?
    //     "Danger" :
    //     "Liquidation pending";

    // const collateralizedStateSelector = positionSafetyText === "Liquidation pending"
    //   ? "unsafe"
    //   : positionSafetyText.toLocaleLowerCase();
    const borrowMoreLoanOrderState = { ...this.props.loanOrderState};
    borrowMoreLoanOrderState.loanData = { ...this.props.loanOrderState.loanData!}; //deep copy
    const decimals = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset)!.decimals;
    borrowMoreLoanOrderState.loanData.principal = borrowMoreLoanOrderState.loanData!.principal.plus(new BigNumber(inputAmountText).times(10 ** decimals))
    // borrowMoreLoanOrderState.collateralizedPercent = selectedValue;
    const collateralChangeEstimate = await TorqueProvider.Instance.getLoanCollateralChangeEstimate(borrowMoreLoanOrderState, new BigNumber(0), false)
    borrowMoreLoanOrderState.collateralizedPercent = collateralChangeEstimate.collateralizedPercent.minus(100).div(100);
    this.setState({
      ...this.state,
      borrowMoreLoanOrderState
    });
  }

  // public changeStateLoading = () => {
  //   if (this.state.depositAmount) {
  //     this.setState({ ...this.state, isLoading: false })
  //   }
  // }
}
