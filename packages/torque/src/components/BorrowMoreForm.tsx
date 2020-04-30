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
import { CollateralSlider } from "./CollateralSlider";
import { Loader } from "./Loader";

export interface IBorrowMoreFormProps {
  loanOrderState: IBorrowMoreState;
  onSubmit?: (value: BorrowRequest) => void;
  onDecline: () => void;
}

interface IBorrowMoreFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;
  positionSafetyText: string;
  collateralizedStateSelector: string;
  collateralExcess: BigNumber;
  minCollateral: BigNumber;
  selectedValue: number;
  borrowAmount: BigNumber;
  loanAsset: Asset;
  loanValue: number;
  inputAmountText: string;
  depositAmount: BigNumber;
  gasAmountNeeded: BigNumber;
  interestRate: BigNumber;
  balanceTooLow: boolean;
  didSubmit: boolean;
  isLoading: boolean;
}

export class BorrowMoreForm extends Component<IBorrowMoreFormProps, IBorrowMoreFormState> {

  private _input: HTMLInputElement | null = null;

  private readonly _inputTextChange: Subject<string>;

  constructor(props: IBorrowMoreFormProps, context?: any) {
    super(props, context);

    this.state = {
      minValue: 0,
      maxValue: 100,
      assetDetails: null,
      selectedValue: 100,
      borrowAmount: new BigNumber(0),
      minCollateral: new BigNumber(0),
      collateralExcess: new BigNumber(0),
      loanAsset: TorqueProvider.Instance.isETHAsset(props.loanOrderState.loanAsset) ? Asset.DAI : Asset.ETH,
      loanValue: 0,
      inputAmountText: "",
      positionSafetyText: "",
      collateralizedStateSelector: "",
      depositAmount: new BigNumber(0),
      interestRate: new BigNumber(0),
      gasAmountNeeded: new BigNumber(3000000),
      balanceTooLow: false,
      didSubmit: false,
      isLoading: false
    };

    this._inputTextChange = new Subject<string>();
    this._inputTextChange
      .pipe(
        debounceTime(100),

        switchMap(value => this.rxConvertToBigNumber(value)),
        switchMap(value => this.rxGetEstimate(value))
      )
      .subscribe(async (value: BigNumber) => {

        const balanceTooLow = await this.checkBalanceTooLow(this.state.loanAsset);
        this.setState({ ...this.state, depositAmount: value, balanceTooLow: balanceTooLow });

        this.getCollateralPersent();
      });
  }


  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  public componentDidMount(): void {
    const assetDetails = AssetsDictionary.assets.get(this.props.loanOrderState.loanAsset) || null;

    let sliderValue = this.props.loanOrderState.collateralizedPercent.multipliedBy(100).plus(100).toNumber();

    //115%
    const sliderMin = this.props.loanOrderState.loanData!.maintenanceMarginAmount.div(10 ** 18).plus(100).toNumber();
    //300%
    let sliderMax = sliderMin + 185;

    if (sliderValue > sliderMax) {
      sliderMax = sliderValue;
    } else if (sliderValue < sliderMin) {
      sliderValue = sliderMin;
    }

    this.setState(
      {
        ...this.state,
        assetDetails: assetDetails,
        selectedValue: sliderValue,
        minValue: sliderMin,
        maxValue: sliderMax
      });

    TorqueProvider.Instance.getLoanCollateralManagementGasAmount().then(gasAmountNeeded => {
      TorqueProvider.Instance.getCollateralExcessAmount(this.props.loanOrderState).then(collateralExcess => {
        TorqueProvider.Instance.getAssetTokenBalanceOfUser(this.props.loanOrderState.collateralAsset).then(assetBalance => {


          let minCollateral;

          const currentCollateral = this.props.loanOrderState.collateralAmount;


          minCollateral = currentCollateral
            .dividedBy(sliderValue - sliderMin);


          if (minCollateral.lt(currentCollateral)) {
            minCollateral = currentCollateral;
          }


          this.setState(
            {
              ...this.state,
              loanValue: currentCollateral.toNumber(),
              minCollateral: minCollateral,
              collateralExcess: collateralExcess,
              gasAmountNeeded: gasAmountNeeded
            },
            () => {
              this._inputTextChange.next(this.state.inputAmountText);
            }
          );
        });
      });
    });
  };


