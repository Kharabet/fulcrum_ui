import React from "react";
import { Doughnut } from "react-chartjs-2";
import { BigNumber } from "@0x/utils";

interface IUnhealthyChartProps {
  unhealthyLoansUsd: BigNumber,
  healthyLoansUsd: BigNumber
}

export const UnhealthyChart = (props: IUnhealthyChartProps) => {
  const getData = (canvas: any) => {
    return {
      labels: [1, 2],
      datasets: [
        {
          data: [props.healthyLoansUsd.toNumber(), props.unhealthyLoansUsd.toNumber()],
          backgroundColor: ['#E7EBF0', '#B79EFF'],
          hoverBackgroundColor: ['#E7EBF0', '#B79EFF'],
          hoverBorderColor: ['#ffffff', '#ffffff'],

        }
      ]
    }
  }
  const canvas = document.createElement('canvas');
  const chartData = getData(canvas);

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
      enabled: false     
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