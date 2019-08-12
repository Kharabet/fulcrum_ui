import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import Modal from "react-modal";
// import { Tooltip } from "react-tippy";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import ic_arrow_max from "../assets/images/ic_arrow_max.svg";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
// import { CheckBox } from "./CheckBox";
import { CollapsibleContainer } from "./CollapsibleContainer";
import { CollateralTokenButton } from "./CollateralTokenButton";
import { CollateralTokenSelector } from "./CollateralTokenSelector";
import { PositionTypeMarkerAlt } from "./PositionTypeMarkerAlt";
import { TradeExpectedResult } from "./TradeExpectedResult";
import { UnitOfAccountSelector } from "./UnitOfAccountSelector";

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
}

export interface ITradeFormProps {
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

  tradedAmountEstimate: BigNumber;
  slippageRate: BigNumber;
  pTokenAddress: string;

  currentPrice: BigNumber;
  liquidationPrice: BigNumber;
  exposureValue: BigNumber;
}

export class TradeForm extends Component<ITradeFormProps, ITradeFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputChange: Subject<string>;
  private readonly _inputSetMax: Subject<void>;

  constructor(props: ITradeFormProps, context?: any) {
    super(props, context);
    const assetDetails = AssetsDictionary.assets.get(props.asset);
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
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate,
      interestRate: interestRate,
      pTokenAddress: "",
      maybeNeedsApproval: false,
      currentPrice: currentPrice,
      liquidationPrice: liquidationPrice,
      exposureValue: exposureValue
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
        switchMap(() => this.rxFromMaxAmount())
      )
    ).pipe(
      switchMap((value) => new Observable<ITradeAmountChangeEvent | null>((observer) => observer.next(value)))
    ).subscribe(next => {
      if (next) {
        this.setState({ ...this.state, ...next });
      } else {
        this.setState({
          ...this.state,
          isTradeAmountTouched: false,
          inputAmountText: "",
          inputAmountValue: new BigNumber(0),
          tradeAmountValue: new BigNumber(0),
          tradedAmountEstimate: new BigNumber(0),
          slippageRate: new BigNumber(0),
          exposureValue: new BigNumber(0)
        })
      }
    });

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private getTradeTokenGridRowSelectionKey(leverage: number = this.props.leverage) {
    return new TradeTokenKey(
      this.props.asset,
      this.props.defaultUnitOfAccount,
      this.props.positionType,
      leverage,
      this.state.tokenizeNeeded,
      this.props.version
    );
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.props.leverage);
    const interestRate = await FulcrumProvider.Instance.getTradeTokenInterestRate(tradeTokenKey);
    const positionTokenBalance = await FulcrumProvider.Instance.getPTokenBalanceOfUser(tradeTokenKey);
    const balance =
      this.props.tradeType === TradeType.BUY
        ? await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(this.state.collateral)
        : positionTokenBalance;
    const ethBalance = await FulcrumProvider.Instance.getEthBalance();

    // maxTradeValue is raw here, so we should not use it directly
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey, this.state.collateral);
    const limitedAmount = await this.getInputAmountLimited(this.state.inputAmountText, this.state.inputAmountValue, tradeTokenKey, maxTradeValue, false);
    const tradeRequest = new TradeRequest(
      this.props.tradeType,
      this.props.asset,
      this.props.defaultUnitOfAccount,
      this.state.collateral,
      this.props.positionType,
      this.props.leverage,
      limitedAmount.tradeAmountValue,// new BigNumber(0),
      this.state.tokenizeNeeded,
      this.props.version
    );

    const tradeExpectedResults = await this.getTradeExpectedResults(tradeRequest);

    const address = FulcrumProvider.Instance.contractsSource
      ? await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || ""
      : "";

    const maybeNeedsApproval = await FulcrumProvider.Instance.checkCollateralApprovalForTrade(tradeRequest);

    const latestPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);
    const liquidationPrice = new BigNumber(latestPriceDataPoint.liquidationPrice);

    this.setState({
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
      // collateral: this.props.defaultCollateral,
      maybeNeedsApproval: maybeNeedsApproval,
      currentPrice: new BigNumber(latestPriceDataPoint.price),
      liquidationPrice: liquidationPrice,
      exposureValue: tradeExpectedResults.exposureValue
    });
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this.derivedUpdate();

    if (this._input) {
      this._input.select();
      this._input.focus();
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
      this.state.collateral !== prevState.collateral
    ) {
      if (this.state.collateral !== prevState.collateral) {
        this.setState({
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

    const divStyle = {
      backgroundImage: `url(${this.state.assetDetails.bgSvg})`
    };

    const submitClassName =
      this.props.tradeType === TradeType.BUY ? "trade-form__submit-button--buy" : "trade-form__submit-button--sell";

    // const positionTypePrefix = this.props.defaultUnitOfAccount === Asset.DAI ? "d" : "u";
    // const positionTypePrefix2 = this.props.positionType === PositionType.SHORT ? "s" : "L";
    // const positionLeveragePostfix = this.props.leverage > 1 ? `${this.props.leverage}x` : "";
    const tokenNameBase = this.state.assetDetails.displayName;
    // const tokenNamePosition = `${positionTypePrefix}${positionTypePrefix2}${this.state.assetDetails.displayName}${positionLeveragePostfix}`;

    // const tokenNameSource = this.props.tradeType === TradeType.BUY ? this.state.collateral : tokenNamePosition;
    // const tokenNameDestination = this.props.tradeType === TradeType.BUY ? tokenNamePosition : this.state.collateral;

    const isAmountMaxed = this.state.tradeAmountValue.eq(this.state.maxTradeValue);
    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(FulcrumProvider.Instance.gasBufferForTrade)
        ? "Insufficient funds for gas \u2639"
        : this.state.balance && this.state.balance.eq(0)
          ? "Your wallet is empty \u2639"
          : (this.state.tradeAmountValue.gt(0) && this.state.slippageRate.eq(0))
            && (this.state.collateral === Asset.ETH || !this.state.maybeNeedsApproval)
            ? ``// `Your trade is too small.`
            : this.state.slippageRate.gt(0) // gte(0.2)
              ? `Slippage:`
              : "";

    /*const tradedAmountEstimateText =
      this.state.tradedAmountEstimate.eq(0)
        ? "0"
        : this.state.tradedAmountEstimate.gte(new BigNumber("0.000001"))
          ? this.state.tradedAmountEstimate.toFixed(6)
          : this.state.tradedAmountEstimate.toExponential(3);*/

    // const needsCollateralMsg = this.props.bestCollateral !== this.state.collateral;
    // const needsApprovalMsg = (!this.state.balance || this.state.balance.gt(0)) && this.state.maybeNeedsApproval && this.state.collateral !== Asset.ETH;
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
      submitButtonText += ` ${this.state.exposureValue.toFixed(2)} ${this.props.asset}`;
    } else {
      submitButtonText += ` ${this.props.asset}`;
    }

    return (
      <form className="trade-form" onSubmit={this.onSubmitClick} style={this.props.tradeType === TradeType.SELL ? { minHeight: `16.5625rem` } : undefined}>
        <div className="trade-form__left_block" style={divStyle}>
          {this.state.pTokenAddress &&
            FulcrumProvider.Instance.web3ProviderSettings &&
            FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
              <a
                className="trade-form__info_block"
                style={{cursor: `pointer`, textDecoration: `none`}}
                title={this.state.pTokenAddress}
                href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.pTokenAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="trade-form__info_block__logo">
                  <img className="asset-logo" src={this.state.assetDetails.logoSvg} alt={tokenNameBase} />
                  <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
                </div>
                <div className="trade-form__info_block__asset" style={{color: this.state.assetDetails.textColor}}>
                  {tokenNameBase}
                </div>
                <div className="trade-form__info_block__stats"  style={{color: this.state.assetDetails.textColor2}}>
                  <div className="trade-form__info_block__stats__data">
                    {this.state.interestRate ? `${this.state.interestRate.toFixed(1)}%` : `0.0%`} APR
                  </div>
                  <div className="trade-form__info_block__stats__splitter" style={{borderLeftColor: this.state.assetDetails.textColor2}}>|</div>
                  <div className="trade-form__info_block__stats__data">
                    {`${this.props.leverage.toString()}x`}
                  </div>
                </div>
              </a>
            ) : (
              <div className="trade-form__info_block">
                <div className="trade-form__info_block__logo">
                  <img className="asset-logo" src={this.state.assetDetails.logoSvg} alt={tokenNameBase} />
                  <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
                </div>
                <div className="trade-form__info_block__asset" style={{color: this.state.assetDetails.textColor}}>
                  {tokenNameBase}
                </div>
                <div className="trade-form__info_block__stats"  style={{color: this.state.assetDetails.textColor2}}>
                  <div className="trade-form__info_block__stats__data">
                    {this.state.interestRate ? `${this.state.interestRate.toFixed(1)}%` : `0.0%`} APR
                  </div>
                  <div className="trade-form__info_block__stats__splitter" style={{borderLeftColor: this.state.assetDetails.textColor2}}>|</div>
                  <div className="trade-form__info_block__stats__data">
                    {`${this.props.leverage.toString()}x`}
                  </div>
                </div>
              </div>
            )}
        </div>
        <div className="trade-form__form-container" style={this.props.tradeType === TradeType.SELL ? { minHeight: `16.5625rem` } : undefined}>
          <div className="trade-form__form-values-container">
            <div className="trade-form__amount-container">
              <input
                type="text"
                ref={this._setInputRef}
                className="trade-form__amount-input"
                value={this.state.inputAmountText}
                onChange={this.onTradeAmountChange}
                placeholder={`${this.props.tradeType === TradeType.BUY ? `Buy` : `Sell`} Amount`}
              />
              <div className="trade-form__collateral-button-container">
                <CollateralTokenButton asset={this.state.collateral} onClick={this.onChangeCollateralOpen} />
              </div>
              {isAmountMaxed ? (
                <div className="trade-form__amount-maxed">MAX</div>
              ) : (
                <div className="trade-form__amount-max" onClick={this.onInsertMaxValue}><img src={ic_arrow_max} />MAX</div>
              )}
            </div>
            <div className="trade-form__kv-container" style={{ padding: `initial` }}>
              {amountMsg.includes("Slippage:") ? (
                <div title={`${this.state.slippageRate.toFixed(18)}%`} className="trade-form__label" style={{ display: `flex` }}>
                  {amountMsg}
                  <span className="trade-form__slippage-amount" style={this.state.slippageRate.lt(0.1) ? { color: `#00e409`} : undefined}>
                    {`${this.state.slippageRate.toFixed(2)}%`}
                    {this.state.slippageRate.gte(0.1) ? (
                      <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjQgKDY3Mzc4KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5TaGFwZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJLeWJlclN3YXAuY29tLSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9ImxhbmRpbmctcGFnZS0tMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMDQuMDAwMDAwLCAtODI5LjAwMDAwMCkiIGZpbGw9IiNGOTYzNjMiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1Mi4wMDAwMDAsIDgwOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJpY19hcnJvd19kb3dud2FyZC1jb3B5LTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc1Mi4wMDAwMDAsIDIxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJJY29uLTI0cHgiPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iU2hhcGUiIHBvaW50cz0iMTQuNTkgNi41OSA5IDEyLjE3IDkgMCA3IDAgNyAxMi4xNyAxLjQyIDYuNTggMCA4IDggMTYgMTYgOCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" />
                    ) : null}
                  </span>
                </div>
              ) : (
                <div className="trade-form__label">{amountMsg}</div>  
              )}

            </div>

            {this.state.positionTokenBalance && this.props.tradeType === TradeType.BUY && this.state.positionTokenBalance.eq(0) ? (
              <CollapsibleContainer titleOpen="View advanced options" titleClose="Hide advanced options" isTransparent={amountMsg !== ""}>
                <div className="trade-form__kv-container">
                  <div className="trade-form__label trade-form__label--no-bg">
                    Unit of Account &nbsp;
                    <UnitOfAccountSelector items={[Asset.USDC, Asset.DAI]} value={this.props.defaultUnitOfAccount} onChange={this.onChangeUnitOfAccount} />
                  </div>
                </div>
              </CollapsibleContainer>
            ) : null}
            {this.state.positionTokenBalance && this.props.tradeType === TradeType.BUY ? (
              <TradeExpectedResult value={tradeExpectedResultValue} />
            ) : null}
          </div>

          <div className="trade-form__actions-container">
            <button className="trade-form__cancel-button" onClick={this.onCancelClick}>
              <span className="trade-form__label--action">Cancel</span>
            </button>
            <button title={this.state.exposureValue.gt(0) ? `${this.state.exposureValue.toFixed(18)} ${this.props.asset}` : ``} type="submit" className={`trade-form__submit-button ${submitClassName}`}>
              {submitButtonText}
            </button>
          </div>
        </div>
        <Modal
          isOpen={this.state.isChangeCollateralOpen}
          onRequestClose={this.onChangeCollateralClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div"
        >
          <CollateralTokenSelector
            selectedCollateral={this.state.collateral}
            collateralType={this.props.tradeType === TradeType.BUY ? `Purchase` : `Withdrawal`}
            onCollateralChange={this.onChangeCollateralClicked}
            onClose={this.onChangeCollateralClose}
          />
        </Modal>
      </form>
    );
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    const amountText = event.target.value ? event.target.value : "";

    // setting inputAmountText to update display at the same time
    this.setState({...this.state, inputAmountText: amountText}, () => {
      // emitting next event for processing with rx.js
      this._inputChange.next(this.state.inputAmountText);
    });
  };

  public onInsertMaxValue = async () => {
    if (!this.state.assetDetails) {
      return null;
    }

    // emitting next event for processing with rx.js
    this._inputSetMax.next();
  };

  public onCancelClick = () => {
    this.props.onCancel();
  };

  public onChangeCollateralOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    this.setState({ ...this.state, isChangeCollateralOpen: true });
  };

  private onChangeCollateralClose = () => {
    this.setState({ ...this.state, isChangeCollateralOpen: false });
  };

  public onChangeCollateralClicked = async (asset: Asset) => {
    this.setState({ ...this.state, isChangeCollateralOpen: false, collateral: asset });
  };

  public onChangeUnitOfAccount = (asset: Asset) => {
    let version = 2;
    const key = new TradeTokenKey(this.props.asset, asset, this.props.positionType, this.props.leverage, this.state.tokenizeNeeded, version);
    if (key.erc20Address === "") {
      version = 1;
    }
    
    this.props.onTrade(
      new TradeRequest(
        this.props.tradeType,
        this.props.asset,
        asset,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmountValue,
        this.state.tokenizeNeeded,
        version
      )
    );
  };

  public onChangeTokenizeNeeded = async (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, tokenizeNeeded: event.target.checked });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.tradeAmountValue.isZero()) {
      if (this._input) {
        this._input.focus();
      }
      return;
    }

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.tradeAmountValue.isPositive()) {
      this.props.onCancel();
      return;
    }

    this.props.onSubmit(
      new TradeRequest(
        this.props.tradeType,
        this.props.asset,
        this.props.defaultUnitOfAccount,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmountValue,
        this.state.tokenizeNeeded,
        this.props.version
      )
    );
  };

  private rxFromMaxAmount = (): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>(observer => {

      const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();
      FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey, this.state.collateral)
        .then(maxTradeValue => {
          // maxTradeValue is raw here, so we should not use it directly
          this.getInputAmountLimitedFromBigNumber(maxTradeValue, tradeTokenKey, maxTradeValue, true).then(limitedAmount => {
            if (!limitedAmount.tradeAmountValue.isNaN()) {
              const tradeRequest = new TradeRequest(
                this.props.tradeType,
                this.props.asset,
                this.props.defaultUnitOfAccount,
                this.state.collateral,
                this.props.positionType,
                this.props.leverage,
                limitedAmount.tradeAmountValue,
                this.state.tokenizeNeeded,
                this.props.version
              );

              this.getTradeExpectedResults(tradeRequest).then(tradeExpectedResults => {
                observer.next({
                  isTradeAmountTouched: this.state.isTradeAmountTouched,
                  inputAmountText: limitedAmount.inputAmountText,
                  inputAmountValue: limitedAmount.inputAmountValue,
                  tradeAmountValue: limitedAmount.tradeAmountValue,
                  maxTradeValue: limitedAmount.maxTradeValue,
                  tradedAmountEstimate: tradeExpectedResults.tradedAmountEstimate,
                  slippageRate: tradeExpectedResults.slippageRate,
                  exposureValue: tradeExpectedResults.exposureValue
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

      const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();
      const maxTradeValue = this.state.maxTradeValue;
      this.getInputAmountLimitedFromText(value, tradeTokenKey, maxTradeValue, false).then(limitedAmount => {
        // updating stored value only if the new input value is a valid number
        if (!limitedAmount.tradeAmountValue.isNaN()) {
          const tradeRequest = new TradeRequest(
            this.props.tradeType,
            this.props.asset,
            this.props.defaultUnitOfAccount,
            this.state.collateral,
            this.props.positionType,
            this.props.leverage,
            limitedAmount.tradeAmountValue,
            this.state.tokenizeNeeded,
            this.props.version
          );

          this.getTradeExpectedResults(tradeRequest).then(tradeExpectedResults => {
            observer.next({
              isTradeAmountTouched: true,
              inputAmountText: limitedAmount.inputAmountText,
              inputAmountValue: limitedAmount.inputAmountValue,
              tradeAmountValue: limitedAmount.tradeAmountValue,
              maxTradeValue: maxTradeValue,
              tradedAmountEstimate: tradeExpectedResults.tradedAmountEstimate,
              slippageRate: tradeExpectedResults.slippageRate,
              exposureValue: tradeExpectedResults.exposureValue
            });
          });
        } else {
          observer.next(null);
        }
      });

    });
  };

  private getTradeExpectedResults = async (tradeRequest: TradeRequest): Promise<ITradeExpectedResults> => {
    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest);
    const slippageRate = await FulcrumProvider.Instance.getTradeSlippageRate(tradeRequest, tradedAmountEstimate);
    const exposureValue = await FulcrumProvider.Instance.getTradeFormExposure(tradeRequest);

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

  private getInputAmountLimitedFromBigNumber = async (bnValue: BigNumber, tradeTokenKey: TradeTokenKey, maxTradeValue: BigNumber, skipLimitCheck: boolean): Promise<IInputAmountLimited> => {
    const inputAmountValue = bnValue;
    const inputAmountText = bnValue.decimalPlaces(this._inputPrecision).toFixed();

    return this.getInputAmountLimited(inputAmountText, inputAmountValue, tradeTokenKey, maxTradeValue, skipLimitCheck);
  };

  private getInputAmountLimited = async (textValue: string, bnValue: BigNumber, tradeTokenKey: TradeTokenKey, maxTradeValue: BigNumber, skipLimitCheck: boolean): Promise<IInputAmountLimited> => {
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

      const pTokenAmountMax = maxTradeValue;
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
    } else if(this.props.tradeType === TradeType.BUY) {
      tradeAmountValue = inputAmountValue;
      if (tradeAmountValue.gt(maxTradeValue)) {
        inputAmountValue = maxTradeValue;
        inputAmountText = maxTradeValue.decimalPlaces(this._inputPrecision).toFixed();
        tradeAmountValue = maxTradeValue;
      }
    }

    return {
      inputAmountValue: inputAmountValue,
      inputAmountText: inputAmountText,
      tradeAmountValue: tradeAmountValue,
      maxTradeValue
    };
  };
}
