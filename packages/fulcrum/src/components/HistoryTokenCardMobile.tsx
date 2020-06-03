import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { TradeRequest } from "../domain/TradeRequest";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { Preloader } from "./Preloader";

import "../styles/components/history-token-card-mobile.scss";
import { Asset } from "../../../torque/src/domain/Asset";
import { PositionType } from "../domain/PositionType";
import {IHistoryTokenGridRowProps} from "./HistoryTokenGridRow";

interface IHistoryTokenCardMobileState {

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  isLoading: boolean;
}

export class HistoryTokenCardMobile extends Component<IHistoryTokenGridRowProps, IHistoryTokenCardMobileState> {
  constructor(props: IHistoryTokenGridRowProps, context?: any) {
    super(props, context);

    this._isMounted = false;

    this.state = {
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {

    this._isMounted && this.setState({
      ...this.state,
      isLoading: false
    });
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }
  
  public render() {
    return (<div className="history-token-card-mobile">
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
            {`${this.props.leverage}x ${this.props.positionType}`}
          </div>
        </div>
      </div>
      <div className="history-token-card-mobile__row">
        <div className="history-token-card-mobile__col-asset-unit">
          <span className="history-token-card-mobile__header">Unit of Account</span>
          <span className="history-token-card-mobile__value">{this.props.collateralAsset}</span>
        </div>
        <div className="history-token-card-mobile__col-asset-price">
          <span className="history-token-card-mobile__header">Open price</span>
          <span className="history-token-card-mobile__value">
            {!this.state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{new BigNumber(0).toFixed(2)}
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </span>
        </div>
        <div className="history-token-card-mobile__col-liquidation-price">
          <span className="history-token-card-mobile__header">Liq. price</span>
          <span className="history-token-card-mobile__value">
            {!this.state.isLoading
              ? this.state.assetBalance
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{new BigNumber(0).toFixed(2)}
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
            {!this.state.isLoading
              ? this.state.assetBalance
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{this.state.assetBalance.toFixed(2)}
                </React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </span>
        </div>
        <div className="history-token-card-mobile__col-profit">
          <span className="history-token-card-mobile__header">Profit</span>
          <span className="history-token-card-mobile__value">
            {!this.state.isLoading
              ? this.state.profit
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{this.state.profit.toFixed(2)}
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
    </div>)
  }
}