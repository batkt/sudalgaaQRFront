import useSWR from "swr";
import moment from "moment";
import axios, { aldaaBarigch } from "@/services/uilchilgee";

const fetcher = (url, token, ognoo) => {
  return axios(token)
    .post(
      url,
      ognoo
        ? {
            ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : {}
    )
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

function useGraphicTailanAvya(token, ognoo) {
  const { data: graphicTailan, mutate } = useSWR(
    !!token ? ["/graphicTailanAvya", token, ognoo] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { graphicTailan, graphicTailanMutate: mutate };
}

export default useGraphicTailanAvya;