  public componentDidUpdate(prevProps: Readonly<IBorrowMoreFormProps>, prevState: Readonly<IBorrowMoreFormState>, snapshot?: any): void {
    if (this.state.depositAmount !== prevState.depositAmount
      || this.state.loanAsset !== prevState.loanAsset) {
      this.changeStateLoading();
    }
  }


  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    const { loanOrderState } = this.props;

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
                        title={`${this.state.selectedValue.toFixed(18)}%`}
                        className={`borrow-more-loan-form__body-collateralized ${this.state.collateralizedStateSelector}`}>
                        <span className="value">{this.state.selectedValue.toFixed(2)}</span>%
                </div>
                    </React.Fragment>)}
                <div className="borrow-more-loan-form__body-collateralized-label">Collateralized</div>

              </div>

              <div className={`borrow-more-loan-form__body-collateralized-state ${this.state.collateralizedStateSelector}`}>
                {this.state.positionSafetyText}
              </div>
            </div>
          </div>

          <CollateralSlider
            readonly={true}
            showExactCollaterization={true}
            minValue={this.state.minValue}
            maxValue={this.state.maxValue}
            value={this.state.selectedValue}
          />

          <hr className="borrow-more-loan-form__delimiter" />

          <div className="input-container">
            <div className="input-row">
              <span className="asset-icon">{this.state.assetDetails.reactLogoSvg.render()}</span>
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
            {this.state.selectedValue == 115 || !Number(this.state.inputAmountText) ? (
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

  private rxGetEstimate = (inputAmount: BigNumber): Observable<BigNumber> => {

    return new Observable<BigNumber>(observer => {

      TorqueProvider.Instance.getBorrowDepositEstimate(
        this.props.loanOrderState.loanAsset,
        this.state.loanAsset,
        inputAmount
      ).then(value => {
        observer.next(value.depositAmount);
      });
    });
  };

  private rxConvertToBigNumber = (textValue: string): Observable<BigNumber> => {
    return new Observable<BigNumber>(observer => {
      observer.next(new BigNumber(textValue));
    });
  };


  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  };

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    let amountText = event.target.value ? event.target.value : "";
    const regexp = /^((\d{0,3}(\.\d{0,5})?)|(\.\d{0,5}}))$/;
    if (amountText === "" || regexp.test(amountText)) {
      // setting inputAmountText to update display at the same time

      if (Number(amountText) == 0) {
        this.setState({
          ...this.state,
          inputAmountText: amountText
        })
      } else {
        this.setState({
          ...this.state,
          inputAmountText: amountText,
          borrowAmount: new BigNumber(amountText)
        }, () => {
          // emitting next event for processing with rx.js
          this._inputTextChange.next(this.state.inputAmountText);
        });
      }
    }
  };


  private checkBalanceTooLow = async (loanAsset: Asset) => {
    const borrowEstimate = await this.getBorrowEstimate(loanAsset);
    let assetBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(loanAsset);
    if (loanAsset === Asset.ETH) {
      assetBalance = assetBalance.gt(TorqueProvider.Instance.gasBufferForTxn) ? assetBalance.minus(TorqueProvider.Instance.gasBufferForTxn) : new BigNumber(0);
    }
    const decimals = AssetsDictionary.assets.get(loanAsset)!.decimals || 18;
    const amountInBaseUnits = new BigNumber(borrowEstimate.depositAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
    return assetBalance.lt(amountInBaseUnits);
  }


  private getBorrowEstimate = async (loanAsset: Asset) => {

    const borrowEstimate = await TorqueProvider.Instance.getBorrowDepositEstimate(this.props.loanOrderState.loanAsset, loanAsset, this.state.borrowAmount);
    return borrowEstimate;
  }

  private getCollateralPersent = () => {

    const borrowAmount = this.state.depositAmount.multipliedBy(1.005).dp(5, BigNumber.ROUND_CEIL);
    let inputAmountText = this.state.inputAmountText;
    const defaultValue = this.props.loanOrderState.collateralizedPercent.times(100).plus(100);

    let selectedValue = defaultValue
      .minus(borrowAmount.times(500)).toNumber();

    if (selectedValue < 115) {
      selectedValue = this.state.minValue
    }

    const positionSafetyText = selectedValue > 125 ?
      "Safe" :
      selectedValue > 115 ?
        "Danger" :
        "Liquidation pending";

    const collateralizedStateSelector = positionSafetyText === "Safe" ?
      "safe" :
      positionSafetyText ? "danger" :
        "unsafe";


    this.setState({
      ...this.state,
      positionSafetyText: positionSafetyText,
      collateralizedStateSelector: collateralizedStateSelector,
      inputAmountText: inputAmountText,
      selectedValue: selectedValue,
    });
  }

  public changeStateLoading = () => {
    if (this.state.depositAmount) {
      this.setState({ ...this.state, isLoading: false })
    }
  }
}
