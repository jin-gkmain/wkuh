import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  max: number;
  step: number;
  data: ChartDataset[];
  labels: string[];
  chartRef: any;
  legend?: boolean;
};

export type ChartDataset = {
  label: string;
  data: number[];
};

function getDatasets(data: ChartDataset[]) {
  return data
    ? data.map((d, idx) => ({
        label: d.label,
        data: d.data,
        fill: false,
        borderColor: lineColor[idx],
        tension: 0.1,
      }))
    : [];
}

const lineColor = ['rgba(75,192,192,1)', 'rgba(153,102,255,1)', '#c0d399'];

export default function MyLineChart({
  max,
  step,
  data,
  labels,
  chartRef,
  legend = false,
}: Props) {
  const options = getChartOptions({ scale: { min: 0, max, step }, legend });
  const myData = {
    labels,
    datasets: getDatasets(data),
  };

  return <Line data={myData} options={options} ref={chartRef} />;
}

type OptionPropType = {
  scale: {
    min: number;
    max: number;
    step: number;
  };
  legend: boolean;
};

function getChartOptions({ scale, legend }: OptionPropType) {
  const { min, max, step } = scale;
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: legend,
      },

      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        min,
        max,
        ticks: {
          stepSize: step,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          // maxRotation: 45,
          // minRotation: 45,
        },
      },
    },
  };

  return options;
}
