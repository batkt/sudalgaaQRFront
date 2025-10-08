import { message } from "antd";
import axios from "axios";
import _ from "lodash";
import socketIOClient from "socket.io-client";

// export const url = "http://feedback.transportation.police.gov.mn:8083";
//export const url = "http://103.143.40.41:8085";
export const url = "https://qr.zevtabs.mn/api";
// export const url = "http://192.168.1.241:8085";

// export const url2 = "http://manager.transportation.police.gov.mn:8084";
//export const url2 = "http://103.143.40.91:8084";
export const url2 = "https://qr.zevtabs.mn/api";

export const socket = () => socketIOClient(url, { transports: ["websocket"] });

export const aldaaBarigch = (e) => {
  if (e?.response?.data?.aldaa === "jwt expired") {
    window.location.href = "/";
  } else if (!!e?.response?.data?.aldaa)
    message.error(e?.response?.data?.aldaa);
  else if (!!e?.response?.errors)
    message.error(JSON.stringify(e?.response?.errors));
  else message.error(JSON.stringify(e?.message));
};

const uilchilgee = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL:
      typeof window === "undefined"
        ? // ? "http://feedback.transportation.police.gov.mn:8083"
          // "http://103.143.40.41:8085"
          "https://qr.zevtabs.mn/api"
        : // ? "http://192.168.1.241:8085"
          url,
    headers,
  });
};

export const uilchilgee2 = (token) => {
  const headers = {
    "Content-type": "application/json",
  };
  if (!!token) headers["Authorization"] = `bearer ${token}`;
  return axios.create({
    baseURL:
      typeof window === "undefined"
        ? // ? "http://manager.transportation.police.gov.mn:8084"
          // "http://103.143.40.91:8084"
          "https://qr.zevtabs.mn/api"
        : url2,
    headers,
  });
};

export default uilchilgee;
