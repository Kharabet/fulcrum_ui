import React, { Component } from "react";
import { Line } from "react-chartjs-2";

interface IMainChartProps {
  periodChart: number,
  getchange24h: (change24h: number) => void;
}

interface IMainChartState {
  labels: Array<number>;
  data: Array<number>;
}

export class MainChart extends Component<IMainChartProps, IMainChartState> {
  private apiUrl = "https://api.bzx.network/v1";
  constructor(props: any) {
    super(props);
    this.state = {
      labels: [],
      data: []
    };
  }

  public componentDidMount(): void {
    this.getTvlHistory();
  }

  public componentDidUpdate(prevProps: Readonly<IMainChartProps>, prevState: Readonly<IMainChartState>, snapshot?: any): void {
    if (this.props.periodChart !== prevProps.periodChart) {
      this.getTvlHistory();
    }
  }



  public getTvlHistory = async () => {
    const startData = new Date().setDate(new Date().getDate() - this.props.periodChart);
    const endData = new Date().getTime();
    const pointsNumber = 30;
    const requestUrl = `${this.apiUrl}/tvl-history?start_date=${startData}&end_date=${endData}&points_number=${pointsNumber}`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    const labels: any = [];
    const data: any = [];
    const period = this.props.periodChart;
    if (responseJson.success) {
      responseJson.data.forEach(function (item: any) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        (period === 1)
          ? labels.push(`${new Date(item["timestamp"]).getHours() % 12}:${new Date(item["timestamp"]).getMinutes() < 10 ? `0${new Date(item["timestamp"]).getMinutes()}` : new Date(item["timestamp"]).getMinutes()}`)
          : labels.push(`${months[new Date(item["timestamp"]).getMonth()]} ${new Date(item["timestamp"]).getDate()}`);
        data.push(item["tvl"]);
      });
      this.props.getchange24h(responseJson.data[Object.keys(responseJson.data).length - 1].change24h);
    } else {
      console.error(responseJson.message)
    }
    await this.setState({ ...this.state, labels: labels, data: data });
  }

  public render() {

    const getData = (canvas: any) => {
      const ctx: any = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, '#edf5ff');
      gradient.addColorStop(1, '#dcebff');

      return {
        labels: this.state.labels,
        datasets: [{
          fill: "end",
          data: this.state.data,
          backgroundColor: gradient,
          borderColor: '#276BFB'
        }]
      }
    }
    const canvas = document.createElement('canvas');
    const chartData = getData(canvas);
    const options = {
      scaleShowLabels: false,
      scales: {
        xAxes: [{
          ticks: {
            padding: 15,
            callback: (value: any, index: any, values: any) => {
              return index === 0 || index === Object.keys(values).length - 1 ? '' : value;
            }
          },
          gridLines: {
            drawBorder: false,
            zeroLineWidth: 1,
            zeroLineColor: '#E9F4FF',
            color: '#E9F4FF',
            
          },
        }],
        yAxes: [{
          display: false,
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
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
        position: 'nearest',
        callbacks: {
          label: function (tooltipItems: any) {
            if (tooltipItems.yLabel > 100000)
              return `$${(tooltipItems.yLabel / 1000000).toFixed(3)}m`;
            if (tooltipItems.yLabel > 100)
              return `$${(tooltipItems.yLabel / 1000).toFixed(3)}k`;
            return `$${(tooltipItems.yLabel).toFixed(3)}`;
          }
        }
      }
    }
    return (
      <React.Fragment>
        <Line ref="chart" data={chartData} options={options} height={50} />
      </React.Fragment>
    );
  }
}
