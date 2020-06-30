import React from "react";
import { Doughnut } from "react-chartjs-2";

interface IUnhealthyChartProps {
}

export const UnhealthyChart = (props: IUnhealthyChartProps) => {
  const getData = (canvas: any) => {
    return {
      labels: [1, 2],
      datasets: [
        {
          data: [100, 5],
          backgroundColor: ['#E7EBF0', '#B79EFF'],
          hoverBackgroundColor: ['#E7EBF0', '#B79EFF'],
          hoverBorderColor: ['#ffffff', '#ffffff'],

        }
      ]
    }
  }
  const canvas = document.createElement('canvas');
  const chartData = getData(canvas);

  const customTooltips = (tooltip: any) => {
    let tooltipEl = document.getElementById('chartjs-doughnut-tooltip');
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
      let innerHtml = `<tbody style="padding: 10px">`;
      bodyLines.forEach(function (body: any) {
        innerHtml += `<tr><td>The size of your trade will move the price by <span class="value">${body}%</span>. If you wish to guarantee a price, edit the exit price to create a limit sell order.</td></tr>`;
      });
      innerHtml += '</tbody>';
      const tableRoot = tooltipEl.querySelector('table') as HTMLElement;
      tableRoot.innerHTML = innerHtml;
    }
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = tooltip.caretX + 'px';
    tooltipEl.style.top = tooltip.caretY - 2 * tooltip.height + 'px';
  }
  const options = {
    cutoutPercentage: 65,
    rotation: 0,
    scales: {
      xAxes: [{
        display: false,
        gridLines: {
          drawBorder: false
        },
      }],
      yAxes: [{
        display: false

      }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
      custom: customTooltips,
      callbacks: {
        label: function (tooltipItems: any, data: any) {
          return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
        }
      }
    }
  }
  return (
    <React.Fragment>
      <section className="wrapper-chartjs-doughnut">
        <Doughnut data={chartData} options={options} height={200} />
        <div id="chartjs-doughnut-tooltip"><table></table></div>
      </section>
    </React.Fragment>
  );
}