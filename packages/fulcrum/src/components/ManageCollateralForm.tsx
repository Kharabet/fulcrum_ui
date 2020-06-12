import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { TradeRequest } from "../domain/TradeRequest";
import Slider from "rc-slider"
import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { InputAmount } from "./InputAmount";
import { TradeType } from "../domain/TradeType"

import "../styles/components/manage-collateral-form.scss";
import { PositionType } from "../domain/PositionType";

export interface IManageCollateralFormProps {
  loan?: IBorrowedFundsState

  onSubmit: (request: ManageCollateralRequest) => void;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => void;
  onCancel: () => void;
  isMobileMedia: boolean;
  isOpenModal: boolean;
}

interface IManageCollateralFormState {
  assetDetails: AssetDetails | null;

  minValue: number;
  maxValue: number;

  loanValue: number;
  selectedValue: number;
  assetBalanceValue: BigNumber;

  collateralAmount: BigNumber;
  collateralExcess: BigNumber;
  gasAmountNeeded: BigNumber;
  collateralizedPercent: BigNumber;
  balanceTooLow: boolean;

  inputAmountText: string;

  didSubmit: boolean;
  isLoading: boolean;
}

export default class ManageCollateralForm extends Component<IManageCollateralFormProps, IManageCollateralFormState> {

  private readonly _inputPrecision = 6;

  private readonly _inputChange: Subject<string>;
  private readonly _selectedValueUpdate: Subject<BigNumber>;

