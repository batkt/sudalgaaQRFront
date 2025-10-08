"use client";

import { memo } from "react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";

const ChartsSection = memo(({ lineGraphicTailan, graphicTailan, selectedOption, rawSurveyData, dateRange }) => {
  return (
    <div className="grid grid-cols-1 gap-4 justify-start items-center w-full lg:grid-cols-2 lg:gap-8">
      <div className="flex flex-col gap-4 justify-center items-center p-4 w-full h-80 bg-white rounded-xl border shadow-lg lg:gap-8">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-lg lg:text-xl">Хандалтын явц</h1>
            <h1 className="text-xs text-gray-500 lg:text-sm">
              Иргэн & Огноо
            </h1>
          </div>
        </div>
        <div className="flex justify-start items-center w-full h-full">
          <LineChart
            data={lineGraphicTailan || {}}
            selectedOption={selectedOption}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center p-4 w-full h-80 bg-white rounded-xl border shadow-lg lg:gap-8">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-lg lg:text-xl">Онооны тоогоор</h1>
            <h1 className="text-xs text-gray-500 lg:text-sm">
              Тоо & Огноо
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full">
          <BarChart
            data={graphicTailan || {}}
            selectedOption={selectedOption}
            rawSurveyData={rawSurveyData}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
});

ChartsSection.displayName = 'ChartsSection';

export default ChartsSection;
