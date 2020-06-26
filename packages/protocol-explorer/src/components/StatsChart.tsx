import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { GroupButton } from "./GroupButton";
import { Line } from "react-chartjs-2";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";

interface IStatsChartProps {
}

interface IStatsChartState {
  asset: Asset
  periodChart: number;
  labels: Array<number>;
  utilization: Array<number>;
  apr: Array<number>;
  tvl: Array<number>;
  aprChange24: Array<number>;
}

export class StatsChart extends Component<IStatsChartProps, IStatsChartState> {
  private apiUrl = "https://api.bzx.network/v1";
  private assetsShown: Asset[];
  constructor(props: any) {
    super(props);
    this.state = {
      asset: Asset.UNKNOWN,
      periodChart: 1,
      labels: [],
      tvl: [],
      apr: [],
      utilization: [],
      aprChange24: [],
    };
    this.assetsShown = [
      Asset.ETH,
      Asset.SAI,
      Asset.DAI,
      Asset.USDC,
      Asset.USDT,
      Asset.SUSD,
      Asset.WBTC,
      Asset.LINK,
      Asset.ZRX,
      Asset.REP,
      Asset.KNC
    ]
  }
  public componentWillMount(): void {
    const pathname = window.location.pathname;
    const assetString = pathname.replace('/stats/', '');
    const asset = this.assetsShown.filter((item) => {
      return item === assetString.toUpperCase();
    });
    this.setState({ ...this.state, asset: asset[0] })
  }
  public componentDidMount(): void {
    this.getAssetStatsHistory();
  }

  public componentDidUpdate(prevProps: Readonly<IStatsChartProps>, prevState: Readonly<IStatsChartState>, snapshot?: any): void {
    if (this.state.periodChart !== prevState.periodChart) {
      this.getAssetStatsHistory();
    }
  }

