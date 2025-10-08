import uilchilgee from "@/services/uilchilgee";
import { useState } from "react";
import useSWR from "swr";

const fetcherJagsaalt = (url, token, { jagsaalt, ...khuudaslalt }) =>
  uilchilgee(token)
    .get(url, {
      params: {
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch((err) => {});

export function useAjiltniiJagsaalt(token) {
  const [khuudaslalt, setAjiltniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    // !!token ? ["http://192.168.1.241:8085/ajiltan", khuudaslalt] : null,
    // !!token ? ["http://103.143.40.41:8085/ajiltan", khuudaslalt] : null,
    !!token ? ["https://sudalgaa.zevtabs.mn/api/ajiltan", khuudaslalt] : null,
    // !!token ? ["http://feedback.transportation.police.gov.mn:8083/ajiltan", khuudaslalt] : null,
    fetcherJagsaalt,
    { revalidateOnFocus: false }
  );
  return {
    ajilchdiinGaralt: data,
    ajiltniiJagsaaltMutate: mutate,
    setAjiltniiKhuudaslalt,
  };
}
