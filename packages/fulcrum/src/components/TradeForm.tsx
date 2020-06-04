import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import TagManager from "react-gtm-module";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"
import { ReactComponent as QuestionIcon } from "../assets/images/ic__question_mark.svg"
import { ReactComponent as SlippageDown } from "../assets/images/ic__slippage_down.svg"
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary, AssetsDictionaryMobile } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { CollapsibleContainer } from "./CollapsibleContainer";
import { PositionTypeMarkerAlt } from "./PositionTypeMarkerAlt";
import { TradeExpectedResult } from "./TradeExpectedResult";
import { UnitOfAccountSelector } from "./UnitOfAccountSelector";
import { Preloader } from "./Preloader";
import { InputAmount } from "./InputAmount";

import "../styles/components/trade-form.scss";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

interface IInputAmountLimited {
  inputAmountValue: BigNumber;
  inputAmountText: string;
  tradeAmountValue: BigNumber;
  maxTradeValue: BigNumber;
}

interface ITradeExpectedResults {
  slippageRate: BigNumber;
  exposureValue: BigNumber;
}

interface ITradeAmountChangeEvent {
  isTradeAmountTouched: boolean;

  inputAmountText: string;
  inputAmountValue: BigNumber;
  tradeAmountValue: BigNumber;
  maxTradeValue: BigNumber;

  slippageRate: BigNumber;
  exposureValue: BigNumber;
}

export interface ITradeFormProps {
  loan?: IBorrowedFundsState
  loanId?: string;
  tradeType: TradeType;
  asset: Asset;
  positionType: PositionType;
  leverage: number;
  defaultCollateral: Asset;
  defaultUnitOfAccount: Asset;
  defaultTokenizeNeeded: boolean;
  bestCollateral: Asset;
  version: number;

  onSubmit: (request: TradeRequest) => void;
  onCancel: () => void;
  onTrade: (request: TradeRequest) => void;
  isMobileMedia: boolean;
  isOpenModal: boolean;
}

interface ITradeFormState {
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

  slippageRate: BigNumber;

  currentPrice: BigNumber;
  liquidationPrice: BigNumber;
  exposureValue: BigNumber;

  isAmountExceeded: boolean;
  maxAmountMultiplier: BigNumber;

  isLoading: boolean;
  isExposureLoading: boolean;

  selectedUnitOfAccount: Asset;

  tradeAssetPrice: BigNumber;
}

export default class TradeForm extends Component<ITradeFormProps, ITradeFormState> {
  private readonly _inputPrecision = 6;

  private readonly _inputChange: Subject<string>;
  private readonly _inputSetMax: Subject<BigNumber>;

  private _isMounted: boolean;

