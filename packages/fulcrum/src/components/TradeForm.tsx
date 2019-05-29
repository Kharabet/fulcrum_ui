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

export interface ITradeFormProps {
  tradeType: TradeType;
  asset: Asset;
  positionType: PositionType;
  leverage: number;
  defaultCollateral: Asset;
  defaultUnitOfAccount: Asset;
  defaultTokenizeNeeded: boolean;

  onSubmit: (request: TradeRequest) => void;
  onCancel: () => void;
  onTrade: (request: TradeRequest) => void;
}

interface ITextChangeEvent {
  isTradeAmountTouched: boolean;
  tradeAmountText: string;
  tradeAmount: BigNumber;
  tradedAmountEstimate: BigNumber;
  maxTradeAmount: BigNumber;
  slippageRate: BigNumber;
}

interface ITradeFormState {
  assetDetails: AssetDetails | null;
  collateral: Asset;
  unitOfAccount: Asset;
  tokenizeNeeded: boolean;
  latestPriceDataPoint: IPriceDataPoint;

  isTradeAmountTouched: boolean;
  tradeAmountText: string;
  tradeAmount: BigNumber;
  balance: BigNumber | null;
  positionTokenBalance: BigNumber | null;
  maxTradeAmount: BigNumber;

  isChangeCollateralOpen: boolean;

  tradedAmountEstimate: BigNumber;
  slippageRate: BigNumber;
}

export class TradeForm extends Component<ITradeFormProps, ITradeFormState> {
  private readonly _inputPrecision = 6;
  private _input: HTMLInputElement | null = null;

  private readonly _inputChange: Subject<string>;
  private readonly _inputSetMax: Subject<void>;

