import uilchilgee from "@/services/uilchilgee";
import useSWR from "swr";

const fetcherChartData = (url, token, ognoo) =>
  uilchilgee(token)
    .get(url, {
      params: {
        ...(ognoo && {
          ekhlekhOgnoo: ognoo[0],
          duusakhOgnoo: ognoo[1],
        }),
      },
    })
    .then((res) => res.data)
    .catch((err) => {});

const useChartDataAvya = (token, ognoo) => {
  const { data, mutate } = useSWR(
    !!token ? ["/chartDataAvya", ognoo] : null,
    (url, ognoo) => fetcherChartData(url, token, ognoo),
    { revalidateOnFocus: false }
  );

  return {
    chartData: data?.data || { 
      umnukhNiit: 0,
      odooNiit: 0,
      surug: 0,
      eyreg: 0,
      ajiltanSanal: [],
      ajiltanSanalHighest: []
    },
    chartDataMutate: mutate,
  };
};

export default useChartDataAvya;
