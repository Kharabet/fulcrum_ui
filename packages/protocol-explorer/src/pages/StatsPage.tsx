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
import { Loader } from "../components/Loader";


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
  isDataLoading: boolean;
}

export class StatsPage extends Component<IStatsPageProps, IStatsPageState> {
  private _isMounted: boolean;

  constructor(props: any) {
    super(props);
    this.state = {
      asset: this.props.match.params.token.toUpperCase() as Asset,
      events: [],
      isDataLoading: true
    };

    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {
    await this._isMounted && this.setState({
      ...this.state,
      isDataLoading: true
    });

    if (ExplorerProvider.Instance.unsupportedNetwork) {
      await this._isMounted && this.setState({
        events: [],
        isDataLoading: false
      });
      return;
    }

    const provider = ExplorerProvider.getLocalstorageItem('providerType');

    if (!provider || provider === "None" || !ExplorerProvider.Instance.contractsSource || !ExplorerProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect();
      await this._isMounted && this.setState({
        events: [],
      });
      return;
    }

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

    await this._isMounted && this.setState({
      ...this.state,
      events,
      isDataLoading: false
    })
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
        <main>
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

          {!ExplorerProvider.Instance.unsupportedNetwork ?
            <React.Fragment>
              {this.state.isDataLoading
                ? <section className="pt-90 pb-45">
                  <div className="container">
                    <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
                  </div>
                </section>
                : <React.Fragment>
                  <section className="pt-75">
                    <Search onSearch={this.onSearch} />
                  </section>
                  <section className="pt-90">
                    <div className="container">
                      <TxGrid events={this.state.events} />
                    </div>
                  </section>
                </React.Fragment>}
            </React.Fragment> :
            <section className="pt-75">
              <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                <div style={{ cursor: `pointer` }}>
                  You are connected to the wrong network.
                      </div>
              </div>
            </section>
          }
        </main>
      </React.Fragment>
    );
  }
} 
