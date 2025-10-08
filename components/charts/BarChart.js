import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import colors from "tailwindcss/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, selectedOption, questionIndex = 0, rawSurveyData = null }) => {
  const processSurveyData = (surveyData, questionIdx = 0) => {
    if (!surveyData) {
      return [0, 0, 0, 0, 0]; // Return default counts if no data
    }



    if (rawSurveyData && Array.isArray(rawSurveyData)) {
      const ratingCounts = [0, 0, 0, 0, 0];
      
      rawSurveyData.forEach((survey, surveyIndex) => {
        if (survey.khariultuud && Array.isArray(survey.khariultuud)) {
          survey.khariultuud.forEach((response, responseIndex) => {
            if (response.sudalgaaniiTurul === "Оноо өгөх") {
              const ratingMatch = response.khariult.match(/(\d+)/);
              if (ratingMatch) {
                const rating = parseInt(ratingMatch[1]);
                if (rating >= 1 && rating <= 5) {
                  ratingCounts[rating - 1]++;
                }
              }
            }
          });
        }
      });
      
      return ratingCounts;
    }

    if (Array.isArray(surveyData)) {
      const ratingCounts = [0, 0, 0, 0, 0];

      surveyData.forEach((survey, surveyIndex) => {
        if (survey.khariultuud && Array.isArray(survey.khariultuud)) {
          survey.khariultuud.forEach((response, responseIndex) => {
            if (response.sudalgaaniiTurul === "Оноо өгөх") {
              const ratingMatch = response.khariult.match(/(\d+)/);
              if (ratingMatch) {
                const rating = parseInt(ratingMatch[1]);
                if (rating >= 1 && rating <= 5) {
                  ratingCounts[rating - 1]++;
                }
              }
            }
          });
        }
      });

      return ratingCounts;
    }

    if (Array.isArray(surveyData) && surveyData.length === 5 && typeof surveyData[0] === 'number') {
      return surveyData;
    }

    if (surveyData && typeof surveyData === 'object' && surveyData.data && Array.isArray(surveyData.data)) {
      return surveyData.data;
    }

    return [0, 0, 0, 0, 0]; 
  };

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
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Онооны тоо: ${context.parsed.y}`;
          }
        }
      }
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
        beginAtZero: true,
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

  const dynamicData = processSurveyData(data, questionIndex);


  const BarChartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Count",
        data: dynamicData,
        backgroundColor: [
          "rgba(12, 19, 79, 0.2)",
          "rgba(29, 38, 125, 0.2)",
          "rgba(92, 70, 156, 0.2)",
          "rgba(212, 173, 252, 0.2)",
          "rgba(172, 188, 255, 0.2)",
        ],
        borderColor: [
          "rgba(12, 19, 79, 1)",
          "rgba(29, 38, 125, 1)",
          "rgba(92, 70, 156, 1)",
          "rgba(212, 173, 252, 1)",
          "rgba(172, 188, 255, 1)",
        ],
        borderWidth: 1,
      },
      {
        label: "Count 2",
        data: dynamicData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const filteredBarChartData =
    selectedOption === "month"
      ? {
          ...BarChartData,
          datasets: [BarChartData.datasets[1]],
        }
      : {
          ...BarChartData,
          datasets: [BarChartData.datasets[0]],
        };

  return <Bar data={filteredBarChartData} options={options} />;
};

export default BarChart;