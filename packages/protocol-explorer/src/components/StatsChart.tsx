import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { GroupButton } from "./GroupButton";
import { Line } from "react-chartjs-2";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";

interface IStatsChartProps {
  isMobileMedia: boolean;
}

interface IStatsChartState {
  asset: Asset
  periodChart: number;
  labels: Array<number>;
  utilization: Array<number>;
  apr: Array<number>;
  tvl: Array<number>;
  activeLabel: string;  
}

export class StatsChart extends Component<IStatsChartProps, IStatsChartState> {
  private apiUrl = "https://api.bzx.network/v1";
  private assetsShown: Asset[];
  constructor(props: any) {
    super(props);
    this.state = {
      asset: Asset.UNKNOWN,
      activeLabel:'',
      periodChart: 1,
      labels: [],
      tvl: [],
      apr: [],
      utilization: []
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
    const pointsNumber = 80;
    const requestUrl = `${this.apiUrl}/asset-stats-history?asset=${this.state.asset.toLowerCase()}&start_date=${startData}&end_date=${endData}&points_number=${pointsNumber}`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();

    let labels: any = [];
    let tvl: any = [];
    let apr: any = [];
    let utilization: any = [];
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
      });
    } else {
      console.error(responseJson.message)
    }
    await this.setState({ ...this.state, tvl: tvl, apr: apr, utilization: utilization, labels: labels })
  }

  public getColors(data: number[]) {
    let colors: string[] = [];

    data.forEach((e, i) => {
      colors.push(i % 4 === 2 ? '#E9F4FF' : "#fff");
    });

    return colors;
  }


  public render() {
    const asset = AssetsDictionary.assets.get(this.state.asset) as AssetDetails;

    const getData = (canvas: any) => {
      const ctx: any = canvas.getContext("2d");

      return {
        labels: this.state.labels,
        datasets: [{
          label: 'TVL',
          yAxisID: 'A',
          data: this.state.tvl,
          backgroundColor: "transparent",
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          borderColor: '#276BFB',
          borderWidth: 2,
          pointRadius: 12,
        },
        {
          label: 'Supply APR',
          data: this.state.apr,
          yAxisID: 'B',
          backgroundColor: "transparent",
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          borderColor: '#33DFCC',
          borderWidth: 2,
          pointRadius: 12
        },
        {
          label: 'Utilization',
          yAxisID: 'C',
          data: this.state.utilization,
          backgroundColor: "transparent",
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          borderColor: '#B79EFF',
          borderWidth: 2,
          pointRadius: 12
        }]
      }
    }
    const canvas = document.createElement('canvas');
    const chartData = getData(canvas);
    const deviation = (Math.max(...this.state.tvl) - Math.min(...this.state.tvl)) / 50;
    const options = {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontColor: "#A9B5C7",
            maxRotation: 0,
            minRotation: 0,
            padding: this.props.isMobileMedia? 0:70,
            callback: (value: any, index: any, values: any) => {
             return this.props.isMobileMedia ? (index === 0 || index % 16 !== 0 || index === Object.keys(values).length - 1 ? '' : value) : (index === 0 || index % 4 !== 0 || index === Object.keys(values).length - 1 ? '' : value);   }
          },
          gridLines: {
            drawBorder: false,
            zeroLineWidth: 1,
            zeroLineColor: '#fff',
            color: this.getColors(this.state.utilization)
          },
        }],
        yAxes: [{
          id: 'A',
          ticks: {
            drawTicks: false,
          
            max: Math.max(...this.state.tvl) + deviation,
            min: Math.min(...this.state.tvl) - deviation
          },
          display: false,
        },
        {
          id: 'B',
          ticks: {
            max: 102,
            min: -2,
            drawTicks: false,
          },

          display: false,
        },
        {
          id: 'C',
          ticks: {
            max: 102,
            min: -2,
            drawTicks: false,
          },

          display: false,
        }]
      },
      legend: {
        display: false,
      },
      layout: {
        padding: {
          top: this.props.isMobileMedia? 0:50,
          bottom: 0
        }
      },
      tooltips: {
        enabled: false,
        mode: 'nearest',
        custom: this.customTooltips,
        displayColors: true,
        callbacks: {

          label: function (tooltipItems: any, data: any) {
            let labels: any = [];
            const activeYScale = '_active' in this ? this['_active'][0]['_yScale']['id'] : '';
           
            data.datasets.forEach((item: any) => {

              labels.push({ isActive: item.yAxisID === activeYScale, label: item.label, value: item.data[tooltipItems.index], currency: item.label === "TVL" ? true : false, borderColor: item.borderColor });
              
            });
            return { data: labels };
          }
        }
      },
      hover: {
        mode: 'nearest',
      },
      elements: {
        point: {
          //radius: 0
        }
      }
    }
    return (
      <React.Fragment>
        <div className="container">
          <div className="flex fw-w fd-sm-c jc-sb ai-c mb-30">
            <div className="flex ai-c as-sm-fs ">
              <span className="flex mr-15">
                {asset.logoSvg.render()}
              </span>
              <h1>{this.state.asset.toUpperCase()} Stats</h1>
            </div>
            <GroupButton setPeriodChart={this.setPeriodChart} />
          </div>
        </div>
        <div className="wrapper-chartjs-token">
          <div id="chartjs">
            <Line ref="chart" data={chartData} options={options} height={this.props.isMobileMedia?300:110} />
          </div>
          <div id="chartjs-tooltip" className="chartjs-tooltip-token">
            <table>
              <tbody>
                <tr className="chartjs-tooltip-time"><td>1</td></tr>
                <tr className="chartjs-tooltip-value"><td>1</td></tr>
                <tr className="chartjs-tooltip-value"><td>1</td></tr>
                <tr className="chartjs-tooltip-value"><td>1</td></tr>
              </tbody>
            </table></div>
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
    let spacingChart = this.props.isMobileMedia ? 15 : 55;
  
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
      const title = tooltip.title[0] || 0;
      const body = tooltip.body.map(getBody)[0];
      let activeLabel = '';
     
      let innerHtml = `<tr class="chartjs-tooltip-time"><th><span class="line" style="background-color: ${tooltip.labelColors[0].borderColor}"></span><span>${title}</span></th></tr>`;

      body.data.forEach((item: any) => {
        if(item.isActive) activeLabel = " " + item.label;
        innerHtml += `<tr class="chartjs-tooltip-value ${item.isActive? `active ${item.label}`:``}"><td><label>${item.label}</label><span ${item.isActive ? ``:`style="color:${item.borderColor}"`}>${item.currency ? `<span class="sign sign-currency" >$</span>` : ``}${item.value.toFixed(3)}${!item.currency ? `<span class="sign sign-currency">%</span>` : ``}</span></td></tr>`;
      });

      innerHtml += `</tbody>`;

      innerHtml = `<tbody class="${heighttooltipEl + spacingChart > tooltip.caretY ? `bottom` : `top`} ${widthChart - tooltip.caretX < widthTooltipEl ? `right` : `left`}${activeLabel}">` + innerHtml;

      const tableRoot = tooltipEl.querySelector('table') as HTMLElement;
      tableRoot.innerHTML = innerHtml;
    }
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = (widthChart - tooltip.caretX < widthTooltipEl) ? tooltip.caretX - widthTooltipEl + 5 + 'px' : tooltip.caretX - 7 + 'px';
    tooltipEl.style.top = (heighttooltipEl + spacingChart < tooltip.caretY) ? tooltip.caretY - heighttooltipEl - spacingChart + 'px' : tooltip.caretY + 35 + 'px';
  }
}
