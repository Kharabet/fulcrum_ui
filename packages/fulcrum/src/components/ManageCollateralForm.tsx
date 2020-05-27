import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { CollateralSlider } from "./CollateralSlider";

import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import TagManager from "react-gtm-module";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ReactComponent as SlippageDown } from "../assets/images/ic__slippage_down.svg"
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary, AssetsDictionaryMobile } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { InputAmount } from "./InputAmount";

import "../styles/components/manage-collateral-form.scss";

interface IInputAmountLimited {
  inputAmountValue: BigNumber;
  inputAmountText: string;
  tradeAmountValue: BigNumber;
  maxTradeValue: BigNumber;
}

interface ITradeExpectedResults {
  tradedAmountEstimate: BigNumber;
  slippageRate: BigNumber;
  exposureValue: BigNumber;
}

interface ITradeAmountChangeEvent {
  isTradeAmountTouched: boolean;

  inputAmountText: string;
  inputAmountValue: BigNumber;
  tradeAmountValue: BigNumber;
  maxTradeValue: BigNumber;

  tradedAmountEstimate: BigNumber;
  slippageRate: BigNumber;
  exposureValue: BigNumber;
  selectedValue: number;
}

export interface IManageCollateralFormProps {
  onSubmit: (request: ManageCollateralRequest) => void;
  onCancel: () => void;

  tradeType: TradeType;
  asset: Asset;
  positionType: PositionType;
  leverage: number;
  defaultCollateral: Asset;
  defaultUnitOfAccount: Asset;
  defaultTokenizeNeeded: boolean;
  bestCollateral: Asset;
  version: number;
  isMobileMedia: boolean;
  isOpenModal: boolean;
  onManage: (request: ManageCollateralRequest) => void;
}

interface IManageCollateralFormState {
  positionValue: number;
  selectedValue: number;
  diffAmount: BigNumber;
  collateralAmount: BigNumber;
  gasAmountNeeded: BigNumber;
  collateralizedPercent: BigNumber;

  assetDetails: AssetDetails | null;
  collateral: Asset;
  tokenizeNeeded: boolean;
  interestRate: BigNumber | null;

  isTradeAmountTouched: boolean;

  inputAmountText: string;
  inputAmountValue: BigNumber;
  tradeAmountValue: BigNumber;
  maxTradeValue: BigNumber;

  balance: BigNumber | null;
  ethBalance: BigNumber | null;
  positionTokenBalance: BigNumber | null;
  maybeNeedsApproval: boolean;

  isChangeCollateralOpen: boolean;

  tradedAmountEstimate: BigNumber;
  slippageRate: BigNumber;
  pTokenAddress: string;

  currentPrice: BigNumber;
  liquidationPrice: BigNumber;
  exposureValue: BigNumber;

  isAmountExceeded: boolean;
  maxAmountMultiplier: BigNumber;

  isLoading: boolean;
  isExposureLoading: boolean;

  selectedUnitOfAccount: Asset;
}

export default class ManageCollateralForm extends Component<IManageCollateralFormProps, IManageCollateralFormState> {
  private minValue: number = 115;
  private maxValue: number = 300;

  //#region tradeComponent
  private readonly _inputPrecision = 6;

  private readonly _inputChange: Subject<string>;
  private readonly _inputSetMax: Subject<BigNumber>;

  private _isMounted: boolean;

