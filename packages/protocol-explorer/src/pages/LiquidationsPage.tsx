import React, { Component } from "react";
import { Header } from "../layout/Header";
//import { ContractsSource } from "../services/ContractsSource";
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


interface ILiquidationsPageProps {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}

interface ILiquidationsPageState {
  events: ITxRowProps[];
  daiDataset: ({ x: string, y: number })[];
  ethDataset: ({ x: string, y: number })[];
  usdcDataset: ({ x: string, y: number })[];
}
export class LiquidationsPage extends Component<ILiquidationsPageProps, ILiquidationsPageState> {
  private _isMounted: boolean;

  constructor(props: any) {
    super(props);
    this.state = {
      events: [],
      daiDataset: [],
      ethDataset: [],
      usdcDataset: [],
    };

    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderAvailable, this.onProviderAvailable);
    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  getLiquidationHistory = async (): Promise<LiquidationEvent[]> => {
    let result: LiquidationEvent[] = [];
    const bzxContractAddress = ExplorerProvider.Instance.contractsSource!.getiBZxAddress()
    const etherscanApiKey = configProviders.Etherscan_Api;
    let etherscanApiUrl = `https://api-kovan.etherscan.io/api?module=logs&action=getLogs&fromBlock=10000000&toBlock=latest&address=${bzxContractAddress}&topic0=${LiquidationEvent.topic0}&apikey=${etherscanApiKey}`
    const tradeEventResponse = await fetch(etherscanApiUrl);
    const tradeEventResponseJson = await tradeEventResponse.json();
    if (tradeEventResponseJson.status !== "1") return result;
    const events = tradeEventResponseJson.result;
    result = events.reverse().map((event: any) => {
      const userAddress = event.topics[1].replace("0x000000000000000000000000", "0x");
      const liquidatorAddress = event.topics[2].replace("0x000000000000000000000000", "0x");
      const loanId = event.topics[3];
      const data = event.data.replace("0x", "");
      const dataSegments = data.match(/.{1,64}/g) //split data into 32 byte segments
      if (!dataSegments) return result;
      const lender = dataSegments[0].replace("000000000000000000000000", "0x");

      const baseTokenAddress = dataSegments[1].replace("000000000000000000000000", "0x");
      const quoteTokenAddress = dataSegments[2].replace("000000000000000000000000", "0x");
      const baseToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(baseTokenAddress);
      const quoteToken = ExplorerProvider.Instance.contractsSource!.getAssetFromAddress(quoteTokenAddress);
      const repayAmount = new BigNumber(parseInt(dataSegments[3], 16));
      const collateralWithdrawAmount = new BigNumber(parseInt(dataSegments[4], 16));
      const collateralToLoanRate = new BigNumber(parseInt(dataSegments[5], 16));
      const currentMargin = new BigNumber(parseInt(dataSegments[6], 16));
      const timeStamp = new Date(parseInt(event.timeStamp, 16) * 1000);
      const txHash = event.transactionHash;
      return new LiquidationEvent(
        userAddress,
        liquidatorAddress,
        loanId,
        lender,
        baseToken,
        quoteToken,
        repayAmount,
        collateralWithdrawAmount,
        collateralToLoanRate,
        currentMargin,
        timeStamp,
        txHash
      )

    })
    return result.filter(e => e)
  }


  public getGridItems = (events: LiquidationEvent[]): ITxRowProps[] => {
    if (events.length === 0) return [];
    const etherscanUrl = ExplorerProvider.getWeb3ProviderSettings(ExplorerProvider.Instance.contractsSource!.networkId).etherscanURL;
    return events.map(e => {
      return {
        hash: e.txHash,
        etherscanTxUrl: `${etherscanUrl}tx/${e.txHash}`,
        age: e.timeStamp,
        account: e.user,
        etherscanAddressUrl: `${etherscanUrl}/address/${e.user}`,
        quantity: e.repayAmount.div(10 ** 18),
        action: "Liquidation"
      }
    });
  }

