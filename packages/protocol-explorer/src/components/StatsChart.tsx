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
    const pointsNumber = 20;
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
          pointBackgroundColor: '#276BFB',
          borderColor: '#276BFB',
          borderWidth: 2,
        },
        {
          label: 'Supply APR, %',
          data: this.state.apr,
          yAxisID: 'B',
          backgroundColor: "transparent",
          pointBackgroundColor: '#33DFCC',
          borderColor: '#33DFCC',
        },
        {
          label: 'Utilization, %',
          yAxisID: 'B',
          data: this.state.utilization,
          backgroundColor: "transparent",
          pointBackgroundColor: '#B79EFF',
          borderColor: '#B79EFF',
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
        }
      },
      tooltips: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        displayColors: false,
        bodyFontFamily: 'Muli',
        bodyFontSize: 30,
        bodyFontColor: '#283049',
        bodyFontStyle: 'bold',
        titleFontFamily: 'Muli',
        titleFontSize: 14,
        titleFontColor: '#8992A4',
        titleFontStyle: 'black',
        titleMarginBottom: 10,
        mode: 'nearest',
        position: 'nearest',
        intersect: true,
        callbacks: {
          label: function (tooltipItems: any, data: any) {
            var label = data.datasets[tooltipItems.datasetIndex].label || '';
            var number;
            if (tooltipItems.yLabel > 1000000) {
              number = `${(tooltipItems.yLabel / 1000000).toFixed(3)}m`;
            } else if (tooltipItems.yLabel > 1000) {
              number = `${(tooltipItems.yLabel / 1000).toFixed(3)}k`;
            } else {
              number = `${(tooltipItems.yLabel).toFixed(3)} `;
            }
            return (label === 'TVL') ? `$${number}` : `${number}%`;
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
        <Line ref="chart" data={chartData} options={options} height={70} />
      </React.Fragment>
    );
  }

  public setPeriodChart = (period: number) => {
    this.setState({ ...this.state, periodChart: period })
  }
}
