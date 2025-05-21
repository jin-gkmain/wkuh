import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  max: number;
  step: number;
  data: ChartDataset[];
  labels: string[];
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
        backgroundColor: bgColor[idx],
        borderColor: lineColor[idx],
        borderWidth: 1,
      }))
    : [];
}

const bgColor = ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'];
const lineColor = ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'];

export default function MyBarChart({ max, step, data, labels }: Props) {
  const myData = {
    labels,
    datasets: getDatasets(data),
  };
  const options = getChartOptions({ scale: { min: 0, max, step } });

  return <Bar data={myData} options={options} />;
}

type OptionPropType = {
  scale: {
    min: number;
    max: number;
    step: number;
  };
};

function getChartOptions({ scale }: OptionPropType) {
  const { min, max, step } = scale;
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
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
        },
      },
    },
  };

  return options;
}