  public getAssetStatsHistory = async () => {
    const startData = new Date().setDate(new Date().getDate() - this.state.periodChart);
    const endData = new Date().getTime();
    const pointsNumber = 20;
    const requestUrl = `${this.apiUrl}/asset-stats-history?asset=${this.state.asset.toLowerCase()}&start_date=${startData}&end_date=${endData}&points_number=${pointsNumber}`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();

    let labels: any = [];
    let tvl: any = [];
    let apr: any = [];
    let utilization: any = [];
    let aprChange24: any = [];
    const period = this.state.periodChart;
    if (responseJson.success) {
      responseJson.data.forEach(function (item: any) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        (period === 1)
          ? labels.push(`${new Date(item["timestamp"]).getHours() % 12}:${new Date(item["timestamp"]).getMinutes() < 10 ? `0${new Date(item["timestamp"]).getMinutes()}` : new Date(item["timestamp"]).getMinutes()}`)
          : labels.push(`${months[new Date(item["timestamp"]).getMonth()]} ${new Date(item["timestamp"]).getDate()}`);
        tvl.push(+item["tvl"]);
        apr.push(+item["supplyInterestRate"]);
        utilization.push(+item["utilization"]);
        aprChange24.push(+item["tvlChange24h"]);        
      });
    } else {
      console.error(responseJson.message)
    }
    await this.setState({ ...this.state, tvl: tvl, apr: apr, utilization: utilization, labels: labels, aprChange24: aprChange24 })
  }

  public render() {
    const asset = AssetsDictionary.assets.get(this.state.asset) as AssetDetails;

    const getData = (canvas: any) => {
      const ctx: any = canvas.getContext("2d");

      return {
        labels: this.state.labels,
        aprChange24: this.state.aprChange24,
        datasets: [{
          label: 'TVL',
          yAxisID: 'A',
          data: this.state.tvl,
          backgroundColor: "transparent",
          pointBackgroundColor: '#276BFB',
          borderColor: '#276BFB',
          borderWidth: 2
        },
        {
          label: 'Supply APR, %',
          data: this.state.apr,
          yAxisID: 'B',
          backgroundColor: "transparent",
          pointBackgroundColor: '#33DFCC',
          borderColor: '#33DFCC',
          borderWidth: 2
        },
        {
          label: 'Utilization, %',
          yAxisID: 'B',
          data: this.state.utilization,
          backgroundColor: "transparent",
          pointBackgroundColor: '#B79EFF',
          borderColor: '#B79EFF',
          borderWidth: 2
        }]
      }
    }
    const canvas = document.createElement('canvas');
    const chartData = getData(canvas);
    const options = {
      scales: {
        xAxes: [{
          ticks: {
            padding: 15
          },
          gridLines: {
            drawBorder: false,
            zeroLineWidth: 1,
            zeroLineColor: '#E9F4FF',
            color: '#E9F4FF',
            
          },
        }],
        yAxes: [{
          id: 'A',
          ticks: {
            drawTicks: false,
            max: Math.max(...this.state.tvl),
            min: Math.min(...this.state.tvl),
          },
          display: false,
        },
        {
          id: 'B',
          ticks: {
            max: 101,
            min: -1,
            drawTicks: false,
          },

          display: false,
        }]
      },
      legend: {
        display: false,
        //usePointStyle: true
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltips: {
        enabled: false,
        mode: 'point',
        custom: this.customTooltips,
        callbacks: {
          label: function (tooltipItems: any, data: any) {
            const change24 = data.aprChange24[tooltipItems.index];
            const currency = data.datasets[tooltipItems.datasetIndex].label === "TVL" ? true : false;
            if (tooltipItems.yLabel > 100000)
              return { data: `${(tooltipItems.yLabel / 1000000).toFixed(3)}m`, change24: change24, currency: currency };
            if (tooltipItems.yLabel > 100)
              return { data: `${(tooltipItems.yLabel / 1000).toFixed(3)}k`, change24: change24, currency: currency };
            return { data: `${tooltipItems.yLabel.toFixed(3)}`, change24: change24, currency: currency };
          }
        }
      },
      elements: {
        point: {
          radius: 0
        }
      },
      hover: {
        mode: 'point',
      },
    }
    return (
      <React.Fragment>
        <div className="flex jc-sb ai-c mb-25">
          <div className="flex ai-c">
            <span className="mr-15">
              {asset.logoSvg.render()}
            </span>
            <h1>{this.state.asset.toUpperCase()} Stats</h1>
          </div>
          <GroupButton setPeriodChart={this.setPeriodChart} />
        </div>
        <div className="wrapper-chart">
          <div id="chartjs">
            <Line ref="chart" data={chartData} options={options} height={80} />
          </div>
          <div id="chartjs-tooltip"><table></table></div>
        </div>
      </React.Fragment>
    );
  }

  public setPeriodChart = (period: number) => {
    this.setState({ ...this.state, periodChart: period })
  }

  public customTooltips = (tooltip: any) => {
    let tooltipEl = document.getElementById('chartjs-tooltip');
    let chartEl = document.getElementById('chartjs');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = "<div></div>"
      document.body.appendChild(tooltipEl);
    }
    const heighttooltipEl = tooltipEl.offsetHeight;
    const widthTooltipEl = tooltipEl.offsetWidth;
    const widthChart = chartEl!.offsetWidth;
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      tooltipEl.style.left = -widthTooltipEl + 'px';
      return;
    }
    function getBody(bodyItem: any) {
      return bodyItem.lines[0];
    }
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const dataLines = tooltip.body.map(getBody);
      let innerHtml = `<tbody class="${heighttooltipEl + 55 > tooltip.caretY ? `bottom` : ``} ${widthChart - tooltip.caretX < widthTooltipEl ? `right` : `left`}">`;
      titleLines.forEach(function (title: number) {
        innerHtml += `<tr class="chartjs-tooltip-time"><th><span>${title}</span></th></tr>`;
      });
      dataLines.forEach(function (body: any, index: number) {
        innerHtml += `<tr  class="chartjs-tooltip-value"><td><span>${body.currency ? `<span class="sign sign-currency">$</span>` : ``}${body.data}</span>${!body.currency ? `<span class="sign sign-currency">%</span>` : ``}</td></tr><tr class="chartjs-tooltip-change24 ${body.change24 < 0 ? `down` : `up`} ${heighttooltipEl + 55 < tooltip.caretY ? `bottom` : `top`} ${widthChart - tooltip.caretX < widthTooltipEl ? `right` : `left`}"><td><span>${Math.abs(body.change24).toFixed(4)}%</span></td></tr>`;
      });
      innerHtml += `</tbody>`;
      const tableRoot = tooltipEl.querySelector('table') as HTMLElement;
      tableRoot.innerHTML = innerHtml;
    }
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = (widthChart - tooltip.caretX < widthTooltipEl) ? tooltip.caretX - widthTooltipEl + 5 + 'px' : tooltip.caretX - 7 + 'px';
    tooltipEl.style.top = (heighttooltipEl + 55 < tooltip.caretY) ? tooltip.caretY - heighttooltipEl - 55 + 'px' : tooltip.caretY + 55 + 'px';
  }
}
