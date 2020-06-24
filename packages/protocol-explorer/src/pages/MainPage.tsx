import React, { Component } from "react";
import { Search } from "../components/Search";
import { AssetSelector } from "../components/AssetSelector";
import { MainChart } from "../components/MainChart";
import { ReactComponent as Arrow } from "../assets/images/icon-arrow.svg";
import { GroupButton } from "../components/GroupButton";
import { Header } from "../layout/Header";

interface IMainPageProps {
}
interface IMainPageState {
  periodChart: number,
  tvl: string,
  change24h: number
}

export class MainPage extends Component<IMainPageProps, IMainPageState> {
  private apiUrl = "https://api.bzx.network/v1";
  constructor(props: any) {
    super(props);
    this.state = {
      periodChart: 1,
      tvl: '1.2',
      change24h: 0
    };
  }
  public render() {
    const tvl = +this.state.tvl;
    return (
      <React.Fragment>
        <section className="bg-gradient">
          <Header />
          <div className="container">
            <div className="flex jc-sb">
              <div className="flex fd-c">
                <h1 className="mb-30">bZx Protocol Stats</h1>
                <GroupButton setPeriodChart={this.setPeriodChart} />
              </div>
              <div className="flex">
                <div className="tvl">TVL <span className="tvl-sign">$ </span></div>
                <div>
                  <span className="tvl-value">{tvl ? this.getRoundedData(tvl) : this.state.tvl}</span>
                  {this.state.change24h !== 0 && <div className={`tvl-interest ${this.state.change24h < 0 ? `down` : ``}`}><Arrow />{Math.abs(this.state.change24h).toFixed(5)}<span className="sign">%</span></div>}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <MainChart periodChart={this.state.periodChart} getchange24h={this.getchange24h} />
        </section>
        <section className="pt-75">
          <Search />
        </section>
        <section className="pt-60 pb-45">
          <div className="container">
            <AssetSelector />
          </div>
        </section>
      </React.Fragment>
    );
  }

  public componentDidMount(): void {
    this.getVaultBalanceUsd();
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
