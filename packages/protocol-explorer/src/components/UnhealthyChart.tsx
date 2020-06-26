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
    }
  }
  return (
    <React.Fragment>
      <section className="wrapper-chartjs-doughnut">
        <Doughnut data={chartData} options={options} height={200} />
      </section>
    </React.Fragment>
  );
}