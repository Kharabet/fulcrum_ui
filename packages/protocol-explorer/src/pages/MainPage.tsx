import React, { Component } from "react";
import { Search } from "../components/Search";
import { AssetSelector } from "../components/AssetSelector";
import { MainChart } from "../components/MainChart";
import { ReactComponent as Arrow } from "../assets/images/icon-arrow.svg";
import { GroupButton } from "../components/GroupButton";
import { Header } from "../layout/Header";
import { ExplorerProvider } from "../services/ExplorerProvider";
import { ExplorerProviderEvents } from "../services/events/ExplorerProviderEvents"
import { NavService } from "../services/NavService";

interface IMainPageProps {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}
interface IMainPageState {
  periodChart: number,
  tvl: string,
  change24h: number
}

export class MainPage extends Component<IMainPageProps, IMainPageState> {
  private apiUrl = "https://api.bzx.network/v1";
  private _isMounted: boolean;

  constructor(props: any) {
    super(props);
    this.state = {
      periodChart: 1,
      tvl: '1.2',
      change24h: 0
    };

    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private onProviderChanged = () => {
    // this.derivedUpdate();
  };

  private onProviderAvailable = () => {
    // this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this._isMounted = true;
    this.getVaultBalanceUsd();
    // this.derivedUpdate();
  }

  
  onSearch = (filter: string) => {
    if (filter === "") {
      return;
    }
    NavService.Instance.History.push(`/search/${filter}`);
  }


  public render() {
    const tvl = +this.state.tvl;
    return (
      <React.Fragment>
        <section className="bg-gradient">
          <Header isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} />
          <div className="container">
            <div className="flex jc-sb">
              <div className="flex fd-c">
                <h1 className="mb-30">bZx Protocol Stats</h1>
                <GroupButton setPeriodChart={this.setPeriodChart} />
              </div>
              <div className="flex">
                <div className="tvl">TVL <span className="sign sign-currency">$ </span></div>
                <div>
                  <span className="tvl-value">{tvl ? this.getRoundedData(tvl) : this.state.tvl}</span>
                  {this.state.change24h !== 0 && <div className={`tvl-interest ${this.state.change24h < 0 ? `down` : ``}`}><Arrow />{Math.abs(this.state.change24h).toFixed(5)}<span className="sign">%</span></div>}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="wrapper-chart">
          <MainChart periodChart={this.state.periodChart} getchange24h={this.getchange24h} />
        </section>
        <section className="pt-75">
          <Search onSearch={this.onSearch} />
        </section>
        <section className="pt-60 pb-45">
          <div className="container">
            <AssetSelector />
          </div>
        </section>
      </React.Fragment>
    );
  }


  public getVaultBalanceUsd = async () => {
    const requestUrl = `${this.apiUrl}/vault-balance-usd`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    (!responseJson.success)
      ? console.error(responseJson.message)
      : await this.setState({ ...this.state, tvl: responseJson.data["all"] });
  }
  public setPeriodChart = (period: number) => {
    this.setState({ ...this.state, periodChart: period })
  }

  public getRoundedData = (value: number) => {
    if (value > 100000)
      return `${(value / 1000000).toFixed(1)}m`;
    if (value > 100)
      return `${(value / 1000).toFixed(1)}k`;
    return `${(value).toFixed(1)}`;
  }

  public getchange24h = (change24h: number) => {
    this.setState({ ...this.state, change24h: change24h });
  }
}