  constructor(props: ITradeFormProps, context?: any) {
    super(props, context);
    const assetDetails = AssetsDictionary.assets.get(props.asset);
    const latestPriceDataPoint = FulcrumProvider.Instance.getPriceDefaultDataPoint();
    const balance = null;
    const positionTokenBalance = null;
    const maxTradeValue = new BigNumber(0);
    const slippageRate = new BigNumber(0);
    const tradedAmountEstimate = new BigNumber(0);

    this.state = {
      assetDetails: assetDetails || null,
      collateral: props.defaultCollateral,
      unitOfAccount: props.defaultUnitOfAccount,
      tokenizeNeeded: props.defaultTokenizeNeeded,
      isTradeAmountTouched: false,
      tradeAmountText: "",
      tradeAmount: maxTradeValue,
      balance: balance,
      positionTokenBalance: positionTokenBalance,
      maxTradeAmount: maxTradeValue,
      isChangeCollateralOpen: false,
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate,
      latestPriceDataPoint: latestPriceDataPoint
    };

    this._inputChange = new Subject();
    this._inputSetMax = new Subject();

    merge(
      this._inputChange.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((value) => this.operatorCurrentAmount(value))
      ),
      this._inputSetMax.pipe(switchMap(() => this.operatorMaxAmount()))
    ).pipe(
      switchMap((value) => new Observable<ITextChangeEvent | null>((observer) => observer.next(value)))
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
      this.state.unitOfAccount,
      this.props.positionType,
      leverage
    );
  }

  private _setInputRef = (input: HTMLInputElement) => {
    this._input = input;
  };

  private async derivedUpdate() {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.props.leverage);
    const latestPriceDataPoint = await FulcrumProvider.Instance.getPriceLatestDataPoint(tradeTokenKey);
    const positionTokenBalance = await FulcrumProvider.Instance.getPositionTokenBalance(tradeTokenKey);
    const balance =
      this.props.tradeType === TradeType.BUY
        ? await FulcrumProvider.Instance.getBaseTokenBalance(this.state.collateral)
        : positionTokenBalance;
    const maxTradeValue = await FulcrumProvider.Instance.getMaxTradeValue(this.props.tradeType, tradeTokenKey, this.state.collateral);
    const tradeRequest = new TradeRequest(
      this.props.tradeType,
      this.props.asset,
      this.state.unitOfAccount,
      this.state.collateral,
      this.props.positionType,
      this.props.leverage,
      new BigNumber(0)
    );
    const tradedAmountEstimate = await FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest);
    const slippageRate = await FulcrumProvider.Instance.getSlippageRate(tradeRequest);

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      tradeAmountText: "",
      tradeAmount: new BigNumber(0),
      balance: balance,
      positionTokenBalance: positionTokenBalance,
      maxTradeAmount: maxTradeValue,
      tradedAmountEstimate: tradedAmountEstimate,
      slippageRate: slippageRate,
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

    const positionTypePrefix = this.props.positionType === PositionType.SHORT ? "pS" : "pL";
    const positionLeveragePostfix = this.props.leverage > 1 ? `${this.props.leverage}x` : "";
    const tokenNameBase = this.state.assetDetails.displayName;
    const tokenNamePosition = `${positionTypePrefix}${this.state.assetDetails.displayName}${positionLeveragePostfix}`;

    const tokenNameSource = this.props.tradeType === TradeType.BUY ? this.state.collateral : tokenNamePosition;
    const tokenNameDestination = this.props.tradeType === TradeType.BUY ? tokenNamePosition : this.state.collateral;

    let bnPrice = new BigNumber(this.state.latestPriceDataPoint.price);
    if (this.props.positionType === PositionType.SHORT) {
      bnPrice = bnPrice.div(1000);
    }

    const isAmountMaxed = this.state.tradeAmount.eq(this.state.maxTradeAmount);
    const amountMsg =
      this.state.balance && this.state.balance.eq(0)
        ? "Your wallet is empty \u2639"
        : this.state.tradeAmount.gt(0)
          ? `Slippage: ${this.state.slippageRate.toFixed(2)}%`
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
              <div className="trade-form__label">Position Token</div>
              <div className="trade-form__value">{tokenNameBase}</div>
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">
                {this.props.tradeType === TradeType.BUY ? `Deposit Token` : `Withdrawal Token`}
                {` `}
                <button className="trade-form__change-button" onClick={this.onChangeCollateralOpen}>
                  <span className="trade-form__label--action">Change</span>
                </button>
              </div>
              <div className="trade-form__value">{this.state.collateral}</div>
            </div>
            {this.state.collateral !== Asset.ETH && this.props.tradeType === TradeType.BUY ? (
              <div className="trade-form__token-message-container">
                <div className="trade-form__token-message-container--message">
                  Selected deposit token ({this.state.collateral}) may need approval, which can take up to 5 minutes.
                </div>
              </div>
            ) : `` }
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Position Price</div>
              <div className="trade-form__value">{`$${bnPrice.toFixed(2)}`}</div>
            </div>
            <div className="trade-form__kv-container trade-form__kv-container--w_dots">
              <div className="trade-form__label">Leverage</div>
              <div className="trade-form__value">{`${this.props.leverage.toString()}x`}</div>
            </div>
            <div className="trade-form__kv-container">
              <div className="trade-form__label">Amount</div>
              <div className="trade-form__value">{tokenNameSource}</div>
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
              <div className="trade-form__label">{amountMsg}</div>
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

            {this.state.positionTokenBalance && this.props.tradeType === TradeType.BUY && this.state.positionTokenBalance.eq(0) ? (
              <div className="collapsible-container--margin-top">
                <CollapsibleContainer title="Advanced">
                  <div className="trade-form__kv-container">
                    <div className="trade-form__label trade-form__label--no-bg">
                      Unit of Account &nbsp;
                      <UnitOfAccountSelector items={[Asset.USDC, Asset.DAI]} value={this.state.unitOfAccount} onChange={this.onChangeUnitOfAccount} />
                    </div>
                  </div>
                  <div className="trade-form__kv-container">
                    <div className="trade-form__label trade-form__label--no-bg">
                      <CheckBox checked={this.state.tokenizeNeeded} onChange={this.onChangeTokenizeNeeded}>Tokenize it &nbsp;</CheckBox>
                    </div>
                  </div>
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
            collateralType={this.props.tradeType === TradeType.BUY ? `Deposit` : `Withdrawal`}
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

  public onChangeUnitOfAccount = async (asset: Asset) => {
    this.setState({ ...this.state, unitOfAccount: asset }, () => {
      this.props.onTrade(
        new TradeRequest(
          this.props.tradeType,
          this.props.asset,
          asset,
          this.state.collateral,
          this.props.positionType,
          this.props.leverage,
          this.state.tradeAmount
        )
      );
    });
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
        this.state.unitOfAccount,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        this.state.tradeAmount
      )
    );
  };

  private operatorMaxAmount = (): Observable<ITextChangeEvent | null> => {
    return new Observable<ITextChangeEvent | null>(observer => {
      const tradeTokenKey = this.getTradeTokenGridRowSelectionKey();
      FulcrumProvider.Instance.getMaxTradeValue(
        this.props.tradeType,
        tradeTokenKey,
        this.state.collateral
      ).then(maxTradeValue => {
        const tradeRequest = new TradeRequest(
          this.props.tradeType,
          this.props.asset,
          this.state.unitOfAccount,
          this.state.collateral,
          this.props.positionType,
          this.props.leverage,
          maxTradeValue
        );

        FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest).then(tradedAmountEstimate => {
          FulcrumProvider.Instance.getSlippageRate(tradeRequest).then(slippageRate => {
            observer.next({
              isTradeAmountTouched: this.state.isTradeAmountTouched,
              tradeAmountText: maxTradeValue.decimalPlaces(this._inputPrecision).toFixed(),
              tradeAmount: maxTradeValue,
              maxTradeAmount: this.state.maxTradeAmount,
              tradedAmountEstimate: tradedAmountEstimate,
              slippageRate: slippageRate
            });
          });
        });
      });
    });
  };

  private operatorCurrentAmount = (value: string): Observable<ITextChangeEvent | null> => {
    return new Observable<ITextChangeEvent | null>(observer => {
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
      const tradeRequest = new TradeRequest(
        this.props.tradeType,
        this.props.asset,
        this.state.unitOfAccount,
        this.state.collateral,
        this.props.positionType,
        this.props.leverage,
        amount
      );

      if (!amount.isNaN()) {
        FulcrumProvider.Instance.getTradedAmountEstimate(tradeRequest).then(tradedAmountEstimate => {
          FulcrumProvider.Instance.getSlippageRate(tradeRequest).then(slippageRate => {
            observer.next({
              isTradeAmountTouched: true,
              tradeAmountText: amountText,
              tradeAmount: amount,
              maxTradeAmount: this.state.maxTradeAmount,
              tradedAmountEstimate: tradedAmountEstimate,
              slippageRate: slippageRate
            });
          });
        });
      } else {
        observer.next(null);
      }
    });
  };
}
