import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/services/auth";
import { useTulkhuurUg } from "@/hook/useTulkhuurUg";
import useGraphicTailanAvya from "@/hook/useGraphicTailanAvya";
import useLineGraphicTailan from "@/hook/useLineGraphicTailan";
import useChartDataAvya from "@/hook/useChartDataAvya";
import useJagsaalt from "@/hook/useJagsaalt";
import useMunguuJagsaalt from "@/hook/useMunguuJagsaalt";
import useZardal from "@/hook/useZardal";
import uilchilgee from "@/services/uilchilgee";
import moment from "moment";

const order = { createdAt: -1 };
const searchKeys = [
  "ajiltan.ner",
  "ajiltan.ovog",
  "ajiltan.register",
  "ajiltan.tsol",
  "ajiltan.tasag",
  "ajiltan.kheltes",
  "ajiltan.utas",
  "asuultiinNer",
  "asuultiinTurul",
  "utas",
  "tailbar",
];
const searchKeysTasag = ["ner"];
const searchKeysAjiltan = ["ner"];
const searchKeysZardal = ["ner"];

export const useAnalyticsData = () => {
  const { token, nevtersenAjiltan } = useAuth();
  const { tulkhuurUgGaralt } = useTulkhuurUg(token);

  const [ognoo, setOgnoo] = useState(null);
  
  // Wrapper to track setOgnoo calls
  const setOgnooWithTrace = (value) => {
    setOgnoo(value);
  };
  const [currentDate, setCurrentDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const dateRange = useMemo(() => {
    if (ognoo) {
      return ognoo;
    }
    // Default to "all" - no date filtering when no date range is selected
    return null;
  }, [ognoo]);

  const { chartData: apiChartData, chartDataMutate } = useChartDataAvya(
    token,
    dateRange
  );

  const { graphicTailan, graphicTailanMutate } = useGraphicTailanAvya(
    token,
    ognoo
  );

  const { lineGraphicTailan, lineGraphicTailanMutate } = useLineGraphicTailan(
    token,
    ognoo
  );

  const khariultGaralt = useJagsaalt(
    "/khariult",
    undefined,
    order,
    undefined,
    searchKeys,
    5000
  );

  const tasagGaralt = useMunguuJagsaalt(
    "/tasag",
    undefined,
    undefined,
    undefined,
    searchKeysTasag,
    100
  );

  const {
    zardalGaralt,
    setKhuudaslalt: setZardalKhuudaslalt,
    zardalMutate,
  } = useZardal(
    token,
    "/zardal",
    undefined,
    undefined,
    undefined,
    searchKeysZardal,
    50
  );

  const ajiltanGaralt = useJagsaalt(
    "/ajiltan",
    undefined,
    undefined,
    undefined,
    searchKeysAjiltan,
    5000
  );

  // Update current date daily
  useEffect(() => {
    const updateDate = () => {
      const newDate = new Date().toISOString().split("T")[0];
      setCurrentDate(newDate);
    };

    updateDate();
    const interval = setInterval(updateDate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const onChangeOgnoo = (dates, dateString) => {
    if (!dates) {
      setOgnooWithTrace(null);
      graphicTailanMutate();
      lineGraphicTailanMutate();
    }
    if (dates && dates.length === 2) {
      // Validate the date range
      const startDate = moment(dates[0]);
      const endDate = moment(dates[1]);
      
      if (startDate.isValid() && endDate.isValid()) {
        setOgnooWithTrace(dateString);
        graphicTailanMutate();
        lineGraphicTailanMutate();
      }
    }
  };

  useEffect(() => {
    graphicTailanMutate();
    lineGraphicTailanMutate();
    chartDataMutate();
  }, [ognoo]);


  return {
    token,
    nevtersenAjiltan,
    tulkhuurUgGaralt,
    ognoo,
    onChangeOgnoo: onChangeOgnoo,
    currentDate,
    dateRange,
    apiChartData,
    chartDataMutate,
    graphicTailan,
    graphicTailanMutate,
    lineGraphicTailan,
    lineGraphicTailanMutate,
    khariultGaralt,
    tasagGaralt,
    zardalGaralt,
    setZardalKhuudaslalt,
    zardalMutate,
    ajiltanGaralt,
  };
};
