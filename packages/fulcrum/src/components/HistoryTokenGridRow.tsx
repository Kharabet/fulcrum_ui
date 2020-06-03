import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { TradeRequest } from "../domain/TradeRequest";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { Preloader } from "./Preloader";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";

export interface IHistoryTokenGridRowProps {
  tradeAsset: Asset;
  collateralAsset: Asset;
  leverage: number;
  positionType: PositionType;
  onTrade: (request: TradeRequest) => void;
}

interface IHistoryTokenGridRowState {
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  isLoading: boolean;
}

export class HistoryTokenGridRow extends Component<IHistoryTokenGridRowProps, IHistoryTokenGridRowState> {
  constructor(props: IHistoryTokenGridRowProps, context?: any) {
    super(props, context);


    this._isMounted = false;

    this.state = {
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

  private onProviderChanged = async () => {
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
    return (<div className="history-token-grid-row">
      <div className="history-token-grid-row__col-token-date">
        12 June 2019
    </div>
      <div className="history-token-grid-row__col-token-asset">
        SAI
    </div>
      <div className="history-token-grid-row__col-type">
        <div className="position-type-marker">
          {`${this.props.leverage}x ${this.props.positionType}`}
        </div>
      </div>
      <div className="history-token-grid-row__col-asset-unit">
        {this.props.collateralAsset}
      </div>
      <div className="history-token-grid-row__col-position">
        0.8884
    </div>
      <div className="history-token-grid-row__col-asset-price">
        {!this.state.isLoading
          ? <React.Fragment>
            <span className="sign-currency">$</span>{new BigNumber(0).toFixed(2)}
          </React.Fragment>
          : <Preloader width="74px" />
        }
      </div>
      <div className="history-token-grid-row__col-liquidation-price">
        {!this.state.isLoading
          ? this.state.assetBalance
            ? <React.Fragment>
              <span className="sign-currency">$</span>{new BigNumber(0).toFixed(2)}
            </React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div>
      <div className="history-token-grid-row__col-position-value">
        {!this.state.isLoading
          ? this.state.assetBalance
            ? <React.Fragment>
              <span className="sign-currency">$</span>{this.state.assetBalance.toFixed(2)}
            </React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div>
      <div className="history-token-grid-row__col-profit">
        {!this.state.isLoading
          ? this.state.profit
            ? <React.Fragment>
              <span className="sign-currency">$</span>{this.state.profit.toFixed(2)}
            </React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div>
      <div className="history-token-grid-row__result">
        Liquidated
    </div>
    </div>)
  }
}