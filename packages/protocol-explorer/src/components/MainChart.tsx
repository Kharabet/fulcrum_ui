import React, { Component } from "react";
import { Line } from "react-chartjs-2";

interface IMainChartProps {
  periodChart: number,
  getchange24h: (change24h: number) => void;
}

interface IMainChartState {
  labels: Array<number>;
  data: Array<number>;
  change24: Array<number>
}

export class MainChart extends Component<IMainChartProps, IMainChartState> {
  private apiUrl = "https://api.bzx.network/v1";
  constructor(props: any) {
    super(props);
    this.state = {
      labels: [],
      data: [],
      change24: []
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
      return bodyItem.lines[0].data;
    }
    function getFooter(bodyItem: any) {
      return bodyItem.lines[0].change24;
    }
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(getBody);
      const footerLines = tooltip.body.map(getFooter);
      let innerHtml = `<tbody class="${heighttooltipEl + 55 > tooltip.caretY ? `bottom` : ``} ${widthChart - tooltip.caretX < widthTooltipEl ? `right` : `left`}">`;//'<thead>';
      titleLines.forEach(function (title: number) {
        innerHtml += '<tr><th class="chartjs-tooltip-time"><span>' + title + '</span></th></tr>';
      });
      bodyLines.forEach(function (body: number) {
        innerHtml += '<tr><td class="chartjs-tooltip-value"><span><span class="sign sign-currency">$</span>' + body + '</span></td></tr>';
      });
      footerLines.forEach(function (footer: number) {
        innerHtml += `<tr><td class="chartjs-tooltip-change24 ${footer < 0 ? `down` : `up`} ${heighttooltipEl + 55 < tooltip.caretY ? `bottom` : `top`} ${widthChart - tooltip.caretX < widthTooltipEl ? `right` : `left`}"><span>${Math.abs(footer).toFixed(4)}%</span></td></tr>`
      });
      innerHtml += '</tbody>';
      const tableRoot = tooltipEl.querySelector('table') as HTMLElement;
      tableRoot.innerHTML = innerHtml;
    }
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = (widthChart - tooltip.caretX < widthTooltipEl) ? tooltip.caretX - widthTooltipEl - 5 + 'px' : tooltip.caretX - 17 + 'px';
    tooltipEl.style.top = (heighttooltipEl + 55 < tooltip.caretY) ? tooltip.caretY - heighttooltipEl - 55 + 'px' : tooltip.caretY + 55 + 'px';
  }
  public getTvlHistory = async () => {
    const startData = new Date().setDate(new Date().getDate() - this.props.periodChart);
    const endData = new Date().getTime();
    const pointsNumber = 80;
    const requestUrl = `${this.apiUrl}/tvl-history?start_date=${startData}&end_date=${endData}&points_number=${pointsNumber}`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    const labels: any = [];
    const data: any = [];
    const change24: any = [];
    const period = this.props.periodChart;
    if (responseJson.success) {
      responseJson.data.forEach(function (item: any) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        (period === 1)
          ? labels.push(`${new Date(item["timestamp"]).getHours() % 12}:${new Date(item["timestamp"]).getMinutes() < 10 ? `0${new Date(item["timestamp"]).getMinutes()}` : new Date(item["timestamp"]).getMinutes()}`)
          : labels.push(`${months[new Date(item["timestamp"]).getMonth()]} ${new Date(item["timestamp"]).getDate()}`);
        data.push(item["tvl"]);
        change24.push(item["change24h"]);
      });
      this.props.getchange24h(responseJson.data[Object.keys(responseJson.data).length - 1].change24h);
    } else {
      console.error(responseJson.message)
    }
    await this.setState({ ...this.state, labels: labels, data: data, change24: change24, });
  }

  public getColors() {
    let colors: string[] = [];

    this.state.data.forEach((e, i) => {
      colors.push(i % 2 === 0 ? '#E9F4FF' : "#fff");
    });

    return colors;
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
          hoverBackgroundColor: '#276BFB',
          hoverBorderColor: '#276BFB',
          borderColor: '#276BFB',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          change24: this.state.change24
        },
        ]
      }
    }
    const canvas = document.createElement('canvas');
    const chartData = getData(canvas);
    const options = {
      responsive: true,
      scaleShowLabels: false,
      scales: {
        xAxes: [{
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            padding: 15,
            callback: (value: any, index: any, values: any) => {
              return index === 0 || index % 4 !== 0 || index === Object.keys(values).length - 1 ? '' : value;
            }
          },
          gridLines: {
            drawBorder: false,
            color: this.getColors(),
          }
        }
        ],
        yAxes: [{
          display: false,
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          //radius: 0
        }
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        position: 'nearest',
        intersect: false,
        custom: this.customTooltips,
        callbacks: {
          label: function (tooltipItems: any, data: any) {
            const change24 = data.datasets[tooltipItems.datasetIndex].change24[tooltipItems.index];
            if (tooltipItems.yLabel > 100000)
              return { "data": `${(tooltipItems.yLabel / 1000000).toFixed(3)}m`, "change24": change24 };
            if (tooltipItems.yLabel > 100)
              return { "data": `${(tooltipItems.yLabel / 1000).toFixed(3)}k`, "change24": change24 };
            return { "data": `${(tooltipItems.yLabel).toFixed(3)}`, "change24": change24 };
          }
        }
      }
    }
    return (
      <React.Fragment>
        <div id="chartjs">
          <Line data={chartData} options={options} height={50} />
        </div>
        <div id="chartjs-tooltip">
          <table>
            <tbody>
              <tr><td className="chartjs-tooltip-time">1</td></tr>
              <tr><td className="chartjs-tooltip-value">1</td></tr>
              <tr><td className="chartjs-tooltip-change24">1</td></tr>
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
