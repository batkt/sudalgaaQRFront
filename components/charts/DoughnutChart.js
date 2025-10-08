import React from "react";
import { Doughnut } from "react-chartjs-2";
import colors from "tailwindcss/colors";

const DoughnutChart = ({ data, selectedOption }) => {
  const DoughnutChartData = {
    labels: ["1 (Муу)", "3 (Дунд)", "5 (Сайн)"],
    datasets: [
      {
        label: "",
        data: [12, 19, 15],
        backgroundColor: [
          "rgba(6, 182, 212, 0.2)",
          "rgba(14, 116, 144, 0.2)",
          "rgba(22, 78, 99, 0.2)",
        ],
        borderColor: [colors.sky[500], colors.sky[700], colors.sky[900]],
        borderWidth: 2,
      },
      {
        label: "",
        data: [4, 7, 19],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const DoughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointerStyle: "circle",
          pointStyle: "circle",
        },
      },
    },
    cutout: "60%",
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  const filteredDoughnutChartData =
    selectedOption === "month"
      ? {
          ...DoughnutChartData,
          datasets: [DoughnutChartData.datasets[1]],
        }
      : {
          ...DoughnutChartData,
          datasets: [DoughnutChartData.datasets[0]],
        };

  const chartPlugin = {
    lastActivePoint: null,

    afterDraw(chart) {
      const { ctx, data, tooltip } = chart;

      if (tooltip?.opacity === 0) {
        if (this.lastActivePoint) {
          const { datasetIndex, index } = this.lastActivePoint;
          const value = data.datasets[datasetIndex].data[index];
          const label = data.labels[index];

          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          ctx.save();
          ctx.font = "1.5rem roboto";
          ctx.fillStyle = colors.sky[600];
          ctx.textAlign = "center";
          ctx.fillText(label, centerX, centerY + 10);
          ctx.font = "2rem roboto";
          ctx.fillStyle = colors.sky[700];
          ctx.fillText(value, centerX, centerY - 10);
          ctx.restore();
        }
      } else {
        ctx.save();
        ctx.font = "1.5rem roboto";
        ctx.fillStyle = colors.sky[600];

        const activePoint = chart.tooltip.getActiveElements()[0];
        if (activePoint) {
          const datasetIndex = activePoint.datasetIndex;
          const index = activePoint.index;

          const value = data.datasets[datasetIndex].data[index];
          const label = data.labels[index];

          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          ctx.textAlign = "center";
          ctx.fillText(label, centerX, centerY + 10);
          ctx.font = "2rem roboto";
          ctx.fillStyle = colors.sky[700];
          ctx.fillText(value, centerX, centerY - 10);

          this.lastActivePoint = { datasetIndex, index };
        }

        ctx.restore();
      }

      chart.update();
    },
  };

  return (
    <Doughnut
      data={filteredDoughnutChartData}
      options={DoughnutOptions}
      plugins={[chartPlugin]}
    />
  );
};

export default DoughnutChart;
