import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { Preloader } from "./Preloader";

export interface IHistoryTokenCardMobileProps {
  currentKey: TradeTokenKey;
  pTokenAddress: string;
  onTrade: (request: TradeRequest) => void;
}

interface IHistoryTokenCardMobileState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  isLoading: boolean;
}

export class HistoryTokenCardMobile extends Component<IHistoryTokenCardMobileProps, IHistoryTokenCardMobileState> {
  constructor(props: IHistoryTokenCardMobileProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.currentKey.asset);

    this._isMounted = false;

    this.state = {
      assetDetails: assetDetails || null,
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    const tradeTokenKey = this.props.currentKey;
    const latestAssetPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);

    const data: [BigNumber | null, BigNumber | null] = await FulcrumProvider.Instance.getTradeBalanceAndProfit(tradeTokenKey);
    const assetBalance = data[0];
    const profit = data[1];

    this._isMounted && this.setState(p => ({
      ...this.state,
      latestAssetPriceDataPoint: latestAssetPriceDataPoint,
      assetBalance: assetBalance,
      profit: profit,
      isLoading: latestAssetPriceDataPoint.price !== 0 ? false : p.isLoading
    }));
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.props.currentKey.toString()) {
      await this.derivedUpdate();
    }
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }
  private renderOwnTokenRowHistory = (state: IHistoryTokenCardMobileState, props: IHistoryTokenCardMobileProps, bnPrice: BigNumber, bnLiquidationPrice: BigNumber): React.ReactFragment => {
    if (!state.assetDetails) return <React.Fragment></React.Fragment>;
    return (
      <React.Fragment>
        <div className="history-token-card-mobile">
          <div className="history-token-card-mobile__header">
            <span className="history-token-card-mobile__header-span">Date</span>
            <span className="history-token-card-mobile__header-span">Asset</span>
            <span className="history-token-card-mobile__header-span">Type</span>
          </div>
          <div className="history-token-card-mobile__row">
            <div className="history-token-card-mobile__col-token-date">
              12 June 2019
            </div>
            <div className="history-token-card-mobile__col-token-asset">
              <span className="history-token-card-mobile__value">SAI</span>
            </div>
            <div className="history-token-card-mobile__col-type">
              
              <div className="position-type-marker">
                {`${props.currentKey.leverage}x ${props.currentKey.positionType}`}
              </div>
            </div>
          </div>
          <div className="history-token-card-mobile__row">
            <div className="history-token-card-mobile__col-asset-unit">
              <span className="history-token-card-mobile__header">Unit of Account</span>
              <span className="history-token-card-mobile__value">{props.currentKey.unitOfAccount}</span>
            </div>
            <div className="history-token-card-mobile__col-asset-price">
              <span className="history-token-card-mobile__header">Open price</span>
              <span className="history-token-card-mobile__value">
                {!state.isLoading
                  ? <React.Fragment>
                    <span className="sign-currency">$</span>{bnPrice.toFixed(2)}
                  </React.Fragment>
                  : <Preloader width="74px" />
                }
              </span>
            </div>
            <div className="history-token-card-mobile__col-liquidation-price">
              <span className="history-token-card-mobile__header">Liq. price</span>
              <span className="history-token-card-mobile__value">
                {!state.isLoading
                  ? state.assetBalance
                    ? <React.Fragment>
                      <span className="sign-currency">$</span>{bnLiquidationPrice.toFixed(2)}
                    </React.Fragment>
                    : '$0.00'
                  : <Preloader width="74px" />
                }
              </span>
            </div>
          </div>
          <div className="history-token-card-mobile__row">
            <div className="history-token-card-mobile__col-position-value">
              <span className="history-token-card-mobile__header">Value</span>
              <span className="history-token-card-mobile__value">
                {!state.isLoading
                  ? state.assetBalance
                    ? <React.Fragment>
                      <span className="sign-currency">$</span>{state.assetBalance.toFixed(2)}
                    </React.Fragment>
                    : '$0.00'
                  : <Preloader width="74px" />
                }
              </span>
            </div>
            <div className="history-token-card-mobile__col-profit">
              <span className="history-token-card-mobile__header">Profit</span>
              <span className="history-token-card-mobile__value">
                {!state.isLoading
                  ? state.profit
                    ? <React.Fragment>
                      <span className="sign-currency">$</span>{state.profit.toFixed(2)}
                    </React.Fragment>
                    : '$0.00'
                  : <Preloader width="74px" />
                }
              </span>
            </div>
            <div className="history-token-card-mobile__result">
              <span className="history-token-card-mobile__header">Result</span>
              <span className="history-token-card-mobile__value-result">Liquidated</span>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const bnPrice = new BigNumber(this.state.latestAssetPriceDataPoint.price);
    const bnLiquidationPrice = new BigNumber(this.state.latestAssetPriceDataPoint.liquidationPrice);

    return this.renderOwnTokenRowHistory(this.state, this.props, bnPrice, bnLiquidationPrice);
  }
}