  constructor(props: IManageCollateralFormProps, context?: any) {
    super(props, context);


    this.state = {
      minValue: 0,
      maxValue: 0,
      assetDetails: null,
      selectedValue: 0,
      loanValue: 0,
      assetBalanceValue: new BigNumber(0),
      gasAmountNeeded: new BigNumber(0),
      collateralAmount: new BigNumber(0),
      collateralExcess: new BigNumber(0),
      collateralizedPercent: new BigNumber(0),
      balanceTooLow: false,
      inputAmountText: "",
      didSubmit: false,
      isLoading: true
    };

    this._inputChange = new Subject();
    this._selectedValueUpdate = new Subject();

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(100),
        switchMap((value) => this.rxFromInputAmount(value)),
      ),
      this._selectedValueUpdate.pipe(
        distinctUntilChanged(),
        switchMap((value) => this.rxFromSelectedValue(value)),
      )
    ).pipe(
      switchMap((value) => this.rxFromCurrentAmount(value))
    ).pipe(
      switchMap((value) => new Observable<ICollateralChangeEstimate | null>((observer) => observer.next(value)))
    ).
      subscribe((next) => {
        this.setState({
          ...this.state,
          collateralAmount: next!.collateralAmount,
          collateralizedPercent: next!.collateralizedPercent,
          inputAmountText: this.formatPrecision(next!.collateralAmount.toString())
        });

        // console.log("collateralAmount2 " + this.state.collateralizedPercent.dividedBy(persent).minus(1).multipliedBy(this.props.loan!.collateralAmount).toFixed(6));
        //  console.log("1 " + this.state.collateralAmount.dividedBy(this.props.loan!.collateralAmount).toFixed(6));

        //console.log("2  " + this.state.collateralizedPercent.dividedBy(persent).minus(1).toFixed(6));
      });
  }

  public componentWillUnmount(): void {
    window.history.pushState(null, "Manage Collateral Modal Closed", `/trade`);
  }


  public async componentDidMount() {

    FulcrumProvider.Instance.getManageCollateralParams(
    ).then(collateralState => {

      this.setState(
        {
          ...this.state,
          minValue: collateralState.minValue,
          maxValue: collateralState.maxValue,
          assetDetails: AssetsDictionary.assets.get(this.props.loan!.collateralAsset) || null,

        });

      FulcrumProvider.Instance.getManageCollateralGasAmount().then(gasAmountNeeded => {
        FulcrumProvider.Instance.getManageCollateralExcessAmount(this.props.loan!).then(collateralExcess => {
          FulcrumProvider.Instance.getAssetTokenBalanceOfUser(this.props.loan!.collateralAsset).then(assetBalance => {

            const collateralizedPercent = this.props.loan!.collateralizedPercent
              .multipliedBy(100)
              .plus(100);


            let minCollateral;
            let maxCollateral;


            const currentCollateral = this.props.loan!.collateralAmount
              .times(10 ** 18);


            const minValue = new BigNumber(collateralState.minValue)
              .minus(//collateralizedPercent
                // .dividedBy(collateralState.minValue)
                (this.props.loan!.collateralAmount).times(9 * 10 ** 16))
              .toNumber();

            const maxValue = new BigNumber(collateralState.maxValue)
              .minus((this.props.loan!.collateralAmount)
                .times(9 * 10 ** 18))
              .toNumber();

            console.log("minValue " + minValue);

            minCollateral = this.props.loan!.collateralAmount
              .minus(collateralExcess)
              .times(10 ** 18);

            maxCollateral = minCollateral
              .times(maxValue - minValue)
              .dividedBy(10 ** 20);

            if (maxCollateral.lt(currentCollateral)) {
              maxCollateral = currentCollateral;
            }

            // new_v = (new_max - new_min) / (old_max - old_min) * (v - old_min) + new_min
            let currentCollateralNormalizedBN = new BigNumber(maxValue - minValue)
              .dividedBy(maxCollateral.minus(minCollateral))
              .times(currentCollateral.minus(minCollateral))
              .plus(minValue);

            if (currentCollateralNormalizedBN.dividedBy(maxValue - minValue).lte(0.01)) {
              currentCollateralNormalizedBN = new BigNumber(minValue);
            }


            // check balance
            if (this.props.loan!.collateralAsset === Asset.ETH) {
              assetBalance = assetBalance.gt(FulcrumProvider.Instance.gasBufferForTrade) ? assetBalance.minus(FulcrumProvider.Instance.gasBufferForTrade) : new BigNumber(0);
            }
            let assetBalanceNormalizedBN = new BigNumber(maxValue - minValue)
              .dividedBy(maxCollateral.minus(minCollateral))
              .times(assetBalance.minus(minCollateral))
              .plus(minValue);

            if (assetBalanceNormalizedBN.dividedBy(maxValue - minValue).lte(0.01)) {
              assetBalanceNormalizedBN = new BigNumber(minValue);
            }



            this.setState(
              {
                ...this.state,
                assetDetails: AssetsDictionary.assets.get(this.props.loan!.collateralAsset) || null,
                loanValue: currentCollateralNormalizedBN.toNumber(),
                selectedValue: currentCollateralNormalizedBN.toNumber(),
                gasAmountNeeded: gasAmountNeeded,
                collateralizedPercent: collateralizedPercent,
                collateralExcess: collateralExcess,
                assetBalanceValue: assetBalanceNormalizedBN,
                minValue: minValue,
                maxValue: maxValue,
              },
              () => {
                if (this.props.isOpenModal) {
                  window.history.pushState(null, "Manage Collateral Modal Opened", `/trade/manage-collateral/`);
                  this._selectedValueUpdate.next(new BigNumber(this.state.selectedValue));
                }
              }
            );
          });
        });
      });
    });

  }
  /* public componentDidUpdate(
     prevProps: Readonly<IManageCollateralFormProps>,
     prevState: Readonly<IManageCollateralFormState>,
     snapshot?: any
   ): void {
     this.state.selectedValue === prevState.inputAmountText
     this.state.inputAmountText === prevState.inputAmountText &&
       (this.state.selectedValue === this.state.minValue
         || this.state.selectedValue === this.state.maxValue)
       &&
       this._selectedValueUpdate.next(new BigNumber(this.state.selectedValue));
   }*/

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    const amountMsg =
      this.state.assetBalanceValue && this.state.assetBalanceValue.lte(this.state.gasAmountNeeded)
        ? "Insufficient funds for gas"
        : this.state.balanceTooLow
          ? "Your wallet is empty" :
          "";

    return (
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick} >
        <div> <CloseIcon className="close-icon" onClick={this.props.onCancel} />

          <div className="manage-collateral-form__title">Manage Collateral</div>
          <div className="manage-collateral-form__text">Your position is collateralized</div>
          <div className="manage-collateral-form__collaterized"><span>{this.state.collateralizedPercent.toFixed(2)}</span>%</div>

          <Slider
            step={0.01}
            min={this.state.minValue}
            max={this.state.maxValue}
            value={this.state.selectedValue}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
          />

          <div className="manage-collateral-form__tips">
            <div className="manage-collateral-form__tip">Withdraw</div>
            <div className="manage-collateral-form__tip">Top Up</div>
          </div>
          <div className="manage-collateral-form__text">
            You will {this.state.loanValue > this.state.selectedValue ? "withdraw" : "top up"}</div>


          <div className="manage-collateral-form__input-amount-form" >
            <div className={`manage-collateral-form__form-container`}>
              <div className="manage-collateral-form__form-values-container">

                <div className="manage-collateral-form__kv-container">
                  <div className="manage-collateral-form__label">{!this.state.isLoading && amountMsg}</div>
                </div>

                <InputAmount
                  inputAmountText={this.state.inputAmountText}
                  isLoading={this.state.isLoading}
                  selectedAsset={this.props.loan!.collateralAsset}
                  onInsertMaxValue={this.onInsertMaxValue}
                  onTradeAmountChange={this.onTradeAmountChange}
                  onCollateralChange={this.onCollateralChange}
                />
              </div>
            </div>

          </div>

          <div className="manage-collateral-form__actions-container">
            {this.state.loanValue > this.state.selectedValue ? (
              <button type="submit" className="manage-collateral-form__action-withdraw">
                Withdraw
              </button>
            ) : (
                <button type="submit" className="manage-collateral-form__action-top-up">
                  Top Up
                </button>
              )}
          </div>
        </div>

      </form>
    );
  }

  private onChange = (value: number) => {
    this.setState({ ...this.state, selectedValue: value, isLoading: true });
  };

  private onAfterChange = (value: number) => {
    this._selectedValueUpdate.next(new BigNumber(this.state.selectedValue));
  };


  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";

    // setting Text to update display at the same time
    this.setState({ ...this.state, inputAmountText: amountText }, () => {
      this._inputChange.next(this.state.inputAmountText)
    });
  };

  public onInsertMaxValue = async (value: number) => {
    const selectedValue = new BigNumber(this.state.maxValue).multipliedBy(value);

    this.setState({ ...this.state, selectedValue: selectedValue.toNumber(), isLoading: true }, () => {
      // emitting next event for processing with rx.js 
      this._selectedValueUpdate.next(selectedValue);
    });
  };

  public onCollateralChange = async (asset: Asset) => {
    this._selectedValueUpdate.next();
  };


  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // console.log(this.state.collateralAmount.toString(), new BigNumber(this.state.loanValue).dividedBy(10**18).toString(), new BigNumber(this.state.selectedValue).dividedBy(10**18).toString());
    if (!this.state.didSubmit && this.state.collateralAmount.gt(0)) {
      this.setState({ ...this.state, didSubmit: true });

      if (this.state.loanValue < this.state.selectedValue) {
        let assetBalance = await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(this.props.loan!.collateralAsset);
        if (this.props.loan!.collateralAsset === Asset.ETH) {
          assetBalance = assetBalance.gt(FulcrumProvider.Instance.gasBufferForTrade) ? assetBalance.minus(FulcrumProvider.Instance.gasBufferForTrade) : new BigNumber(0);
        }
        const precision = AssetsDictionary.assets.get(this.props.loan!.collateralAsset)!.decimals || 18;
        const amountInBaseUnits = new BigNumber(this.state.collateralAmount.multipliedBy(10 ** precision).toFixed(0, 1));
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
      } else {
        this.setState({
          ...this.state,
          balanceTooLow: false
        });
      }

      const request = new TradeRequest(
        this.props.loan!.loanId || "0x0000000000000000000000000000000000000000000000000000000000000000",
        TradeType.SELL,
        this.props.loan!.loanAsset,
        Asset.UNKNOWN,
        this.props.loan!.collateralAsset,
        PositionType.LONG,
        0,
        new BigNumber(0)
      )

      this.props.changeLoadingTransaction(true, request, false, false);

      this.props.onSubmit(
        new ManageCollateralRequest(
          this.props.loan!.loanId || "0x0000000000000000000000000000000000000000000000000000000000000000",
          this.props.loan!.loanAsset,
          this.props.loan!.collateralAsset,
          new BigNumber(this.state.collateralAmount),
          this.state.loanValue > this.state.selectedValue
        )
      );
      


    }
  };

  private rxFromSelectedValue = (value: BigNumber): Observable<number> => {
    return new Observable<number>(observer => {
      this.setState({ ...this.state, isLoading: true });
      observer.next(value.toNumber());
    });
  };

  private rxFromInputAmount = (value: string): Observable<number> => {

    return new Observable<number>(observer => {
      let collateralAmount = new BigNumber(Math.abs(Number(value)));
      let selectedValue = (Number(value) > 0 ?
        collateralAmount
          .dividedBy(this.props.loan!.collateralAmount)
          .multipliedBy(this.state.maxValue - this.state.loanValue)
          .plus(this.state.loanValue)
        :
        new BigNumber(this.state.loanValue)
          .minus(
            collateralAmount
              .dividedBy(this.state.collateralExcess)
              .multipliedBy(this.state.loanValue)
          )).toNumber();

      // if (selectedValue > this.state.maxValue) {
      //   selectedValue = this.state.maxValue;
      // } else
      if (selectedValue < this.state.minValue) {
        selectedValue = this.state.minValue;
      }

      this.setState({ ...this.state, selectedValue: selectedValue });

      observer.next(selectedValue);
    });
  };

  private rxFromCurrentAmount = (value: number): Observable<ICollateralChangeEstimate> => {
    return new Observable<ICollateralChangeEstimate>(observer => {
      let collateralAmount = new BigNumber(0);
      if (this.state.loanValue !== value && this.props.loan!.loanData) {
        if (value < this.state.loanValue) {
          collateralAmount = new BigNumber(this.state.loanValue)
            .minus(value)
            .dividedBy(this.state.loanValue)
            .multipliedBy(this.state.collateralExcess);
        } else {
          collateralAmount = new BigNumber(value)
            .minus(this.state.loanValue)
            .dividedBy(this.state.maxValue - this.state.loanValue)
            .multipliedBy(this.props.loan!.collateralAmount);
        }
        this.setState({ ...this.state, collateralAmount: collateralAmount });

        // console.log(collateralAmount.toString(), this.state.maxValue, this.props.loan!.collateralAmount.toString());
      }

      FulcrumProvider.Instance.getManageCollateralChangeEstimate(
        this.props.loan!,
        collateralAmount,
        value < this.state.loanValue
      ).then(value => {
        observer.next(value);
        this.changeStateLoading();
      });
    });
  };

  public changeStateLoading = () => {
    if (this.state.collateralAmount) {
      this.setState({ ...this.state, isLoading: false })
    }
  }

  public formatPrecision(outputText: string): string {
    const output = Number(outputText);
    let sign = "";
    if (this.state.loanValue > this.state.selectedValue)
      sign = "-";
    let n = Math.log(Math.abs(output)) / Math.LN10;
    let x = 4 - n;
    if (x < 0) x = 0;
    if (x > 5) x = 5;
    var m = Math.pow(10, x);
    let result = new Number(Math.floor(output * m) / m).toString();
    return result != "0" ? sign + result : result;
  }
}
