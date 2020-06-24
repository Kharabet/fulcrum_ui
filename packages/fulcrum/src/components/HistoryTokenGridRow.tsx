import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { TradeRequest } from "../domain/TradeRequest";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { Preloader } from "./Preloader";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { PositionEventsGroup, HistoryEvent } from "../domain/PositionEventsGroup";

export interface IHistoryTokenGridRowProps {
  eventsGroup: PositionEventsGroup
}

interface IHistoryTokenGridRowState {
  assetBalance: BigNumber | null;
  isLoading: boolean;
  isShowCollapse: boolean;
}

export class HistoryTokenGridRow extends Component<IHistoryTokenGridRowProps, IHistoryTokenGridRowState> {
  constructor(props: IHistoryTokenGridRowProps, context?: any) {
    super(props, context);


    this._isMounted = false;

    this.state = {
      assetBalance: new BigNumber(0),
      isLoading: true,
      isShowCollapse: false
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

  public renderOtherEvents = () => {
    const croppedEvent = this.props.eventsGroup.events.slice(0, -1).reverse();
    return croppedEvent.map(event => {
      return (<div className="history-token-grid-row history-token-grid-row-inner">
        <div className="history-token-grid-row-inner__col-token-date">
          {event.date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </div>

        <div className="history-token-grid-row-inner__result">
          <span>{event.action.replace(event.loanId, "")}</span>
        </div>
        <div title={event.positionValue.toFixed(18)} className="history-token-grid-row-inner__col-position">
          {event.positionValue.toFixed(4)}
        </div>
        <div className="history-token-grid-row-inner__col-asset-price">
          {!this.state.isLoading
            ? <React.Fragment>
              <span className="sign-currency">$</span>{event.tradePrice.toFixed(2)}
            </React.Fragment>
            : <Preloader width="74px" />
          }
        </div>
        <div title={event.value.toFixed(18)} className="history-token-grid-row-inner__col-position-value">
          {!this.state.isLoading
            ? <React.Fragment>
              <span className="sign-currency">$</span>{event.value.toFixed(2)}
            </React.Fragment>
            : <Preloader width="74px" />
          }
        </div>
        <div title={event.profit instanceof BigNumber ? event.profit.toFixed(18) : "-"} className="history-token-grid-row-inner__col-profit">
          {event.profit instanceof BigNumber ? <React.Fragment><span className="sign-currency">$</span>{event.profit.toFixed(3)}</React.Fragment> : "-"}
        </div>
      </div>)
    })
  }

  public render() {
    const latestEvent = this.props.eventsGroup.events[this.props.eventsGroup.events.length - 1]
    const profitSum = this.props.eventsGroup.events.reduce((a: BigNumber, b: HistoryEvent) =>  a.plus(b.profit instanceof BigNumber ? b.profit : new BigNumber(0) || 0), new BigNumber(0));
    return (
      <div>
        <div className="history-token-grid-row">
          <div className="history-token-grid-row__col-token-date">
            {latestEvent.date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </div>
          <div className="history-token-grid-row__col-token-asset">
            {this.props.eventsGroup.baseToken}-{this.props.eventsGroup.quoteToken}
          </div>
          <div className="history-token-grid-row__col-type">
            <div className="position-type-marker">
              {`${this.props.eventsGroup.leverage}x ${this.props.eventsGroup.positionType}`}
            </div>
          </div>
          {/* <div className="history-token-grid-row__col-asset-unit">
            {this.props.eventsGroup.quoteToken}
          </div> */}
          <div title={latestEvent.positionValue.toFixed(18)} className="history-token-grid-row__col-position">
            {latestEvent.positionValue.toFixed(4)}
          </div>
          <div className="history-token-grid-row__col-asset-price">
            {!this.state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{latestEvent.tradePrice.toFixed(2)}
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          {/* <div className="history-token-grid-row__col-liquidation-price">
        {!this.state.isLoading
          ? this.state.assetBalance
            ? <React.Fragment>
              <span className="sign-currency">$</span>{new BigNumber(0).toFixed(2)}
            </React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div> */}
          <div title={latestEvent.value.toFixed(18)} className="history-token-grid-row__col-position-value">
            {!this.state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{latestEvent.value.toFixed(2)}
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div title={!this.state.isShowCollapse ? profitSum.toFixed(18) : latestEvent.profit instanceof BigNumber ? latestEvent.profit.toFixed(18) : "-"} className="history-token-grid-row__col-profit">
            {!this.state.isLoading
              ? latestEvent.profit instanceof BigNumber
                ? <React.Fragment><span className="sign-currency">$</span>{!this.state.isShowCollapse ? profitSum.toFixed(3) : latestEvent.profit.toFixed(3)}</React.Fragment>
                : "-"
              : <Preloader width="74px" />
            }
          </div>
          <div className={`history-token-grid-row__result ${this.props.eventsGroup.events.length - 1 ? `toggle-collapse` : ``}  ${this.state.isShowCollapse ? `opened-collapse` : ``}`} onClick={this.toggleCollapse}>
            <span>{latestEvent.action}</span>
          </div>
        </div>
        <div className={`collapse ${this.state.isShowCollapse ? `show` : `hide`}`}>
          {this.renderOtherEvents()}
        </div>
      </div>)
  }

  public toggleCollapse = () => {
    this.setState({ ...this.state, isShowCollapse: !this.state.isShowCollapse })
  }
}