import React, { Component } from "react";
import { Header } from "../layout/Header";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { BigNumber } from "@0x/utils";
import { ITxRowProps } from "../components/TxRow";
import configProviders from "../config/providers.json";
import { TxGrid } from "../components/TxGrid";
import { LoanGrid } from "../components/LoanGrid";
import { Asset } from "../domain/Asset";
import { Bar } from "react-chartjs-2";
import { Search } from "../components/Search";
import { UnhealthyChart } from "../components/UnhealthyChart";

import { ExplorerProvider } from "../services/ExplorerProvider";
import { ExplorerProviderEvents } from "../services/events/ExplorerProviderEvents";

import { NavService } from "../services/NavService";

import { Loader } from "../components/Loader";
import { IActiveLoanData } from "../domain/IActiveLoanData";
import { ILoanRowProps } from "../components/LoanRow";


interface ILiquidationsPageProps {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}

interface ILiquidationsPageState {
  volume30d: BigNumber;
  transactionsCount30d: number;
  events: ITxRowProps[];
  unhealthyLoans: ILoanRowProps[];
  unhealthyLoansUsd: BigNumber;
  healthyLoansUsd: BigNumber;
  barChartDatasets: { label: Asset, backgroundColor: string, data: ({ x: string, y: number })[] }[]
  isDataLoading: boolean;
}
export class LiquidationsPage extends Component<ILiquidationsPageProps, ILiquidationsPageState> {
  private _isMounted: boolean;

  private readonly assetsShown: { token: Asset, color: string }[];

