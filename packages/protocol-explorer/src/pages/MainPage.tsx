import React, { Component } from "react";
import { Search } from "../components/Search";
import { AssetSelector } from "../components/AssetSelector";
import { MainChart } from "../components/MainChart";
import { ReactComponent as Arrow } from "../assets/images/icon-arrow.svg";
import { GroupButton } from "../components/GroupButton";
import { Header } from "../layout/Header";
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
  }



  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public componentDidMount(): void {
    this._isMounted = true;
    this.getVaultBalanceUsd();
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
            <div className="flex fw-w jc-sb">
              <div className="flex fd-c w-md-100">
                <h1 className="mt-5 mb-30">bZx Protocol Stats</h1>
                {!this.props.isMobileMedia && <GroupButton setPeriodChart={this.setPeriodChart} />}
              </div>
              <div className="flex w-md-100 jc-fe">
                <div className="tvl">TVL <span className="sign sign-currency">$ </span></div>
                <div>
                  <span className="tvl-value">{tvl ? this.getRoundedData(tvl) : this.state.tvl}</span>
                  {this.state.change24h !== 0 && <div className={`tvl-interest ${this.state.change24h < 0 ? `down` : ``}`}><Arrow />{Math.abs(this.state.change24h).toFixed(5)}<span className="sign">%</span></div>}
                </div>
              </div>
              <div className="flex jc-c w-100 mb-45">
                {this.props.isMobileMedia && <GroupButton setPeriodChart={this.setPeriodChart} />}
              </div>
            </div>
          </div>
        </section>
        <section className="wrapper-chart">
          <MainChart periodChart={this.state.periodChart} getchange24h={this.getchange24h} />
        </section>
        <section className="search-container">
          <Search onSearch={this.onSearch} />
        </section>
        <section className="asset-selector-section">
            <AssetSelector />
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
      : this._isMounted && await this.setState({ ...this.state, tvl: responseJson.data["all"] });
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
    this._isMounted && this.setState({ ...this.state, change24h: change24h });
  }
}