  constructor(props: IManageCollateralFormProps, context?: any) {
    super(props, context);
    let assetDetails = AssetsDictionary.assets.get(props.asset);
    if (this.props.isMobileMedia) {
      assetDetails = AssetsDictionaryMobile.assets.get(this.props.asset);
    }
    const interestRate = null;
    const balance = null;
    const ethBalance = null;
    const positionTokenBalance = null;
    const maxTradeValue = new BigNumber(0);
    const slippageRate = new BigNumber(0);
    const tradedAmountEstimate = new BigNumber(0);
    const currentPrice = new BigNumber(0);
    const liquidationPrice = new BigNumber(0);
    const exposureValue = new BigNumber(0);
    const maxAmountMultiplier = new BigNumber(0);
    this._isMounted = false;
    this.state = {
      positionValue: 150,
      selectedValue: 150,
      diffAmount: new BigNumber(0),

      collateralAmount: new BigNumber(0),
      gasAmountNeeded: new BigNumber(0),
      collateralizedPercent: new BigNumber(0),

      assetDetails: assetDetails || null,
      collateral: props.bestCollateral,
      tokenizeNeeded: props.defaultTokenizeNeeded,
      isTradeAmountTouched: false,
      inputAmountText: "",
      inputAmountValue: maxTradeValue,
      tradeAmountValue: maxTradeValue,
      maxTradeValue: maxTradeValue,
      balance: balance,
      ethBalance: ethBalance,
      positionTokenBalance: positionTokenBalance,
      isChangeCollateralOpen: false,
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate,
      interestRate: interestRate,
      pTokenAddress: "",
      maybeNeedsApproval: false,
      currentPrice: currentPrice,
      liquidationPrice: liquidationPrice,
      exposureValue: exposureValue,
      isAmountExceeded: false,
      maxAmountMultiplier: maxAmountMultiplier,
      isLoading: true,
      isExposureLoading: true,
      selectedUnitOfAccount: this.props.defaultUnitOfAccount

    };

    this._inputChange = new Subject();
    this._inputSetMax = new Subject();

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((value) => this.rxFromCurrentAmount(value))
      ),
      this._inputSetMax.pipe(
        switchMap((value) => this.rxFromMaxAmountWithMultiplier(value))
      )
    ).pipe(
      switchMap((value) => new Observable<ITradeAmountChangeEvent | null>((observer) => observer.next(value)))
    ).subscribe(next => {
      if (next) {
        this._isMounted && this.setState({ ...this.state, ...next, isLoading: false, isExposureLoading: false });
      } else {
        this._isMounted && this.setState({
          ...this.state,
          isTradeAmountTouched: false,
          inputAmountText: "",
          inputAmountValue: new BigNumber(0),
          tradeAmountValue: new BigNumber(0),
          tradedAmountEstimate: new BigNumber(0),
          slippageRate: new BigNumber(0),
          exposureValue: new BigNumber(0),
          isLoading: false,
          isExposureLoading: false,
          selectedValue: 150
        })
      }
    });
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }


  private getTradeTokenGridRowSelectionKey(leverage: number = this.props.leverage) {
    return new TradeTokenKey(
      this.props.asset,
      this.state.selectedUnitOfAccount,
      this.props.positionType,
      leverage,
      this.state.tokenizeNeeded,
      this.props.version
    );
  }


  private async derivedUpdate() {
    let assetDetails = AssetsDictionary.assets.get(this.props.asset);
    if (this.props.isMobileMedia) {
      assetDetails = AssetsDictionaryMobile.assets.get(this.props.asset);
    }
    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.props.leverage);
    const interestRate = await FulcrumProvider.Instance.getTradeTokenInterestRate(tradeTokenKey);
    const positionTokenBalance = await FulcrumProvider.Instance.getPTokenBalanceOfUser(tradeTokenKey);
    const balance =
      this.props.tradeType === TradeType.BUY
        ? await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(this.state.collateral)
        : positionTokenBalance;
    const ethBalance = await FulcrumProvider.Instance.getEthBalance();
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey, this.state.collateral);

    const limitedAmount = await this.getInputAmountLimited(this.state.inputAmountText, this.state.inputAmountValue, tradeTokenKey, maxTradeValue, false);

    const collateralRequest = new ManageCollateralRequest(
      new BigNumber(this.state.selectedValue),
      this.props.tradeType,
      this.props.asset,
      this.state.selectedUnitOfAccount,
      this.state.collateral,
      this.props.positionType,
      this.props.leverage,
      limitedAmount.tradeAmountValue,// new BigNumber(0),
      this.state.tokenizeNeeded,
      this.props.version,
      this.state.inputAmountValue
    );

    const tradeExpectedResults = await this.getTradeExpectedResults(collateralRequest);

    const address = FulcrumProvider.Instance.contractsSource
      ? await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || ""
      : "";

    const maybeNeedsApproval = this.props.tradeType === TradeType.BUY ?
      await FulcrumProvider.Instance.checkCollateralApprovalForTrade(collateralRequest) :
      false;

    const latestPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);
    const liquidationPrice = new BigNumber(latestPriceDataPoint.liquidationPrice);
    //#endregion tradeComponent
    const collateralizedPercent = maxTradeValue.dividedBy(2 * this.state.positionValue);

    this._isMounted && this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      inputAmountText: limitedAmount.inputAmountText,// "",
      inputAmountValue: limitedAmount.inputAmountValue,// new BigNumber(0),
      tradeAmountValue: limitedAmount.tradeAmountValue,// new BigNumber(0),
      maxTradeValue: limitedAmount.maxTradeValue,
      balance: balance,
      ethBalance: ethBalance,
      positionTokenBalance: positionTokenBalance,
      tradedAmountEstimate: tradeExpectedResults.tradedAmountEstimate,
      slippageRate: tradeExpectedResults.slippageRate,
      interestRate: interestRate,
      pTokenAddress: address,
      maybeNeedsApproval: maybeNeedsApproval,
      currentPrice: new BigNumber(latestPriceDataPoint.price),
      liquidationPrice: liquidationPrice,
      exposureValue: tradeExpectedResults.exposureValue,

      collateralizedPercent: collateralizedPercent,
    });
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    window.history.pushState(null, "Manage Collateral Modal Closed", `/trade`);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public async componentDidMount() {
    this._isMounted = true;
    await this.derivedUpdate();
    if (this.props.isOpenModal) {
      window.history.pushState(null, "Manage Collateral Modal Opened", `/trade/manage-${this.props.leverage}x-${this.props.positionType.toLocaleLowerCase()}-${this.props.asset}/`);
      this.onInsertMaxValue(.5);
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(this.state.gasAmountNeeded)
        ? "Insufficient funds for gas"
        : this.state.balance && this.state.balance.eq(0)
          ? "Your wallet is empty"
          : (this.state.tradeAmountValue.gt(0) && this.state.slippageRate.eq(0))
            && (this.state.collateral === Asset.ETH || !this.state.maybeNeedsApproval)
            ? ``// `Your trade is too small.`
            : this.state.slippageRate.gte(0.01) && this.state.slippageRate.lt(99) // gte(0.2)
              ? `Slippage:`
              : "";

    return (
      <form className="manage-collateral-form" onSubmit={this.onSubmitClick}>
        <div> <CloseIcon className="close-icon" onClick={this.props.onCancel} />

          <div className="manage-collateral-form__title">Manage Collateral</div>
          <div className="manage-collateral-form__text">Your position is collateralized</div>
          <div className="manage-collateral-form__collaterized"><span>{this.state.selectedValue.toFixed(2)}</span>%</div>

          <CollateralSlider
            minValue={this.minValue}
            maxValue={this.maxValue}
            value={this.state.selectedValue}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
          />

          <div className="manage-collateral-form__tips">
            <div className="manage-collateral-form__tip">Withdraw</div>
            <div className="manage-collateral-form__tip">Top Up</div>
          </div>

          <div className="manage-collateral-form__text">
            You will {this.state.positionValue > this.state.selectedValue ? "withdraw" : "top up"}</div>


          <div className="manage-collateral-form__input-amount-form" >
            <div className={`manage-collateral-form__form-container  ${this.props.tradeType === TradeType.BUY ? "buy" : "sell"}`}>
              <div className="manage-collateral-form__form-values-container">

                <div className="manage-collateral-form__kv-container">
                  {amountMsg.includes("Slippage:") ? (
                    <div title={`${this.state.slippageRate.toFixed(18)}%`} className="manage-collateral-form__label slippage">
                      {amountMsg}
                      <span className="manage-collateral-form__slippage-amount">
                        &nbsp;{`${this.state.slippageRate.toFixed(2)}%`}<SlippageDown />
                      </span>
                    </div>
                  ) : (<div className="manage-collateral-form__label">{amountMsg}</div>)}

                </div>
                <InputAmount
                  inputAmountText={this.state.inputAmountText}
                  isLoading={this.state.isLoading}
                  tradeType={this.props.tradeType}
                  asset={this.state.collateral}
                  onInsertMaxValue={this.onInsertMaxValue}
                  onTradeAmountChange={this.onTradeAmountChange}
                  onCollateralChange={this.onCollateralChange}
                />
              </div>
            </div>

          </div>

          <div className="manage-collateral-form__actions-container">
            {this.state.positionValue > this.state.selectedValue ? (
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
    this.setState({ ...this.state, selectedValue: value });

    const collateralAmount = this.state.collateralizedPercent.multipliedBy(this.state.selectedValue);
    this._inputChange.next(collateralAmount.toFixed(4));
  };

  private onUpdate = (value: number) => {
    this.setState({ ...this.state, selectedValue: value, isLoading: true });

    const collateralAmount = this.state.collateralizedPercent.multipliedBy(this.state.selectedValue);
    this._inputChange.next(collateralAmount.toFixed(4));
  };


  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";

    // setting Text to update display at the same time
    this._isMounted && this.setState({ ...this.state, inputAmountText: amountText }, () => {
      // emitting next event for processing with rx.js
      this._inputChange.next(this.state.inputAmountText);
    });
  };

  public onInsertMaxValue = async (value: number) => {
    this._isMounted && this.setState({ ...this.state }, () => {
      // emitting next event for processing with rx.js
      this._inputSetMax.next(new BigNumber(value));
    });
  };

  public onCollateralChange = async (asset: Asset) => {
    await this._isMounted && this.setState({ ...this.state, collateral: asset });

    this._inputSetMax.next();
  };

  public onChangeUnitOfAccount = (asset: Asset) => {
    let version = 2;
    const key = new TradeTokenKey(this.props.asset, asset, this.props.positionType, this.props.leverage, this.state.tokenizeNeeded, version);
    if (key.erc20Address === "") {
      version = 1;
    }

    this._isMounted && this.setState({ ...this.state, selectedUnitOfAccount: asset });

    this.props.onManage(
      new ManageCollateralRequest(
        new BigNumber(this.state.selectedValue),
        this.props.tradeType,
        this.props.asset,
        asset,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmountValue,
        this.state.tokenizeNeeded,
        version,
        this.state.inputAmountValue
      )
    );
  };

  public onChangeTokenizeNeeded = async (event: ChangeEvent<HTMLInputElement>) => {
    this._isMounted && this.setState({ ...this.state, tokenizeNeeded: event.target.checked });
  };

  public onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const usdAmount = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.asset)

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.tradeAmountValue.isPositive()) {
      this.props.onCancel();
      return;
    }
    let usdPrice = this.state.tradeAmountValue
    if (usdPrice != null) {
      usdPrice = usdPrice.multipliedBy(usdAmount)
    }

    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const tagManagerArgs = {
      dataLayer: {
        event: 'purchase',
        transactionId: randomNumber,
        transactionTotal: new BigNumber(usdPrice),
        transactionProducts: [{
          name: this.props.leverage + 'x' + this.props.asset + '-' + this.props.positionType + '-' + this.state.selectedUnitOfAccount,
          sku: this.props.leverage + 'x' + this.props.asset + '-' + this.props.positionType,
          category: this.props.positionType,
          price: new BigNumber(usdPrice),
          quantity: 1
        }],
      }
    }
    TagManager.dataLayer(tagManagerArgs)
    this.props.onSubmit(
      new ManageCollateralRequest(
        new BigNumber(this.state.selectedValue),
        this.props.tradeType,
        this.props.asset,
        this.state.selectedUnitOfAccount,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmountValue,
        this.state.tokenizeNeeded,
        this.props.version,
        this.state.inputAmountValue
      )
    );
  };

  private rxFromMaxAmountWithMultiplier = (multiplier: BigNumber): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>(observer => {

      this._isMounted && this.setState({ ...this.state, isLoading: true });
      const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();

      FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey, this.state.collateral)
        .then(maxTradeValue => {
          // maxTradeValue is raw here, so we should not use it directly
          const selectedValue = new BigNumber(maxTradeValue).multipliedBy(multiplier).dividedBy(this.state.collateralizedPercent).toNumber();
          let value = maxTradeValue;
          if (selectedValue < this.minValue) {
            value = new BigNumber(this.minValue).multipliedBy(this.state.collateralizedPercent);
            multiplier = new BigNumber(1);
          }

          this.getInputAmountLimitedFromBigNumber(value, tradeTokenKey, maxTradeValue, multiplier, true).then(limitedAmount => {
            if (!limitedAmount.tradeAmountValue.isNaN()) {

              const selectedValue = limitedAmount.inputAmountValue.dividedBy(this.state.collateralizedPercent).toNumber();

              const collateralRequest = new ManageCollateralRequest(
                new BigNumber(this.state.selectedValue),
                this.props.tradeType,
                this.props.asset,
                this.state.selectedUnitOfAccount,
                this.state.collateral,
                this.props.positionType,
                this.props.leverage,
                limitedAmount.tradeAmountValue,
                this.state.tokenizeNeeded,
                this.props.version,
                this.state.inputAmountValue
              );

              this.getTradeExpectedResults(collateralRequest).then(tradeExpectedResults => {
                observer.next({
                  isTradeAmountTouched: this.state.isTradeAmountTouched,
                  inputAmountText: limitedAmount.inputAmountText,
                  inputAmountValue: limitedAmount.inputAmountValue,
                  tradeAmountValue: limitedAmount.tradeAmountValue,
                  maxTradeValue: limitedAmount.maxTradeValue,
                  tradedAmountEstimate: tradeExpectedResults.tradedAmountEstimate,
                  slippageRate: tradeExpectedResults.slippageRate,
                  exposureValue: tradeExpectedResults.exposureValue,
                  selectedValue: selectedValue,
                });
              });
            } else {
              observer.next(null);
            }
          });
        });
    });
  };


  private rxFromCurrentAmount = (value: string): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>(observer => {

      this._isMounted && this.setState({ ...this.state, isExposureLoading: true });
      const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();
      const maxTradeValue = this.state.maxTradeValue;
      const selectedValue = new BigNumber(value).dividedBy(this.state.collateralizedPercent).toNumber();

      if (selectedValue < this.minValue) {
        value = new BigNumber(this.minValue).multipliedBy(this.state.collateralizedPercent).toFixed();
      }

      this.getInputAmountLimitedFromText(value, tradeTokenKey, maxTradeValue, false).then(limitedAmount => {
        // updating stored value only if the new input value is a valid number
        if (!limitedAmount.tradeAmountValue.isNaN()) {
          const collateralRequest = new ManageCollateralRequest(
            new BigNumber(this.state.selectedValue),
            this.props.tradeType,
            this.props.asset,
            this.state.selectedUnitOfAccount,
            this.state.collateral,
            this.props.positionType,
            this.props.leverage,
            limitedAmount.tradeAmountValue,
            this.state.tokenizeNeeded,
            this.props.version,
            this.state.inputAmountValue
          );
          const selectedValue = limitedAmount.inputAmountValue.dividedBy(this.state.collateralizedPercent).toNumber();

          this.getTradeExpectedResults(collateralRequest).then(tradeExpectedResults => {
            observer.next({
              isTradeAmountTouched: true,
              inputAmountText: limitedAmount.inputAmountText,
              inputAmountValue: limitedAmount.inputAmountValue,
              tradeAmountValue: limitedAmount.tradeAmountValue,
              maxTradeValue: maxTradeValue,
              tradedAmountEstimate: tradeExpectedResults.tradedAmountEstimate,
              slippageRate: tradeExpectedResults.slippageRate,
              exposureValue: tradeExpectedResults.exposureValue,
              selectedValue: selectedValue

            });
          });
        } else {
          observer.next(null);
        }
      });
    });
  };


  private getTradeExpectedResults = async (manageCollateralRequest: ManageCollateralRequest): Promise<ITradeExpectedResults> => {
    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(manageCollateralRequest);
    const slippageRate = await FulcrumProvider.Instance.getTradeSlippageRate(manageCollateralRequest, tradedAmountEstimate);
    const exposureValue = await FulcrumProvider.Instance.getTradeFormExposure(manageCollateralRequest);

    return {
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate || new BigNumber(0),
      exposureValue: exposureValue
    };
  };


  private getInputAmountLimitedFromText = async (textValue: string, tradeTokenKey: TradeTokenKey, maxTradeValue: BigNumber, skipLimitCheck: boolean): Promise<IInputAmountLimited> => {
    const inputAmountText = textValue;
    const amountTextForConversion = inputAmountText === "" ? "0" : inputAmountText[0] === "." ? `0${inputAmountText}` : inputAmountText;
    const inputAmountValue = new BigNumber(amountTextForConversion);

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, tradeTokenKey, maxTradeValue, skipLimitCheck);
  };


  private getInputAmountLimitedFromBigNumber = async (bnValue: BigNumber, tradeTokenKey: TradeTokenKey, maxTradeValue: BigNumber, multiplier: BigNumber, skipLimitCheck: boolean): Promise<IInputAmountLimited> => {
    const inputAmountValue = bnValue;
    const inputAmountText = bnValue.decimalPlaces(this._inputPrecision).toFixed();

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, tradeTokenKey, maxTradeValue, skipLimitCheck, multiplier);
  };


  private getInputAmountLimited = async (textValue: string, bnValue: BigNumber, tradeTokenKey: TradeTokenKey, maxTradeValue: BigNumber, skipLimitCheck: boolean, multiplier: BigNumber = new BigNumber(1)): Promise<IInputAmountLimited> => {
    let inputAmountText = textValue;
    let inputAmountValue = bnValue;

    // handling negative values (incl. Ctrl+C)
    if (inputAmountValue.isNegative()) {
      inputAmountValue = inputAmountValue.absoluteValue();
      inputAmountText = inputAmountValue.decimalPlaces(this._inputPrecision).toFixed();
    }

    let tradeAmountValue = new BigNumber(0);
    // we should normalize maxTradeValue for sell
    const pTokenBaseAsset = FulcrumProvider.Instance.getBaseAsset(tradeTokenKey);
    const destinationAsset = this.state.collateral;
    if (this.props.tradeType === TradeType.SELL) {
      const pTokenPrice = await FulcrumProvider.Instance.getPTokenPrice(tradeTokenKey);
      // console.log(`pTokenPrice: ${pTokenPrice.toFixed()}`);
      const swapRate = await FulcrumProvider.Instance.getSwapRate(pTokenBaseAsset, destinationAsset);
      // console.log(`swapRate: ${swapRate.toFixed()}`);

      const pTokenAmountMax = maxTradeValue.multipliedBy(multiplier);
      // console.log(`pTokenAmountMax: ${pTokenAmountMax.toFixed()}`);
      const pTokenBaseAssetAmountMax = pTokenAmountMax.multipliedBy(pTokenPrice);
      // console.log(`pTokenBaseAssetAmountMax: ${pTokenBaseAssetAmountMax.toFixed()}`);
      const destinationAssetAmountMax = pTokenBaseAssetAmountMax.multipliedBy(swapRate);
      // console.log(`destinationAssetAmountMax: ${destinationAssetAmountMax.toFixed()}`);

      const destinationAssetAmountLimited = skipLimitCheck ? destinationAssetAmountMax : BigNumber.min(destinationAssetAmountMax, inputAmountValue);
      // console.log(`destinationAmountLimited: ${destinationAssetAmountLimited.toFixed()}`);

      const pTokenBaseAssetAmountLimited = destinationAssetAmountLimited.dividedBy(swapRate);
      // console.log(`pTokenBaseAssetAmountLimited: ${pTokenBaseAssetAmountLimited.toFixed()}`);
      const pTokenAmountLimited = pTokenBaseAssetAmountLimited.dividedBy(pTokenPrice);
      // console.log(`pTokenAmountLimited: ${pTokenAmountLimited.toFixed()}`);

      inputAmountValue = destinationAssetAmountLimited;
      inputAmountText = destinationAssetAmountLimited.decimalPlaces(this._inputPrecision).toFixed();
      tradeAmountValue = pTokenAmountLimited;
    } else if (this.props.tradeType === TradeType.BUY) {
      tradeAmountValue = inputAmountValue;
      if (tradeAmountValue.gt(maxTradeValue)) {
        inputAmountValue = maxTradeValue.multipliedBy(multiplier);
        inputAmountText = maxTradeValue.multipliedBy(multiplier).decimalPlaces(this._inputPrecision).toFixed();
        tradeAmountValue = maxTradeValue.multipliedBy(multiplier);
      }
    }

    return {
      inputAmountValue: inputAmountValue.multipliedBy(multiplier),
      inputAmountText: isNaN(parseFloat(inputAmountText)) ? "" : new BigNumber(parseFloat(inputAmountText)).multipliedBy(multiplier).minus(this.state.collateralizedPercent.multipliedBy(this.state.positionValue)).toFixed(),
      tradeAmountValue: tradeAmountValue.multipliedBy(multiplier),
      maxTradeValue
    };
  };
}
