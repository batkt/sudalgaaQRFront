import { useState, useContext, createContext, useMemo, useEffect } from "react";
import { message } from "antd";
import uilchilgee, { aldaaBarigch } from "./uilchilgee";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [nevtersenAjiltanErkh, setNevtersenAjiltanErkh] = useState(null);
  const [nevtersenAjiltanId, setNevtersenAjiltanId] = useState(null);

  useEffect(() => {
    const t = parseCookies();
    setToken(t?.hitoken);
    setNevtersenAjiltanErkh(t?.hiajiltan);
    setNevtersenAjiltanId(t?.hiajiltan_id);

    const nevtersenAjiltan = localStorage.getItem("nevtersenAjiltan");

    window.addEventListener("online", () =>
      message.success("Интернэт ертөнцөд тавтай морил")
    );
    window.addEventListener("offline", () =>
      message.warning("Таны интернэт тасарсан байна")
    );
  }, []);

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          message.warning("Нэвтрэх нэр талбарыг бөглөнө үү");
          return;
        }
        if (!khereglech.nuutsUg) {
          message.warning("Нууц үг талбарыг бөглөнө үү");
          return;
        }
        if (khereglech.namaigsana)
          localStorage.setItem("nevtrekhNer", khereglech.nevtrekhNer);

        uilchilgee()
          .post("/ajiltanNevtrey", khereglech)
          .then(({ data, status }) => {
            if (status === 200) {
              if (!!data.token) {
                setCookie(null, "hitoken", data.token, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                setCookie(null, "hiajiltan", data?.result?.erkh, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                setCookie(null, "hiajiltan_id", data?.result?._id, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });

                setToken(data.token);
                setNevtersenAjiltanErkh(data?.result?.erkh);
                setNevtersenAjiltanId(data?.result?._id);

                localStorage.setItem(
                  "nevtersenAjiltan",
                  JSON.stringify(data?.result)
                );
                message.success("Тавтай морил");
                router.push("/dashboard/analytic");
              } else {
                message.error("Хэрэглэгчийн мэдээлэл буруу байна");
              }
            } else {
              message.error("Хэрэглэгчийн мэдээлэл буруу байна");
            }
          })
          .catch(aldaaBarigch);
      },
      garya: () => {
        destroyCookie(null, "hitoken");
        destroyCookie(null, "hiajiltan");
        destroyCookie(null, "hiajiltan_id");

        localStorage.removeItem("nevtersenAjiltan");
        localStorage.removeItem("nevtrekhNer");
        window.location.href = "/";
      },
      token,
      setToken,
      nevtersenAjiltanErkh,
      nevtersenAjiltanId,
    }),
    [token, nevtersenAjiltanErkh, nevtersenAjiltanId]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
