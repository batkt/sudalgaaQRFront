import useSWR from "swr";
import { useMemo, useState, useCallback } from "react";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";
import { useAuth } from "@/services/auth";

function searchGenerator(keys, search) {
  if (keys.length > 0)
    return keys.map((key) => ({ [key]: { $regex: search, $options: "i" } }));
  return undefined;
}

async function fetcher(
  token,
  url,
  query,
  order,
  select,
  { search = "", jagsaalt, ...khuudaslalt },
  searchKeys = []
) {
  return uilchilgee(token)
    .get(url, {
      params: {
        query: {
          ...query,
          $or: searchGenerator(searchKeys, search),
        },
        order,
        select,
        ...khuudaslalt,
      },
    })
    .then((a) => a.data)
    .catch(aldaaBarigch);
}

var timeout = null;

function useZardal(
  token,
  url = "zardal",
  query,
  order,
  select,
  searchKeys = ["ner"],
  khuudasniiKhemjee
) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee ? khuudasniiKhemjee : 100,
    search: "",
    jagsaalt: [],
  });

  const swrKey = useMemo(() => {
    if (!token || !url) return null;

    return JSON.stringify([
      token,
      url,
      query,
      order,
      select,
      {
        khuudasniiDugaar: khuudaslalt.khuudasniiDugaar,
        khuudasniiKhemjee: khuudaslalt.khuudasniiKhemjee,
        search: khuudaslalt.search,
      },
      searchKeys,
    ]);
  }, [
    token,
    url,
    query,
    order,
    select,
    khuudaslalt.khuudasniiDugaar,
    khuudaslalt.khuudasniiKhemjee,
    khuudaslalt.search,
    searchKeys,
  ]);

  const stableFetcher = useCallback((key) => {
    const [token, url, query, order, select, khuudaslaltParams, searchKeys] =
      JSON.parse(key);
    return fetcher(
      token,
      url,
      query,
      order,
      select,
      khuudaslaltParams,
      searchKeys
    );
  }, []);

  const { data, mutate, isValidating } = useSWR(swrKey, stableFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  const next = useCallback(() => {
    if (!!data && khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
      setKhuudaslalt((a) => ({
        ...a,
        jagsaalt: [...a.jagsaalt, ...(data?.jagsaalt || [])],
        khuudasniiDugaar: a.khuudasniiDugaar + 1,
      }));
    }
  }, [data, khuudaslalt?.khuudasniiDugaar]);

  const refresh = useCallback(() => {
    setKhuudaslalt((a) => ({
      ...a,
      jagsaalt: [],
      khuudasniiDugaar: 1,
    }));
    mutate();
  }, [mutate]);

  const onSearch = useCallback((search) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setKhuudaslalt((a) => ({
        ...a,
        search,
        jagsaalt: [],
        khuudasniiDugaar: 1,
      }));
    }, 300);
  }, []);

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt?.jagsaalt, data?.jagsaalt]);

  return {
    zardalGaralt: data,
    zardalMutate: mutate,
    setKhuudaslalt,
    data,
    mutate,
    jagsaalt,
    next,
    refresh,
    onSearch,
    setKhuudaslalt,
    isValidating,
    khuudaslalt,
  };
}

export default useZardal;
