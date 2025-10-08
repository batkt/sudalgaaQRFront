import uilchilgee from "@/services/uilchilgee";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url, token, khuudaslalt) =>
  uilchilgee(token)
    .get(url, { params: { ...khuudaslalt } })
    .then((res) => res.data)
    .catch((err) => {});

export function useTulkhuurUg(token) {
  const [khuudaslalt, setTulkhuurUgKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
  });

  const { data, mutate } = useSWR(
    !!token ? ["/tulkhuurUg", token, khuudaslalt] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    tulkhuurUgGaralt: data,
    tulkhuurUgMutate: mutate,
    setTulkhuurUgKhuudaslalt,
  };
}
