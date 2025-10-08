import uilchilgee from "@/services/uilchilgee";
import { useMemo } from "react";
import useSWR from "swr";

const fetcher = (url, token, turul) =>
  uilchilgee(token)
    .get(url, { params: { turul } })
    .then((res) => res.data)
    .catch((err) => {});

export function useTokhirgoo(token, turul) {
  const { data, mutate, isLoading } = useSWR(
    !!token ? ["/tokhirgoo", token, turul] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const firstDoc = useMemo(() => {
    if (!data) return null;
    const res = Array.isArray(data?.jagsaalt) ? data.jagsaalt : [];
    const filtered = turul ? res.filter((item) => item.turul === turul) : res;
    const first = filtered?.[0] || null;
    return first;
  }, [data, turul]);

  async function save(tokenArg, fields) {
    const api = uilchilgee(tokenArg);

    if (firstDoc?._id) {
      // Ensure new fields override old values
      const body = { 
        turul: firstDoc.turul,
        utas: firstDoc.utas || [],
        ...fields  // This should override any existing values
      };
      const { data: d } = await api.put(`/tokhirgoo/${firstDoc._id}`, body);
      await mutate();
      return d;
    } else {
      const newRecord = {
        turul: turul,
        ...fields,
      };
      const { data: d } = await api.post(`/tokhirgoo`, newRecord);
      await mutate();
      return d;
    }
  }

  return {
    msgTokhirgoo: firstDoc,
    msgTokhirgooGaralt: data,
    msgTokhirgooMutate: mutate,
    msgTokhirgooIsLoading: isLoading,
    saveMsgTokhirgoo: save,
  };
}

export default useTokhirgoo;