  private groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  public getChartData = (events: LiquidationEvent[]) => {
    const eventsWithDay = events.map((e: LiquidationEvent) => ({ ...e, day: e.timeStamp.getTime() / (1000 * 60 * 60 * 24) }))
    const groupedByDay = this.groupBy(eventsWithDay, "day");

    const usdcDataset = eventsWithDay.filter(e => e.loanToken === Asset.USDC).map(e => {
      return {
        x: e.timeStamp.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }),
        y: e.repayAmount.div(10 ** 18).dp(4, BigNumber.ROUND_CEIL).toNumber()
      }
    })
    const ethDataset = eventsWithDay.filter(e => e.loanToken === Asset.ETH).map(e => {
      return {
        x: e.timeStamp.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }),
        y: e.repayAmount.div(10 ** 18).dp(4, BigNumber.ROUND_CEIL).toNumber()
      }
    })
    const daiDataset = eventsWithDay.filter(e => e.loanToken === Asset.DAI).map(e => {
      return {
        x: e.timeStamp.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }),
        y: e.repayAmount.div(10 ** 18).dp(4, BigNumber.ROUND_CEIL).toNumber()
      }

    })
    this.setState({
      ...this.state,
      daiDataset,
      ethDataset,
      usdcDataset
    })
  }
  private async derivedUpdate() {
    const provider = ExplorerProvider.getLocalstorageItem('providerType');
    if (!ExplorerProvider.Instance.web3Wrapper && (!provider || provider === "None")) {
      this.props.doNetworkConnect();
    }

    if (ExplorerProvider.Instance.contractsSource) {
    const liquidationEvents = await this.getLiquidationHistory();
    this.getChartData(liquidationEvents);

    await this.setState({
      ...this.state,
      events: this.getGridItems(liquidationEvents)
    });
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
    const getData = (canvas: any) => {
      const ctx: any = canvas.getContext("2d");
      return {
        labels: [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7],
        datasets: [
          {
            label: 'Usdc',
            data: [15, 5, 9, 50, 14, 60, 70, 10, 20, 30, 40, 50, 60, 15, 5, 9, 50, 15, 5, 9, 50, 14, 60, 70, 14, 60, 70, 30],
            //data: this.state.usdcDataset,
            backgroundColor: '#B79EFF',
          },
          {
            label: 'Dai',
            data: [10, 20, 30, 40, 50, 60, 70, 15, 5, 9, 15, 5, 9, 50, 14, 60, 70, 50, 14, 60, 70, 14, 60, 70, 10, 20, 30, 20],
            //data: this.state.daiDataset,
            backgroundColor: '#276BFB',
          },
          {
            label: 'Eth',
            data: [15, 5, 9, 50, 14, 60, 70, 10, 20, 30, 40, 50, 60, 70, 15, 5, 9, 50, 14, 60, 70, 15, 5, 9, 50, 14, 60, 10],
            //data: this.state.ethDataset,
            backgroundColor: '#33DFCC',
          },
        ]
      }
    }
    const canvas = document.createElement('canvas');
    const chartData = getData(canvas);
    const options = {
      scales: {
        xAxes: [{
          display: false,
          stacked: true,
          /*type: 'time',
          time: {
            unit: 'month'
          },*/
          gridLines: {
            drawBorder: false
          },
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
            return { label: tooltipItems.yLabel, bgColor: bgColor };
          }
        }
      }
    }
    return (
      <React.Fragment>
        <Header isMobileMedia={this.props.isMobileMedia} doNetworkConnect={this.props.doNetworkConnect} />
          <section>
            <div className="container">
              <div className="flex jc-sb al-c mb-25">
                <h1>Liquidations</h1>
                <div className="flex">
                  <div className="liquidation-data">
                    <div className="liquidation-data-title">30-days Volume</div>
                    <div className="liquidation-data-value"><span className="sign sign-currency">$</span>554,456,945.09</div>
                  </div>
                  <div className="liquidation-data">
                    <div className="liquidation-data-title">30-days Transactions Count</div>
                    <div className="liquidation-data-value">100,500</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="wrapper-chartjs-bar">
                <div id="chartjs-bar">
                  <Bar data={chartData} options={options} height={100} />
                </div>
                <div id="chartjs-bar-tooltip"><table></table></div>
              </div>
              <div className="flex jc-c labels-container">
                <div className="label-chart"><span className="bg-green"></span>ETH</div>
                <div className="label-chart"><span className="bg-primary"></span>DAI</div>
                <div className="label-chart"><span className="bg-secondary"></span>USDC</div>
              </div>
            </div>
          </section>
        <section className="pt-45">
          <Search onSearch={this.onSearch} />
        </section>
        <section className="pt-90">
          <div className="container">
            <TxGrid events={this.state.events} />
          </div>
        </section>
        <section className="pt-75">
          <div className="container">
            <h2 className="h1 mb-60">Unhealthy Loans</h2>
            <div className="flex ai-c">
              <div className="w-45">
                <UnhealthyChart />
              </div>
              <div className="w-55 flex fd-c ai-c">
                <div className="flex w-100 mb-15">
                  <div className="unhealthy">Unhealthy&nbsp;<span className="sign sign-currency">$</span>&nbsp;</div>
                  <span className="unhealthy-value unhealthy-color">0.1</span>
                </div>
                <div className="flex w-100">
                  <div className="healthy">Healthy&nbsp;<span className="sign sign-currency">$</span>&nbsp;</div>
                  <span className="healthy-value healthy-color">100m</span>
                </div>
              </div>
            </div>
            <div className="pt-75">
              <LoanGrid events={this.state.events} />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
  public customTooltips = (tooltip: any) => {
    let tooltipEl = document.getElementById('chartjs-bar-tooltip');
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
      let innerHtml = `<tbody style="padding: 20px 25px">`;
      bodyLines.forEach(function (body: any) {
        innerHtml += `<tr><td class="chartjs-bar-tooltip-value"><span class="circle" style="background-color: ${body.bgColor}"></span><span><span class="sign sign-currency">$</span>${body.label}</span></td></tr>`;
      });
      innerHtml += '</tbody>';
      const tableRoot = tooltipEl.querySelector('table') as HTMLElement;
      tableRoot.innerHTML = innerHtml;
    }
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = tooltip.caretX - tooltip.width / 2 + 'px';
    tooltipEl.style.top = 0 + 'px';
  }

}
