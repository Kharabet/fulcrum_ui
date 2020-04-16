import React, { Component } from "react";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { OwnTokenGridHeader } from "./OwnTokenGridHeader";
import { HistoryTokenGridHeader } from "./HistoryTokenGridHeader";
import { IOwnTokenGridRowProps, OwnTokenGridRow } from "./OwnTokenGridRow";
import { HistoryTokenGridRow } from "./HistoryTokenGridRow";
import { OwnTokenCardMobile } from "./OwnTokenCardMobile";

export interface IOwnTokenGridProps {
  isMobileMedia: boolean;
  ownRowsData: IOwnTokenGridRowProps[];
}

interface IOwnTokenGridState {
  ownRowsData: IOwnTokenGridRowProps[];
  isShowHistory: boolean;
}

export class OwnTokenGrid extends Component<IOwnTokenGridProps, IOwnTokenGridState> {
  constructor(props: IOwnTokenGridProps) {
    super(props);
    this._isMounted = false;
    this.state = {
      ownRowsData: [],
      isShowHistory: false
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
    this.onShowHistory = this.onShowHistory.bind(this);
    this.onShowOpenPositions = this.onShowOpenPositions.bind(this);
  }

  private _isMounted: boolean;

  public async derivedUpdate() {
  }

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentWillMount(): void {
    this.derivedUpdate();
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridProps>,
    prevState: Readonly<IOwnTokenGridState>,
    snapshot?: any
  ): void {
    if (
      this.state.ownRowsData !== prevState.ownRowsData
    ) {
      this.derivedUpdate();
    }
  }

  public render() {

    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();

  }

  private renderDesktop = () => {
    const ownRows = this.props.ownRowsData.map(e => <OwnTokenGridRow key={`${e.currentKey.toString()}`} {...e} />);
    const historyRows = this.props.ownRowsData.map(e => <HistoryTokenGridRow key={`${e.currentKey.toString()}`} {...e} />);
    if (ownRows.length === 0) return null;

    return (
      <div className="own-token-grid">
        <div className="group-button">
          <button className={`${!this.state.isShowHistory ? `active` : ``}`} onClick={this.onShowOpenPositions}>Open positions</button>
          <button className={`${this.state.isShowHistory ? `active` : ``}`} onClick={this.onShowHistory}>Trade history</button>
        </div>
        {this.state.isShowHistory
          ? <React.Fragment>
            <HistoryTokenGridHeader />
            {historyRows}
          </React.Fragment>
          : <React.Fragment>
            <OwnTokenGridHeader />
            {ownRows}
          </React.Fragment>
        }

      </div>
    );
  }

  private renderMobile = () => {
    const ownRows = this.props.ownRowsData.map(e => <OwnTokenCardMobile key={`${e.currentKey.toString()}`} {...e} />);
    const historyRows = this.props.ownRowsData.map(e => <HistoryTokenGridRow key={`${e.currentKey.toString()}`} {...e} />);
    if (ownRows.length === 0) return null;

    return (
      <div className="own-token-cards">
        <div className="own-token-cards__header">Manage</div>
        <div className="group-button">
          <button className={`${!this.state.isShowHistory ? `active` : ``}`} onClick={this.onShowOpenPositions}>Open positions</button>
          <button className={`${this.state.isShowHistory ? `active` : ``}`} onClick={this.onShowHistory}>Trade history</button>
        </div>
        <div className="own-token-cards__container">
          {this.state.isShowHistory ? historyRows : ownRows}
        </div>
      </div>
    );
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
  private onShowHistory = () => {
    this._isMounted && this.setState({ ...this.state, isShowHistory: true });
  };

  private onShowOpenPositions = () => {
    this._isMounted && this.setState({ ...this.state, isShowHistory: false });
  };
}
