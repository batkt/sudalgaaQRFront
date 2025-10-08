import React from "react";
import { Pie, PolarArea } from "react-chartjs-2";
import colors from "tailwindcss/colors";

const PolarAreaChart = ({ data, selectedOption }) => {
  const PieChartData = {
    labels: ["1 (Муу)", "3 (Дунд)", "5 (Сайн)"],
    datasets: [
      {
        label: "# of Votes",
        data: [6, 22, 19],
        backgroundColor: [
          "rgba(6, 182, 212, 0.2)",
          "rgba(20, 184, 166, 0.2)",
          "rgba(22, 78, 99, 0.2)",
        ],
        borderColor: [colors.sky[500], colors.blue[700], colors.indigo[800]],
        borderWidth: 2,
        animation: {
          animateRotate: false,
          animateScale: true,
        },
        hoverBorderWidth: 3,
      },
      {
        label: "# of Votes",
        data: [1, 17, 6],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        animation: {
          animateRotate: false,
          animateScale: true,
        },
      },
    ],
  };

  const filteredPieChartData =
    selectedOption === "month"
      ? {
          ...PieChartData,
          datasets: [PieChartData.datasets[1]],
        }
      : {
          ...PieChartData,
          datasets: [PieChartData.datasets[0]],
        };
  const total = filteredPieChartData?.datasets?.reduce(
    (sum, value) => sum + value,
    0
  );
  const PiePercentages = filteredPieChartData?.datasets?.map(
    (value) => (value / total) * 100
  );

  const pieOptions = {
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataIndex = tooltipItem.index;
          const percentage = PiePercentages[dataIndex].toFixed(2);
          return `${data.labels[dataIndex]}: ${percentage}%`;
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          circular: true,
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return <PolarArea data={filteredPieChartData} options={pieOptions} />;
};

export default PolarAreaChart;
