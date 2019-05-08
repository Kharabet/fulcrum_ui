import 'react-tippy/dist/tippy.css'
import { Tooltip } from "react-tippy";
import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component, FormEvent } from "react";
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
import { PositionTypeMarker } from "./PositionTypeMarker";

export interface ITradeFormProps {
  tradeType: TradeType;
  asset: Asset;
  positionType: PositionType;
  leverage: number;

  onSubmit: (request: TradeRequest) => void;
  onCancel: () => void;
}

interface ITradeFormState {
  assetDetails: AssetDetails | null;
  latestPriceDataPoint: IPriceDataPoint;

  tradeAmountText: string;
  tradeAmount: BigNumber;
  maxTradeAmount: BigNumber;

  tradedAmountEstimate: BigNumber;
}

export class TradeForm extends Component<ITradeFormProps, ITradeFormState> {
  private _input: HTMLInputElement | null = null;

  constructor(props: ITradeFormProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const latestPriceDataPoint = FulcrumProvider.Instance.getPriceDefaultDataPoint();
    const maxTradeValue = new BigNumber(0);
    const tradedAmountEstimate = new BigNumber(0);

    this.state = {
      assetDetails: assetDetails || null,
      tradeAmountText: maxTradeValue.toFixed(),
      tradeAmount: maxTradeValue,
      maxTradeAmount: maxTradeValue,
      tradedAmountEstimate: tradedAmountEstimate,
      latestPriceDataPoint: latestPriceDataPoint
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private getTradeTokenGridRowSelectionKey(leverage: number = this.props.leverage) {
    return new TradeTokenKey(this.props.asset, this.props.positionType, leverage);
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.props.leverage);
    const latestPriceDataPoint = await FulcrumProvider.Instance.getPriceLatestDataPoint(tradeTokenKey);
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey);
    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(
      new TradeRequest(
        this.props.tradeType,
        this.props.asset,
        this.props.positionType,
        this.props.leverage,
        maxTradeValue
      )
    );

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      tradeAmountText: maxTradeValue.toFixed(),
      tradeAmount: maxTradeValue,
      maxTradeAmount: maxTradeValue,
      tradedAmountEstimate: tradedAmountEstimate,
      latestPriceDataPoint: latestPriceDataPoint
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
      this.props.leverage !== prevProps.leverage
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

    const positionTypePrefix = this.props.positionType === PositionType.SHORT ? "pS" : "pL";
    const tokenNameBase = this.state.assetDetails.displayName;
    const tokenNamePosition = `${positionTypePrefix}${this.state.assetDetails.displayName}` +
      (this.props.leverage > 1 ? `${this.props.leverage}x` : ``);

    const tokenNameSource = this.props.tradeType === TradeType.BUY ? tokenNameBase : tokenNamePosition;
    const tokenNameDestination = this.props.tradeType === TradeType.BUY ? tokenNamePosition : tokenNameBase;

    const bnPrice = new BigNumber(this.state.latestPriceDataPoint.price).div(1000);
    const isAmountMaxed = this.state.tradeAmount.eq(this.state.maxTradeAmount);
    const tradedAmountEstimateText =
      this.state.tradedAmountEstimate.eq(0)
        ? "0"
        : this.state.tradedAmountEstimate.gte(new BigNumber("0.000001"))
          ? this.state.tradedAmountEstimate.toFixed(6)
          : this.state.tradedAmountEstimate.toExponential(3);

    return (
      <form className="trade-form" onSubmit={this.onSubmitClick}>
        <div className="trade-form__image" style={divStyle}>
          <img src={this.state.assetDetails.logoSvg} alt={tokenNameSource} />
        </div>
        <div className="trade-form__form-container">
          <div className="trade-form__form-values-container">
            <div className="trade-form__position-type-container">
              <PositionTypeMarker value={this.props.positionType} />
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Token</div>
              <div className="trade-form__value">{tokenNameSource}</div>
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Leverage</div>
              <div className="trade-form__value">{`${this.props.leverage.toString()}x`}</div>
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Price</div>
              <div className="trade-form__value">{`$${bnPrice.toFixed(2)}`}</div>
            </div>
            <div className="trade-form__kv-container">
              <div className="trade-form__label">Amount</div>
              <div className="trade-form__value">{tokenNameSource}</div>
            </div>
            <input
              type="text"
              ref={this._setInputRef}
              className="trade-form__amount"
              value={this.state.tradeAmountText}
              onChange={this.onTradeAmountChange}
            />
            <div className="trade-form__kv-container">
              {isAmountMaxed ? 
                  this.state.maxTradeAmount.eq(0) ? (
                    <div className="trade-form__label">Your wallet is empty &#9785;</div>
                  ) : (
                    <div className="trade-form__label">Max amount entered.</div>
                  )
              : (
                <div className="trade-form__label trade-form__label--action" onClick={this.onInsertMaxValue}>
                  Insert max value
                </div>
              )}
              <div className="trade-form__value trade-form__value--no-color">
                <Tooltip
                  html={
                    <div style={{ /*maxWidth: `300px`*/ }}>
                      ... Info ...
                    </div>
                  }
                >
                  <span className="rounded-mark">?</span>
                </Tooltip>
                &nbsp; {tradedAmountEstimateText} {tokenNameDestination}
              </div>
            </div>
          </div>

          <div className="trade-form__actions-container">
            <button type="submit" className={`trade-form__submit-button ${submitClassName}`}>
              {this.props.tradeType}
            </button>
            <button className="trade-form__cancel-button" onClick={this.onCancelClick}>
              <span className="trade-form__label--action">Cancel</span>
            </button>
          </div>
        </div>
      </form>
    );
  }

  public onTradeAmountChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // handling different types of empty values
    let amountText = event.target.value ? event.target.value : "";
    const amountTextForConversion = amountText === "" ? "0" : amountText[0] === "." ? `0${amountText}` : amountText;

    let amount = new BigNumber(amountTextForConversion);
    // handling negative values (incl. Ctrl+C)
    if (amount.isNegative()) {
      amountText = amount.absoluteValue().toFixed();
      amount = amount.absoluteValue();
    }
    if (amount.gt(this.state.maxTradeAmount)) {
      amount = this.state.maxTradeAmount;
      amountText = this.state.maxTradeAmount.toFixed();
    }

    // updating stored value only if the new input value is a valid number
    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(
      new TradeRequest(this.props.tradeType, this.props.asset, this.props.positionType, this.props.leverage, amount)
    );
    if (!amount.isNaN()) {
      this.setState({
        ...this.state,
        tradeAmountText: amountText,
        tradeAmount: amount,
        tradedAmountEstimate: tradedAmountEstimate
      });
    }
  };

  public onInsertMaxValue = async () => {
    if (!this.state.assetDetails) {
      return null;
    }

    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey);
    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(
      new TradeRequest(
        this.props.tradeType,
        this.props.asset,
        this.props.positionType,
        this.props.leverage,
        maxTradeValue
      )
    );
    this.setState({
      ...this.state,
      tradeAmountText: maxTradeValue.toFixed(),
      tradeAmount: maxTradeValue,
      maxTradeAmount: maxTradeValue,
      tradedAmountEstimate: tradedAmountEstimate
    });
  };

  public onCancelClick = () => {
    this.props.onCancel();
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
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmount
      )
    );
  };
}