  constructor(props: ITradeFormProps, context?: any) {
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
    const currentPrice = new BigNumber(0);
    const liquidationPrice = new BigNumber(0);
    const exposureValue = new BigNumber(0);
    const maxAmountMultiplier = new BigNumber(0);
    this._isMounted = false;
    this.state = {
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
      slippageRate: slippageRate,
      interestRate: interestRate,
      maybeNeedsApproval: false,
      currentPrice: currentPrice,
      liquidationPrice: liquidationPrice,
      exposureValue: exposureValue,
      isAmountExceeded: false,
      maxAmountMultiplier: maxAmountMultiplier,
      isLoading: true,
      isExposureLoading: true,
      selectedUnitOfAccount: this.props.defaultUnitOfAccount,
      tradeAssetPrice: new BigNumber(0)
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
          slippageRate: new BigNumber(0),
          exposureValue: new BigNumber(0),
          isLoading: false,
          isExposureLoading: false
        })
      }
    });

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }



  private async derivedUpdate() {

    let assetDetails = AssetsDictionary.assets.get(this.props.asset);
    if (this.props.isMobileMedia) {
      assetDetails = AssetsDictionaryMobile.assets.get(this.props.asset);
    }
    const tradeAssetPrice = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.asset);
    // const positionTokenBalance = await FulcrumProvider.Instance.getPTokenBalanceOfUser(tradeTokenKey);
    // const balance =
    //   this.props.tradeType === TradeType.BUY
    //     ? await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(this.state.collateral)
    //     : positionTokenBalance;
    // const ethBalance = await FulcrumProvider.Instance.getEthBalance();

    // maxTradeValue is raw here, so we should not use it directly
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, this.props.positionType === PositionType.LONG ? this.state.selectedUnitOfAccount : this.props.asset, this.state.collateral, this.props.positionType, this.props.loan);
    // const limitedAmount = await this.getInputAmountLimited(this.state.inputAmountText, this.state.inputAmountValue, tradeTokenKey, maxTradeValue, false);
    const tradeRequest = new TradeRequest(
      this.props.loan?.loanId || "0x0000000000000000000000000000000000000000000000000000000000000000",
      this.props.tradeType,
      this.props.asset,
      this.state.selectedUnitOfAccount,
      this.state.collateral,
      this.props.positionType,
      this.props.leverage,
      this.state.tradeAmountValue
    );

    // const tradeExpectedResults = await this.getTradeExpectedResults(tradeRequest);

    // const address = FulcrumProvider.Instance.contractsSource
    //   ? await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || ""
    //   : "";

    // const maybeNeedsApproval = this.props.tradeType === TradeType.BUY ?
    //   await FulcrumProvider.Instance.checkCollateralApprovalForTrade(tradeRequest) :
    //   false;

    // const latestPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);
    const liquidationPrice = new BigNumber(0); //new BigNumber(latestPriceDataPoint.liquidationPrice);
    let { principal, collateral, interestRate } = await FulcrumProvider.Instance.getEstimatedMarginDetails(tradeRequest);
    // const interestRate = new BigNumber(0);//await FulcrumProvider.Instance.getTradeTokenInterestRate(tradeTokenKey);
    if (this.props.tradeType === TradeType.SELL)
      interestRate = await FulcrumProvider.Instance.getBorrowInterestRate(this.props.asset);

    this._isMounted && this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      // inputAmountText: limitedAmount.inputAmountText,// "",
      // inputAmountValue: limitedAmount.inputAmountValue,// new BigNumber(0),
      // tradeAmountValue: limitedAmount.tradeAmountValue,// new BigNumber(0),
      // maxTradeValue: limitedAmount.maxTradeValue,
      // balance: balance,
      // ethBalance: ethBalance,
      // positionTokenBalance: positionTokenBalance,
      maxTradeValue,
      interestRate: interestRate,
      currentPrice: new BigNumber(0), //new BigNumber(latestPriceDataPoint.price),
      liquidationPrice: liquidationPrice,
      tradeAssetPrice,
      exposureValue: collateral,
      isExposureLoading: false,
      isLoading: false
    });
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    window.history.pushState(null, "Trade Modal Closed", `/trade`);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public async componentDidMount() {
    this._isMounted = true;

    await this.derivedUpdate();
    if (this.props.isOpenModal) {
      window.history.pushState(null, "Trade Modal Opened", `/trade/${this.props.tradeType.toLocaleLowerCase()}-${this.props.leverage}x-${this.props.positionType.toLocaleLowerCase()}-${this.props.asset}/`);
      this.onInsertMaxValue(.5);
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<ITradeFormProps>,
    prevState: Readonly<ITradeFormState>,
    snapshot?: any
  ): void {
    if (
      this.props.tradeType !== prevProps.tradeType ||
      this.props.asset !== prevProps.asset ||
      this.props.positionType !== prevProps.positionType ||
      this.props.leverage !== prevProps.leverage ||
      this.props.defaultUnitOfAccount !== prevProps.defaultUnitOfAccount ||
      this.props.defaultTokenizeNeeded !== prevProps.defaultTokenizeNeeded ||
      this.props.version !== prevProps.version ||
      this.state.collateral !== prevState.collateral ||
      this.state.tradeAmountValue !== prevState.tradeAmountValue
    ) {
      if (this.state.collateral !== prevState.collateral) {
        this._isMounted && this.setState({
          ...this.state,
          inputAmountText: "",
          inputAmountValue: new BigNumber(0),
          tradeAmountValue: new BigNumber(0)
        }, () => {
          this.derivedUpdate();
        });
      } else {
        this.derivedUpdate();
      }
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const submitClassName =
      this.props.tradeType === TradeType.BUY ? "trade-form__submit-button--buy" : "trade-form__submit-button--sell";

    const tokenNameBase = this.state.assetDetails.displayName;

    // const amountMsg =
    //   this.state.ethBalance && this.state.ethBalance.lte(FulcrumProvider.Instance.gasBufferForTrade)
    //     ? "Insufficient funds for gas"
    //     : this.state.balance && this.state.balance.eq(0)
    //       ? "Your wallet is empty"
    //       : (this.state.tradeAmountValue.gt(0) && this.state.slippageRate.eq(0))
    //         && (this.state.collateral === Asset.ETH || !this.state.maybeNeedsApproval)
    //         ? ``// `Your trade is too small.`
    //         : this.state.slippageRate.gte(0.01) && this.state.slippageRate.lt(99) // gte(0.2)
    //           ? `Slippage:`
    //           : "";

    const tradeExpectedResultValue = {
      tradeType: this.props.tradeType,
      currentPrice: this.state.currentPrice,
      liquidationPrice: this.state.liquidationPrice
    };

    let submitButtonText = ``;
    if (this.props.tradeType === TradeType.BUY) {
      if (this.props.positionType === PositionType.SHORT) {
        submitButtonText = `SHORT`;
      } else {
        submitButtonText = `LEVERAGE`;
      }
    } else {
      submitButtonText = `CLOSE`;
    }
    if (this.state.exposureValue.gt(0)) {
      submitButtonText += ` ${this.formatPrecision(this.state.exposureValue.toNumber())} ${this.props.asset}`;
    } else {
      submitButtonText += ` ${this.props.asset}`;
    }

    return (
      <form className="trade-form" onSubmit={this.onSubmitClick}>
        <CloseIcon className="close-icon" onClick={this.onCancelClick} />
        <div className="trade-form__left_block">
          <div className="trade-form__info_block">
            <div className="trade-form__info_block__logo">
              {this.state.assetDetails.reactLogoSvg.render()}
              <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
            </div>
            <div className="trade-form__asset-stats">
              <div className="trade-form__info_block__asset">
                {tokenNameBase}
              </div>
              <div className="trade-form__info_block__stats">
                <div className="trade-form__info_block__stats__data">
                  {this.state.interestRate ? `${this.state.interestRate.toFixed(1)}%` : `0.0%`} APR
                  </div>
                <div className="trade-form__info_block__stats__data">
                  {`${this.props.leverage.toString()}x`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`trade-form__form-container ${this.props.tradeType === TradeType.BUY ? "buy" : "sell"}`}>
          <div className="trade-form__form-values-container">
            {!this.props.isMobileMedia && this.props.tradeType === TradeType.BUY ? (
              <TradeExpectedResult entryPrice={this.state.tradeAssetPrice} liquidationPrice={this.state.liquidationPrice} />
            ) : null}

            {/*<div className="trade-form__kv-container">
              {amountMsg.includes("Slippage:") ? (
                <div title={`${this.state.slippageRate.toFixed(18)}%`} className="trade-form__label slippage">
                  {amountMsg}
                  <span className="trade-form__slippage-amount">
                    &nbsp;{`${this.state.slippageRate.toFixed(2)}%`}<SlippageDown />
                  </span>
                </div>
              ) : (<div className="trade-form__label">{amountMsg}</div>)}

            </div> */}

            <InputAmount
              inputAmountText={this.state.inputAmountText}
              isLoading={false}
              tradeType={this.props.tradeType}
              asset={this.state.collateral}
              onInsertMaxValue={this.onInsertMaxValue}
              onTradeAmountChange={this.onTradeAmountChange}
              onCollateralChange={this.onCollateralChange}
            />

            {/*this.state.positionTokenBalance && */this.props.tradeType === TradeType.BUY/* && this.state.positionTokenBalance!.eq(0)*/ ? (
              <CollapsibleContainer titleOpen="View advanced options" titleClose="Hide advanced options" isTransparent={false}>
                <div className="trade-form__unit-of-account-container">
                  Unit of Account
                    <UnitOfAccountSelector items={[
                    Asset.USDC,
                    Asset.SAI,
                    Asset.DAI
                  ]} value={this.state.selectedUnitOfAccount} onChange={this.onChangeUnitOfAccount} />
                </div>
              </CollapsibleContainer>
            ) : null}


            {this.props.isMobileMedia && this.props.tradeType === TradeType.BUY ? (
              <TradeExpectedResult entryPrice={this.state.tradeAssetPrice} liquidationPrice={this.state.liquidationPrice} />
            ) : null}

          </div>

          <div className="trade-form__actions-container">

            <button title={this.state.exposureValue.gt(0) ? `${this.state.exposureValue.toFixed(18)} ${this.props.asset}` : ``} type="submit" className={`trade-form__submit-button ${submitClassName}`}>
              {this.state.isExposureLoading || this.state.isLoading ? <Preloader width="75px" /> : submitButtonText}
            </button>
          </div>
          {this.props.tradeType === TradeType.BUY ?
            <div className="trade-how-it-works-container">
              <CollapsibleContainer titleOpen="What is this?" titleClose="What is this?" isTransparent={false}>
                <div className="trade-form__how-it-works">
                  <div className="hiw-icon"><QuestionIcon /></div>
                  <div className="hiw-content">
                    You are opening {this.props.leverage}x {this.props.positionType} {this.state.assetDetails.displayName} position. This will borrow {this.props.positionType === PositionType.LONG ? this.props.defaultUnitOfAccount : this.state.assetDetails.displayName} from a Fulcrum lending pool and that {this.props.positionType === PositionType.LONG ? this.props.defaultUnitOfAccount : this.state.assetDetails.displayName} is swapped into {this.props.positionType === PositionType.LONG ? this.state.assetDetails.displayName : this.props.defaultUnitOfAccount} using an on-chain DEX.
                </div>
                </div>
              </CollapsibleContainer>
            </div> : null}
        </div>
      </form >
    );
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";

    // setting inputAmountText to update display at the same time
    this._isMounted && this.setState({
      ...this.state,
      inputAmountText: amountText,
      tradeAmountValue: new BigNumber(amountText)
    }, () => {
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

  public onCancelClick = () => {
    this.props.onCancel();
  };

  public onCollateralChange = async (asset: Asset) => {
    await this._isMounted && this.setState({ ...this.state, collateral: asset });

    this._inputSetMax.next();
  };

  public onChangeUnitOfAccount = (asset: Asset) => {

    this._isMounted && this.setState({ ...this.state, selectedUnitOfAccount: asset });

    // this.props.onTrade(
    //   new TradeRequest(
    //     this.props.tradeType,
    //     this.props.asset,
    //     asset,
    //     this.state.collateral,
    //     this.props.positionType,
    //     this.props.leverage,
    //     this.state.tradeAmountValue,
    //     this.state.tokenizeNeeded,
    //     version,
    //     this.state.inputAmountValue
    //   )
    // );
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
      new TradeRequest(
        this.props.loan?.loanId || "0x0000000000000000000000000000000000000000000000000000000000000000",
        this.props.tradeType,
        this.props.asset,
        this.state.selectedUnitOfAccount,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmountValue
      )
    );
  };

  private rxFromMaxAmountWithMultiplier = (multiplier: BigNumber): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>(observer => {

      this._isMounted && this.setState({ ...this.state, isLoading: true, isExposureLoading: true });

      FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, this.props.positionType === PositionType.LONG ? this.state.selectedUnitOfAccount : this.props.asset, this.state.collateral, this.props.positionType, this.props.loan)
        .then(maxTradeValue => {
          // maxTradeValue is raw here, so we should not use it directly
          this.getInputAmountLimitedFromBigNumber(maxTradeValue, maxTradeValue, multiplier).then(async limitedAmount => {
            if (!limitedAmount.tradeAmountValue.isNaN()) {
              const tradeRequest = new TradeRequest(
                this.props.loan?.loanId || "0x0000000000000000000000000000000000000000000000000000000000000000",
                this.props.tradeType,
                this.props.asset,
                this.state.selectedUnitOfAccount,
                this.state.collateral,
                this.props.positionType,
                this.props.leverage,
                limitedAmount.tradeAmountValue
              );
              const { collateral, interestRate } = await FulcrumProvider.Instance.getEstimatedMarginDetails(tradeRequest);
              await this.setState({ ...this.state, interestRate })
              observer.next({
                isTradeAmountTouched: true,
                inputAmountText: limitedAmount.inputAmountText,
                inputAmountValue: limitedAmount.inputAmountValue,
                tradeAmountValue: limitedAmount.tradeAmountValue,
                maxTradeValue: maxTradeValue,
                exposureValue: collateral,
                slippageRate: new BigNumber(0)
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
      const maxTradeValue = this.state.maxTradeValue;
      this.getInputAmountLimitedFromText(value, maxTradeValue).then(async limitedAmount => {
        // updating stored value only if the new input value is a valid number
        if (!limitedAmount.tradeAmountValue.isNaN()) {
          const tradeRequest = new TradeRequest(
            this.props.loan?.loanId || "0x0000000000000000000000000000000000000000000000000000000000000000",
            this.props.tradeType,
            this.props.asset,
            this.state.selectedUnitOfAccount,
            this.state.collateral,
            this.props.positionType,
            this.props.leverage,
            limitedAmount.tradeAmountValue
          );
          const { collateral, interestRate } = await FulcrumProvider.Instance.getEstimatedMarginDetails(tradeRequest);
          await this.setState({ ...this.state, interestRate })

          observer.next({
            isTradeAmountTouched: true,
            inputAmountText: limitedAmount.inputAmountText,
            inputAmountValue: limitedAmount.inputAmountValue,
            tradeAmountValue: limitedAmount.tradeAmountValue,
            maxTradeValue: maxTradeValue,
            exposureValue: collateral,
            slippageRate: new BigNumber(0)
          });

        } else {
          observer.next(null);
        }
      });

    });
  };

  private getInputAmountLimitedFromText = async (textValue: string, maxTradeValue: BigNumber): Promise<IInputAmountLimited> => {
    const inputAmountText = textValue;
    const amountTextForConversion = inputAmountText === "" ? "0" : inputAmountText[0] === "." ? `0${inputAmountText}` : inputAmountText;
    const inputAmountValue = new BigNumber(amountTextForConversion);

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, maxTradeValue);
  };

  private getInputAmountLimitedFromBigNumber = async (bnValue: BigNumber, maxTradeValue: BigNumber, multiplier: BigNumber): Promise<IInputAmountLimited> => {
    const inputAmountValue = bnValue;
    const inputAmountText = bnValue.decimalPlaces(this._inputPrecision).toFixed();

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, maxTradeValue, multiplier);
  };

  private getInputAmountLimited = async (textValue: string, bnValue: BigNumber, maxTradeValue: BigNumber, multiplier: BigNumber = new BigNumber(1)): Promise<IInputAmountLimited> => {
    let inputAmountText = textValue;
    let inputAmountValue = bnValue;

    // handling negative values (incl. Ctrl+C)
    if (inputAmountValue.isNegative()) {
      inputAmountValue = inputAmountValue.absoluteValue();
      inputAmountText = inputAmountValue.decimalPlaces(this._inputPrecision).toFixed();
    }

    let tradeAmountValue = new BigNumber(0);

    if (this.props.tradeType === TradeType.SELL) {
      tradeAmountValue = inputAmountValue;
      const positionAmount = this.props.positionType === PositionType.LONG
        ? this.props.loan!.loanData!.collateral.div(10 ** 18)
        : this.props.loan!.loanData!.principal.div(10 ** 18);
      if (tradeAmountValue.gt(positionAmount)) {
        inputAmountValue = positionAmount.multipliedBy(multiplier);
        inputAmountText = positionAmount.multipliedBy(multiplier).decimalPlaces(this._inputPrecision).toFixed();
        tradeAmountValue = positionAmount.multipliedBy(multiplier);
      }
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
      inputAmountText: isNaN(parseFloat(inputAmountText)) ? "" : new BigNumber(parseFloat(inputAmountText)).multipliedBy(multiplier).toFixed(),
      tradeAmountValue: tradeAmountValue.multipliedBy(multiplier),
      maxTradeValue
    };
  };

  private formatPrecision(output: number): string {
    let n = Math.log(output) / Math.LN10;
    let x = 3 - n;
    if (x < 0) x = 0;
    if (x > 5) x = 5;
    let result = new Number(output.toFixed(x)).toString();
    return result;
  }
}
