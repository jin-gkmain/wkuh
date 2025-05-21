import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const options: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
};

type Props = {
  labels: string[];
  data: number[];
};

const BORDER_COLORS = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];
const BG_COLORS = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];

export default function MyPieChart({ labels, data }: Props) {
  const myData = { labels, datasets: getDatasets(data) };
  return <Pie data={myData} options={options} />;
}

function getDatasets(data: number[]) {
  const bg = data.map((_, idx) => BG_COLORS[idx]);
  const br = data.map((_, idx) => BORDER_COLORS[idx]);

  return [
    {
      data,
      backgroundColor: bg,
      borderColor: br,
    },
  ];
}
