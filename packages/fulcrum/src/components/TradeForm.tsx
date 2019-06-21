import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
import Modal from "react-modal";
import { Tooltip } from "react-tippy";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { CheckBox } from "./CheckBox";
import { CollapsibleContainer } from "./CollapsibleContainer";
import { CollateralTokenSelector } from "./CollateralTokenSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";
import { UnitOfAccountSelector } from "./UnitOfAccountSelector";

interface ITradeAmountChangeEvent {
  isTradeAmountTouched: boolean;
  tradeAmountText: string;
  tradeAmount: BigNumber;
  tradedAmountEstimate: BigNumber;
  maxTradeAmount: BigNumber;
  slippageRate: BigNumber;
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
  tradeAmountText: string;
  tradeAmount: BigNumber;
  balance: BigNumber | null;
  ethBalance: BigNumber | null;
  positionTokenBalance: BigNumber | null;
  maxTradeAmount: BigNumber;
  maybeNeedsApproval: boolean;

  isChangeCollateralOpen: boolean;

  tradedAmountEstimate: BigNumber;
  slippageRate: BigNumber;
  pTokenAddress: string;
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

    this.state = {
      assetDetails: assetDetails || null,
      collateral: props.bestCollateral,
      tokenizeNeeded: props.defaultTokenizeNeeded,
      isTradeAmountTouched: false,
      tradeAmountText: "",
      tradeAmount: maxTradeValue,
      balance: balance,
      ethBalance: ethBalance,
      positionTokenBalance: positionTokenBalance,
      maxTradeAmount: maxTradeValue,
      isChangeCollateralOpen: false,
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate,
      interestRate: interestRate,
      pTokenAddress: "",
      maybeNeedsApproval: false
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
          tradeAmountText: "",
          tradeAmount: new BigNumber(0),
          tradedAmountEstimate: new BigNumber(0),
          slippageRate: new BigNumber(0)
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
      this.state.tokenizeNeeded
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

    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey, this.state.collateral);
    const tradeRequest = new TradeRequest(
      this.props.tradeType,
      this.props.asset,
      this.props.defaultUnitOfAccount,
      this.state.collateral,
      this.props.positionType,
      this.props.leverage,
      new BigNumber(0),
      this.state.tokenizeNeeded
    );

    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest);
    const slippageRate = await FulcrumProvider.Instance.getTradeSlippageRate(tradeRequest, tradedAmountEstimate);

    const address = FulcrumProvider.Instance.contractsSource ? 
      await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || "" :
      "";

    const maybeNeedsApproval = await FulcrumProvider.Instance.checkCollateralApprovalForTrade(tradeRequest);

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      tradeAmountText: "",
      tradeAmount: new BigNumber(0),
      balance: balance,
      ethBalance: ethBalance,
      positionTokenBalance: positionTokenBalance,
      maxTradeAmount: maxTradeValue,
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate ? slippageRate : new BigNumber(0),
      interestRate: interestRate,
      pTokenAddress: address,
      // collateral: this.props.defaultCollateral,
      maybeNeedsApproval: maybeNeedsApproval
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
      this.state.collateral !== prevState.collateral
    ) {
      this.derivedUpdate();
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

    const positionTypePrefix = this.props.defaultUnitOfAccount === Asset.DAI ? "d" : "u";
    const positionTypePrefix2 = this.props.positionType === PositionType.SHORT ? "s" : "L";
    const positionLeveragePostfix = this.props.leverage > 1 ? `${this.props.leverage}x` : "";
    const tokenNameBase = this.state.assetDetails.displayName;
    const tokenNamePosition = `${positionTypePrefix}${positionTypePrefix2}${this.state.assetDetails.displayName}${positionLeveragePostfix}`;

    const tokenNameSource = this.props.tradeType === TradeType.BUY ? this.state.collateral : tokenNamePosition;
    const tokenNameDestination = this.props.tradeType === TradeType.BUY ? tokenNamePosition : this.state.collateral;

    const isAmountMaxed = this.state.tradeAmount.eq(this.state.maxTradeAmount);
    const amountMsg =
      this.state.ethBalance && this.state.ethBalance.lte(FulcrumProvider.Instance.gasBufferForTrade)
        ? "Please add Ether to wallet."
        : this.state.balance && this.state.balance.eq(0)
          ? "Your wallet is empty \u2639"
          : (this.state.tradeAmount.gt(0) && this.state.slippageRate.eq(0))
            && !((!this.state.balance || this.state.balance.gt(0)) && this.state.maybeNeedsApproval && this.state.collateral !== Asset.ETH)
            ? `Your trade is too small.`
            : this.state.slippageRate.gt(0) // gte(0.2)
              ? `Slippage:`
              : "";

    const tradedAmountEstimateText =
      this.state.tradedAmountEstimate.eq(0)
        ? "0"
        : this.state.tradedAmountEstimate.gte(new BigNumber("0.000001"))
          ? this.state.tradedAmountEstimate.toFixed(6)
          : this.state.tradedAmountEstimate.toExponential(3);

    return (
      <form className="trade-form" onSubmit={this.onSubmitClick}>
        <div className="trade-form__image" style={divStyle}>
          <img src={this.state.assetDetails.logoSvg} alt={tokenNameBase} />
        </div>
        <div className="trade-form__form-container">
          <div className="trade-form__form-values-container">
            <div className="trade-form__position-type-container">
              <PositionTypeMarker value={this.props.positionType} />
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Position Asset</div>
              <div className="trade-form__value">{tokenNameBase}</div>
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">
                {this.props.tradeType === TradeType.BUY ? `Purchase Asset` : `Withdrawal Asset`}
                {/*this.props.tradeType === TradeType.SELL ? (
                  <React.Fragment>
                    {` `}
                    {<button className="trade-form__change-button" onClick={this.onChangeCollateralOpen}>
                      <span className="trade-form__label--action">Change</span>
                    </button>}
                  </React.Fragment>
                ) : ``*/}
                {` `}
                {<button className="trade-form__change-button" onClick={this.onChangeCollateralOpen}>
                  <span className="trade-form__label--action">Change</span>
                </button>}
              </div>
              <div className="trade-form__value">{this.state.collateral}</div>
            </div>
            {this.props.tradeType === TradeType.BUY ? (
              <div className="trade-form__token-message-container">
                {/* Selected purchase asset ({this.state.collateral}) may need approval, which can take up to 5 minutes. */}
                <div className="trade-form__token-message-container--message">
                  The purchase asset ({this.state.collateral}) is what you are sending to buy into this this position.{this.props.bestCollateral !== this.state.collateral ? ` To minimize slippage and trading fees on Kyber, please select ${this.props.bestCollateral} instead.` : ``}
                  {(!this.state.balance || this.state.balance.gt(0)) && this.state.maybeNeedsApproval && this.state.collateral !== Asset.ETH ? (
                    <React.Fragment>
                      <br/><br/>
                      You may be prompted to approve the asset after clicking BUY.
                    </React.Fragment>
                   ) : ``}
                </div>
              </div>
            ) : (
              <div className="trade-form__token-message-container">
                <div className="trade-form__token-message-container--message">
                  The withdrawal asset ({this.state.collateral}) is what you will receive after selling this position.{this.props.bestCollateral !== this.state.collateral ? ` To minimize slippage and trading fees on Kyber, please select ${this.props.bestCollateral} instead.` : ``}
                </div>
              </div>
            ) }
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Leverage</div>
              <div className="trade-form__value">{`${this.props.leverage.toString()}x`}</div>
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Interest APR</div>
              <div title={this.state.interestRate ? `${this.state.interestRate.toFixed(18)}%` : ``} className="trade-form__value">{this.state.interestRate ? `${this.state.interestRate.toFixed(4)}%` : `0.0000%`}</div>
            </div>
            <div className="trade-form__kv-container">
              <div className="trade-form__label">Amount</div>
              {this.props.tradeType !== TradeType.BUY &&
                this.state.pTokenAddress &&
                FulcrumProvider.Instance.web3ProviderSettings &&
                FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <div className="trade-form__value">
                  <a
                    className="trade-form__value"
                    style={{cursor: `pointer`, textDecoration: `none`}}
                    title={this.state.pTokenAddress}
                    href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.pTokenAddress}#readContract`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tokenNameSource}
                  </a>
                </div>
              ) : (
                <div className="trade-form__value">{tokenNameSource}</div>
              )}
            </div>
            <div className="trade-form__amount-container">
              <input
                type="text"
                ref={this._setInputRef}
                className="trade-form__amount-input"
                value={this.state.tradeAmountText}
                onChange={this.onTradeAmountChange}
                placeholder={`${this.props.tradeType === TradeType.BUY ? `Buy` : `Sell`} Amount`}
              />
              {isAmountMaxed ? (
                <div className="trade-form__amount-maxed">MAX</div>
              ) : (
                <div className="trade-form__amount-max" onClick={this.onInsertMaxValue}>&#65087;<br/>MAX</div>
              )}
            </div>
            <div className="trade-form__kv-container">
              {amountMsg.includes("Slippage:") ? (
                <div title={`${this.state.slippageRate.toFixed(18)}%`} className="trade-form__label" style={{ display: `flex` }}>
                  {amountMsg}
                  <span className="trade-form__slippage-amount">
                    {`${this.state.slippageRate.toFixed(2)}%`}
                    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjQgKDY3Mzc4KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5TaGFwZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJLeWJlclN3YXAuY29tLSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9ImxhbmRpbmctcGFnZS0tMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMDQuMDAwMDAwLCAtODI5LjAwMDAwMCkiIGZpbGw9IiNGOTYzNjMiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1Mi4wMDAwMDAsIDgwOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJpY19hcnJvd19kb3dud2FyZC1jb3B5LTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc1Mi4wMDAwMDAsIDIxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJJY29uLTI0cHgiPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iU2hhcGUiIHBvaW50cz0iMTQuNTkgNi41OSA5IDEyLjE3IDkgMCA3IDAgNyAxMi4xNyAxLjQyIDYuNTggMCA4IDggMTYgMTYgOCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" />
                  </span>
                </div>
              ) : (
                <div className="trade-form__label">{amountMsg}</div>  
              )}
              <div className="trade-form__value trade-form__value--no-color">
                <Tooltip
                  html={
                    <div style={{ /*maxWidth: `300px`*/ }}>
                      {/*... Info ...*/}
                    </div>
                  }
                >
                  {/*<span className="rounded-mark">?</span>*/}
                </Tooltip>
                {this.props.tradeType === TradeType.BUY &&
                this.state.pTokenAddress &&
                FulcrumProvider.Instance.web3ProviderSettings &&
                FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <a
                  className="trade-form__value--no-color"
                  style={{cursor: `pointer`, textDecoration: `none`}}
                  title={this.state.pTokenAddress}
                  href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.pTokenAddress}#readContract`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &nbsp; {tradedAmountEstimateText} {tokenNameDestination}
                </a>
              ) : (
                <React.Fragment>&nbsp; {tradedAmountEstimateText} {tokenNameDestination}</React.Fragment>
              )}
              </div>
            </div>

            {this.state.positionTokenBalance && this.props.tradeType === TradeType.BUY && this.state.positionTokenBalance.eq(0) ? (
              <div className="collapsible-container--margin-top">
                <CollapsibleContainer title="Advanced">
                  <div className="trade-form__kv-container">
                    <div className="trade-form__label trade-form__label--no-bg">
                      Unit of Account &nbsp;
                      <UnitOfAccountSelector items={[Asset.USDC, Asset.DAI]} value={this.props.defaultUnitOfAccount} onChange={this.onChangeUnitOfAccount} />
                    </div>
                  </div>
                  {/*<div className="trade-form__kv-container">
                    <div className="trade-form__label trade-form__label--no-bg">
                      <CheckBox checked={this.state.tokenizeNeeded} onChange={this.onChangeTokenizeNeeded}>Tokenize it &nbsp;</CheckBox>
                    </div>
                  </div>*/}
                </CollapsibleContainer>
              </div>
            ) : ``}
          </div>

          <div className="trade-form__actions-container">
            <button className="trade-form__cancel-button" onClick={this.onCancelClick}>
              <span className="trade-form__label--action">Cancel</span>
            </button>
            <button type="submit" className={`trade-form__submit-button ${submitClassName}`}>
              {this.props.tradeType}
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

    // setting tradeAmountText to update display at the same time
    this.setState({...this.state, tradeAmountText: amountText}, () => {
      // emitting next event for processing with rx.js
      this._inputChange.next(this.state.tradeAmountText);
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
    this.props.onTrade(
      new TradeRequest(
        this.props.tradeType,
        this.props.asset,
        asset,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmount,
        this.state.tokenizeNeeded
      )
    );
  };

  public onChangeTokenizeNeeded = async (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, tokenizeNeeded: event.target.checked });
  };

  public onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.tradeAmount.isZero()) {
      if (this._input) {
        this._input.focus();
      }
      return;
    }

    if (!this.state.assetDetails) {
      this.props.onCancel();
      return;
    }

    if (!this.state.tradeAmount.isPositive()) {
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
        this.state.tradeAmount,
        this.state.tokenizeNeeded
      )
    );
  };

  private rxFromMaxAmount = (): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>(observer => {
      const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();
      FulcrumProvider.Instance.getMaxTradeValue(
        this.props.tradeType,
        tradeTokenKey,
        this.state.collateral
      ).then(maxTradeValue => {
        const tradeRequest = new TradeRequest(
          this.props.tradeType,
          this.props.asset,
          this.props.defaultUnitOfAccount,
          this.state.collateral,
          this.props.positionType,
          this.props.leverage,
          maxTradeValue,
          this.state.tokenizeNeeded
        );

        FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest).then(tradedAmountEstimate => {
          FulcrumProvider.Instance.getTradeSlippageRate(tradeRequest, tradedAmountEstimate).then(slippageRate => {
            observer.next({
              isTradeAmountTouched: this.state.isTradeAmountTouched,
              tradeAmountText: maxTradeValue.decimalPlaces(this._inputPrecision).toFixed(),
              tradeAmount: maxTradeValue,
              maxTradeAmount: this.state.maxTradeAmount,
              tradedAmountEstimate: tradedAmountEstimate,
              slippageRate: slippageRate ? slippageRate : new BigNumber(0)
            });
          });
        });
      });
    });
  };

  private rxFromCurrentAmount = (value: string): Observable<ITradeAmountChangeEvent | null> => {
    return new Observable<ITradeAmountChangeEvent | null>(observer => {
      let amountText = value;
      const amountTextForConversion = amountText === "" ? "0" : amountText[0] === "." ? `0${amountText}` : amountText;

      let amount = new BigNumber(amountTextForConversion);
      // handling negative values (incl. Ctrl+C)
      if (amount.isNegative()) {
        amount = amount.absoluteValue();
        amountText = amount.decimalPlaces(this._inputPrecision).toFixed();
      }
      if (amount.gt(this.state.maxTradeAmount)) {
        amount = this.state.maxTradeAmount;
        amountText = this.state.maxTradeAmount.decimalPlaces(this._inputPrecision).toFixed();
      }

      // updating stored value only if the new input value is a valid number
      if (!amount.isNaN()) {
        const tradeRequest = new TradeRequest(
          this.props.tradeType,
          this.props.asset,
          this.props.defaultUnitOfAccount,
          this.state.collateral,
          this.props.positionType,
          this.props.leverage,
          amount,
          this.state.tokenizeNeeded
        );

        FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest).then(tradedAmountEstimate => {
          FulcrumProvider.Instance.getTradeSlippageRate(tradeRequest, tradedAmountEstimate).then(slippageRate => {
            observer.next({
              isTradeAmountTouched: true,
              tradeAmountText: amountText,
              tradeAmount: amount,
              maxTradeAmount: this.state.maxTradeAmount,
              tradedAmountEstimate: tradedAmountEstimate,
              slippageRate: slippageRate ? slippageRate : new BigNumber(0)
            });
          });
        });
      } else {
        observer.next(null);
      }
    });
  };
}
