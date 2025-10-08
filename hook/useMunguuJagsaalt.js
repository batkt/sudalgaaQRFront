import useSWR from "swr";
import { useMemo, useState } from "react";
import { aldaaBarigch, uilchilgee2 } from "@/services/uilchilgee";
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
  return uilchilgee2(token)
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

function useMunguuJagsaalt(url, query, order, select, searchKeys, khuudasniiKhemjee) {
  const { token } = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee ? khuudasniiKhemjee : 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate, isValidating } = useSWR(
    token && url
      ? [token, url, query, order, select, khuudaslalt, searchKeys]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setKhuudaslalt((a) => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return { ...a };
        });
      }
  }

  function refresh() {
    setKhuudaslalt((a) => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return { ...a };
    });
    mutate();
  }

  function onSearch(search) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setKhuudaslalt((a) => {
        a.search = search;
        a.jagsaalt = [];
        a.khuudasniiDugaar = 1;
        return {
          ...a,
        };
      });
    }, 300);
  }

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    data,
    mutate,
    jagsaalt,
    next,
    refresh,
    onSearch,
    isValidating,
    setKhuudaslalt,
    khuudaslalt,
  };
}

export default useMunguuJagsaalt;
