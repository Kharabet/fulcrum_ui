import React, { Component } from "react";
import { Line } from "react-chartjs-2";

interface IMainChartProps {
  labels: Array<number>;
  data: Array<number>;
  change24: Array<number>;
  isMainChart: boolean;
}

interface IMainChartState {

}

export class MainChart extends Component<IMainChartProps, IMainChartState> {
  constructor(props: any) {
    super(props);
  }


  public customTooltips = (tooltip: any) => {
    let tooltipEl = document.getElementById('chartjs-tooltip');
    let chartEl = document!.getElementsByClassName('chartjs')[0] as HTMLElement;
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

  optionsTooltips = {
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

  public getColors() {
    let colors: string[] = [];
    this.props.data.forEach((e, i) => {
      colors.push(i % 4 === 0 ? '#E9F4FF' : "rgba(0,0,0,0)");
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
        labels: this.props.labels,
        datasets: [{
          fill: "end",
          data: this.props.data,
          backgroundColor: gradient,
          hoverBackgroundColor: '#276BFB',
          hoverBorderColor: '#276BFB',
          borderColor: this.props.isMainChart ? '#276bfb' : '#edf5ff',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          change24: this.props.change24
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
            fontColor: this.props.isMainChart ? '#a9b5c7' : 'transparent',
            fontSize: 15,
            maxRotation: 0,
            minRotation: 0,
            padding: 15,
            callback: (value: any, index: any, values: any) => {
              return index === 0 || index % 8 !== 0 || index === Object.keys(values).length - 1 ? '' : value;
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
      tooltips: this.props.isMainChart ? this.optionsTooltips : { enabled: false }
    }
    return (
      <React.Fragment>
        <div className={`chartjs ${!this.props.isMainChart ? `chartjs-back` : ``}`}>
          <Line data={chartData} options={options} height={50} />
        </div>
        {this.props.isMainChart &&
          <div id="chartjs-tooltip">
            <table>
              <tbody>
                <tr><td className="chartjs-tooltip-time">1</td></tr>
                <tr><td className="chartjs-tooltip-value">1</td></tr>
                <tr><td className="chartjs-tooltip-change24">1</td></tr>
              </tbody>
            </table>
          </div>
        }
      </React.Fragment>
    );
  }
}
