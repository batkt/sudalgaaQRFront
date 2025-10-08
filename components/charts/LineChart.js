import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import colors from "tailwindcss/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }) => {
  const labels = Array.isArray(data) ? data?.map((item) => item._id) : [];
  const dataPoints = Array.isArray(data) ? data?.map((item) => item.too) : [];

  const options = {
    backdropColor: colors.sky[200],
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      filler: {
        propagate: true,
      },
      afterDraw: true,
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: colors.slate[500],
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
          color: colors.slate[500],
          callback: function (value) {
            return value;
          },
        },
        grid: {
          color: colors.slate[200],
          borderDash: [2, 2],
          drawBorder: false,
        },
      },
    },
  };

  const LineChartData = {
    labels: labels,
    datasets: [
      {
        label: "Судалгаа бөглөсөн тоо",
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(135, 206, 235, 0.2)",
        borderColor: colors.sky[700],
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 255, 255, 1)",
        pointBorderColor: "rgba(75, 192, 192, 1)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  return <Line data={LineChartData} options={options} />;
};

export default LineChart;
