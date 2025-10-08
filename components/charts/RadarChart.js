import React from "react";
import { Radar } from "react-chartjs-2";

const RadarChart = ({ data }) => {
  const radarChartData = {
    labels: data?.labels || [],
    datasets: data?.datasets || [],
  };

  const RadarOptions = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw || "";
            if (value) {
              return `${value.toFixed(1)}`;
            }
            return null;
          },
        },
      },
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
      line: {
        fill: true,
      },
      arc: {
        borderWidth: 0,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        pointLabels: {
          display: false,
        },
      },
    },
  };

  return <Radar data={radarChartData} options={RadarOptions} />;
};

export default RadarChart;