  constructor(props: any) {
    super(props);
    if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.assetsShown = [
        { token: Asset.ETH, color: "#33dfcc" },
        { token: Asset.KNC, color: "#b79eff" },
        { token: Asset.DAI, color: "#276bfb" },
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      this.assetsShown = [
        { token: Asset.ETH, color: "#33dfcc" },
        { token: Asset.DAI, color: "#276bfb" },
      ];
    } else {
      this.assetsShown = [
        { token: Asset.ETH, color: "#33dfcc" },
        { token: Asset.DAI, color: "#276bfb" },
        { token: Asset.USDC, color: "#276bfb" },
        { token: Asset.USDT, color: "#276bfb" },
        { token: Asset.SUSD, color: "#276bfb" },
        { token: Asset.WBTC, color: "#276bfb" },
        { token: Asset.LINK, color: "#276bfb" },
        { token: Asset.ZRX, color: "#276bfb" },
        { token: Asset.REP, color: "#276bfb" },
        { token: Asset.KNC, color: "#b79eff" }
      ]
    }

    this.state = {
      volume30d: new BigNumber(0),
      transactionsCount30d: 0,
      unhealthyLoansUsd: new BigNumber(0),
      healthyLoansUsd: new BigNumber(0),
      events: [],
      unhealthyLoans: [],
      barChartDatasets: [] as { label: Asset, backgroundColor: string, data: ({ x: string, y: number })[] }[],
      isDataLoading: true
    };

    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public getChartData = (events: { event: LiquidationEvent, repayAmountUsd: BigNumber }[]) => {
    const groupBy = function (xs: ({ event: LiquidationEvent, repayAmountUsd: BigNumber }[]), key: any) {
      return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    const eventsWithDay = events.map((e: { event: LiquidationEvent, repayAmountUsd: BigNumber }) => ({ ...e, day: parseInt((e.event.timeStamp.getTime() / (1000 * 60 * 60 * 24)).toString()) }))
    const eventsWithDayByDay = groupBy(eventsWithDay, "day");
    let datasets: { label: Asset, backgroundColor: string, data: ({ x: string, y: number })[] }[] = this.assetsShown.map((e: { token: Asset, color: string }) =>
      ({
        label: e.token,
        data: [] as ({ x: string, y: number })[],
        backgroundColor: e.color,
      })
    )
    Object.keys(eventsWithDayByDay).forEach((day: string) => {
      for (let j = 0; j < this.assetsShown.length; j++) {
        const token: Asset = this.assetsShown[j].token;
        if (!eventsWithDayByDay[day]) continue;
        const eventsWithDayByAsset: { event: LiquidationEvent, repayAmountUsd: BigNumber }[] = eventsWithDayByDay[day].filter((e: { event: LiquidationEvent, repayAmountUsd: BigNumber }) => e.event.loanToken === token);
        if (eventsWithDayByAsset.length === 0) {
          datasets.find(e => e.label === token)!.data.push({
            //@ts-ignore
            x: new Date(day * 1000 * 60 * 60 * 24)
              .toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              }),
            y: 0
          })
          continue;
        }

        const repayAmountUsd = eventsWithDayByAsset.reduce((a, b) => a.plus(b.repayAmountUsd), new BigNumber(0));

        datasets.find(e => e.label === token)!.data.push({
          //@ts-ignore
          x: new Date(day * 1000 * 60 * 60 * 24)
            .toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }),
          y: repayAmountUsd.dp(4, BigNumber.ROUND_CEIL).toNumber()
        })
      }
    })

    this.setState({
      ...this.state,
      barChartDatasets: datasets
    })
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
        events: []
      });
      return;
    }

    let volume30d = new BigNumber(0);
    let liquidationEventsWithUsd: { event: LiquidationEvent, repayAmountUsd: BigNumber }[] = []
    const liquidationEvents = await ExplorerProvider.Instance.getLiquidationHistory();
    const unhealthyLoansData = await ExplorerProvider.Instance.getBzxLoans(0, 25, true);
    const healthyLoansData = await ExplorerProvider.Instance.getBzxLoans(0, 25, false);
    const unhealthyLoansUsd = unhealthyLoansData.reduce((a, b) => a.plus(b.amountOwedUsd), new BigNumber(0))
    const healthyLoansUsd = healthyLoansData.reduce((a, b) => a.plus(b.amountOwedUsd), new BigNumber(0))
    const liqudiations30d = liquidationEvents.filter((e: LiquidationEvent) => e.timeStamp.getTime() > new Date().setDate(new Date().getDate() - 30))
    const transactionsCount30d = liqudiations30d.length;
    for (let i = 0; i < this.assetsShown.length; i++) {
      const tokenLiqudiations30d = liqudiations30d
        .filter((e: LiquidationEvent) => e.loanToken === this.assetsShown[i].token);
      for (const e of tokenLiqudiations30d) {
        const swapToUsdHistoryRateRequest = await fetch(`https://api.bzx.network/v1/asset-history-price?asset=${e.loanToken.toLowerCase()}&date=${e.timeStamp.getTime()}`);
        const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data;
        const repayAmountUsd = e.repayAmount.div(10 ** 18).times(swapToUsdHistoryRateResponse.swapToUSDPrice);
        volume30d = volume30d.plus(repayAmountUsd);
        liquidationEventsWithUsd.push({ event: e, repayAmountUsd: repayAmountUsd });
      }
    }

    this.getChartData(liquidationEventsWithUsd);
    const unhealthyLoans = unhealthyLoansData.map((e: IActiveLoanData) => ({
      loanId: e.loanData!.loanId,
      payOffAmount: e.maxLiquidatable,
      seizeAmount: e.maxSeizable,
      loanToken: e.loanAsset,
      collateralToken: e.collateralAsset,
      onLiquidationCompleted: this.derivedUpdate.bind(this)
    }))
    await this.setState({
      ...this.state,
      volume30d,
      transactionsCount30d,
      events: ExplorerProvider.Instance.getGridItems(liquidationEvents),
      unhealthyLoans,
      isDataLoading: false,
      unhealthyLoansUsd,
      healthyLoansUsd
    });
  }

  private numberWithCommas = (x: number | string) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
    const getData = (canvas: any) => ({
      datasets: this.state.barChartDatasets
    })

    const canvas = document.createElement('canvas');
    const chartData = getData(canvas);
    const options = {
      scales: {
        xAxes: [{
          display: true,
          position: "bottom",
          stacked: true,
          offset: true,
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              quarter: 'MMM D'
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            source: "data"
          }
        }],
        yAxes: [{
          stacked: true,
          gridLines: {
            drawBorder: false,
            zeroLineWidth: 1,
            zeroLineColor: '#E9F4FF',
            color: '#E9F4FF',
          },
          ticks: {
            display: false
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        custom: this.customTooltips,
        callbacks: {
          label: function (tooltipItems: any, data: any) {
            const bgColor = data.datasets[tooltipItems.datasetIndex].backgroundColor;
            return { value: tooltipItems.yLabel, bgColor: bgColor, label: data.datasets[tooltipItems.datasetIndex].label };
          }
        }
      }
    }
    return (
      <React.Fragment>
        <Header isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} />
        <main className="flex fd-c ac-c jc-c">
          {!ExplorerProvider.Instance.unsupportedNetwork ?
            <React.Fragment>
              {this.state.isDataLoading
                ? <section className="pt-90 pb-45">
                  <div className="container">
                    <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
                  </div>
                </section>
                : <React.Fragment>
                  <section>
                    <div className="container">
                      <div className="flex jc-sb fd-md-c al-c mb-30">
                        <h1>Liquidations</h1>
                        <div className="flex fw-w mt-md-30">
                          <div className="liquidation-data">
                            <div className="liquidation-data-title">30-days Volume</div>
                            <div title={this.state.volume30d.toFixed(18)} className="liquidation-data-value"><span className="sign sign-currency">$</span>{this.numberWithCommas(this.state.volume30d.toFixed(2))}</div>
                          </div>
                          <div className="liquidation-data">
                            <div className="liquidation-data-title">30-days Transactions Count</div>
                            <div className="liquidation-data-value">{this.state.transactionsCount30d}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="wrapper-chartjs-bar">
                        <div id="chartjs-bar">
                          {chartData && <Bar data={chartData} options={options} height={100} />}
                        </div>
                        <div id="chartjs-bar-tooltip"><table></table></div>
                      </div>
                      <div className="flex jc-c labels-container">
                        {this.assetsShown.map((e: { token: Asset, color: string }) =>
                          (<div key={e.color} className="label-chart"><span style={{ backgroundColor: e.color }}></span>{e.token}</div>))
                        }
                      </div>
                    </div>
                  </section>
                  <section className="search-container pt-45">
                    <Search onSearch={this.onSearch} />
                  </section>
                  <section className="pt-90 pt-sm-30">
                    <div className="container">
                      <TxGrid events={this.state.events} />
                    </div>
                  </section>
                  <section className="pt-75">
                    <div className="container">
                      <h2 className="h1 mb-60">Unhealthy Loans</h2>
                      <div className="flex fw-w ai-c">
                        <div className="unhealthy-chart-wrapper">
                          <UnhealthyChart unhealthyLoansUsd={this.state.unhealthyLoansUsd} healthyLoansUsd={this.state.healthyLoansUsd} />
                        </div>
                        <div className="unhealthy-data-wrapper flex fd-c ai-c">
                          <div className="flex w-100 mb-15">
                            <div className="unhealthy">Unhealthy&nbsp;<span className="sign sign-currency">$</span>&nbsp;</div>
                            <span className="unhealthy-value unhealthy-color">{this.state.unhealthyLoansUsd.toFixed(2)}</span>
                          </div>
                          <div className="flex w-100">
                            <div className="healthy">Healthy&nbsp;<span className="sign sign-currency">$</span>&nbsp;</div>
                            <span className="healthy-value healthy-color">{this.state.healthyLoansUsd.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-75">
                        <LoanGrid events={this.state.unhealthyLoans} />
                      </div>
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
  public customTooltips = (tooltip: any) => {
    let tooltipEl = document.getElementById('chartjs-bar-tooltip');
    const paddingX = 25;
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-bar-tooltip';
      tooltipEl.innerHTML = "<div></div>"
      document.body.appendChild(tooltipEl);
    }
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      tooltipEl.style.left = -tooltip.width + 'px';
      return;
    }
    function getBody(bodyItem: any) {
      return bodyItem.lines[0];
    }
    if (tooltip.body) {
      const bodyLines = tooltip.body.map(getBody);
      let innerHtml = `<tbody style="padding: 20px ${paddingX}px;">`;
      bodyLines.forEach(function (body: any) {
        if (body.value === 0) return;
        innerHtml += `<tr><td class="chartjs-bar-tooltip-value"><span class="circle" style="background-color: ${body.bgColor}"></span><span><span class="sign sign-currency">$</span>${body.value}</span></td></tr>`;
      });
      innerHtml += '</tbody>';
      const tableRoot = tooltipEl.querySelector('table') as HTMLElement;
      tableRoot.innerHTML = innerHtml;
    }

    const tableRoot = tooltipEl.querySelector('table tbody') as HTMLElement;

    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = tooltip.caretX - tableRoot.offsetWidth / 2 + 'px';
    tooltipEl.style.top = 0 + 'px';
  }
}
