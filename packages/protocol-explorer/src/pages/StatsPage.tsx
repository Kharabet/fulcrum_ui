import React, { Component } from "react";
import { Search } from "../components/Search";
import { StatsChart } from "../components/StatsChart";
import { TxGrid } from "../components/TxGrid";
import { Header } from "../layout/Header";
import { RouteComponentProps } from "react-router";
import { Asset } from "../domain/Asset";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { BigNumber } from "@0x/utils";
import { TradeEvent } from "../domain/TradeEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";
import { CloseWithDepositEvent } from "../domain/CloseWithDepositEvent";
import { BurnEvent } from "../domain/BurnEvent";
import { MintEvent } from "../domain/MintEvent";
import { BorrowEvent } from "../domain/BorrowEvent";
import { ITxRowProps } from "../components/TxRow";
import { ExplorerProvider } from "../services/ExplorerProvider";
import { ExplorerProviderEvents } from "../services/events/ExplorerProviderEvents";
import { NavService } from '../services/NavService';


interface MatchParams {
  token: string;
}

interface IStatsPageProps extends RouteComponentProps<MatchParams> {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}

interface IStatsPageState {
  asset: Asset;
  events: ITxRowProps[];
}

export class StatsPage extends Component<IStatsPageProps, IStatsPageState> {
  private _isMounted: boolean;

  constructor(props: any) {
    super(props);
    this.state = {
      asset: this.props.match.params.token.toUpperCase() as Asset,
      events: [],
    };

    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }
  
  private async derivedUpdate() {
    const provider = ExplorerProvider.getLocalstorageItem('providerType');

    !ExplorerProvider.Instance.web3Wrapper && (!provider || provider === "None") &&
      this.props.doNetworkConnect();

    if (ExplorerProvider.Instance.contractsSource) {
      const liquidationEvents = ExplorerProvider.Instance.getGridItems((await ExplorerProvider.Instance.getLiquidationHistory()).filter((e: LiquidationEvent) => e.loanToken === this.state.asset));
      const tradeEvents = ExplorerProvider.Instance.getGridItems((await ExplorerProvider.Instance.getTradeHistory()).filter((e: TradeEvent) => e.baseToken === this.state.asset));
      const closeEvents = ExplorerProvider.Instance.getGridItems((await ExplorerProvider.Instance.getCloseWithSwapHistory()).filter((e: CloseWithSwapEvent) => e.loanToken === this.state.asset));
      const closeWithDepositEvents = ExplorerProvider.Instance.getGridItems((await ExplorerProvider.Instance.getCloseWithDepositHistory()).filter((e: CloseWithDepositEvent) => e.loanToken === this.state.asset));
      const borrowEvents = ExplorerProvider.Instance.getGridItems((await ExplorerProvider.Instance.getBorrowHistory()).filter((e: BorrowEvent) => e.loanToken === this.state.asset));
      const mintEvents = ExplorerProvider.Instance.getGridItems(await ExplorerProvider.Instance.getMintHistory(this.state.asset));
      const burnEvents = ExplorerProvider.Instance.getGridItems(await ExplorerProvider.Instance.getBurnHistory(this.state.asset));
      const events: ITxRowProps[] = liquidationEvents
      .concat(closeEvents)
      .concat(tradeEvents)
      .concat(closeWithDepositEvents)
      .concat(borrowEvents)
      .concat(mintEvents)
      .concat(burnEvents);

      this._isMounted && this.setState({
        ...this.state,
        events
      })
    }
  }

  private onProviderChanged = () => {
    this.derivedUpdate();
  };

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };


  public componentWillUnmount(): void {
    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this._isMounted = true;
    this.derivedUpdate();
  }

  onSearch = (filter: string) => {
    if (filter === "") {
      return;
    }
    NavService.Instance.History.push(`/search/${filter}`);
  }

  public render() {
    return (
      <React.Fragment>
        <Header isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} />
        <section>
          <div className="container">
            <StatsChart />
            <div className="flex jc-c labels-container">
              <div className="label-chart"><span className="bg-green"></span>Supply APR, %</div>
              <div className="label-chart"><span className="bg-primary"></span>TVL</div>
              <div className="label-chart"><span className="bg-secondary"></span>Utilization, %</div>
            </div>
          </div>
        </section>
        <section className="pt-75">
          <Search onSearch={this.onSearch} />
        </section>
        <section className="pt-90">
          <div className="container">
            <TxGrid events={this.state.events} />
          </div>
        </section>
      </React.Fragment>
    );
  }
} 
