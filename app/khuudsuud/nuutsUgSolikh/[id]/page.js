"use client";

import { Button, Form, Input, message } from "antd";
import { useAuth } from "@/services/auth";
import { usePathname, useRouter } from "next/navigation";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";

const { Password } = Input;

function Nevtrekh() {
  const { token } = useAuth();
  const [form] = Form.useForm();
  const router = useRouter();
  const pathName = usePathname();
  const zam = pathName.split("/");
  const ajiltniiId = zam[zam.length - 1];

  function onFinish(values) {
    const { nuutsUg, davtanNuutsUg } = values;
    if (nuutsUg !== davtanNuutsUg) {
      message.error("Нууц үг давхцахгүй байна");
      return;
    }
    uilchilgee(token)
      .post(`/nuutsUgSoliyo/${ajiltniiId}`, { nuutsUg })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Нууц үг амжилттай солигдлоо!");
          router.push("/dashboard/analytic");
        }
      })
      .catch((err) => aldaaBarigch(err));
  }

  return (
    <div className="flex justify-center items-center bg-[url('/assets/bg-from-unsplash.jpg')] bg-cover bg-center bg-no-repeat w-screen h-screen dark:bg-gray-800">
      <div className="w-full sm:w-[640px] md:w-[768px] lg:w-[1024px] h-fit rounded-xl bg-blue-300 flex justify-center items-center">
        <div className="md:flex hidden flex-col justify-end items-center w-[40%] !h-[408px] rounded-l-xl bg-[url('/assets/subBg.png')] bg-contain bg-center bg-no-repeat py-10 px-20"></div>
        <div className="block xl:flex justify-start items-center w-full md:w-[60%] bg-white p-20 pt-10 rounded-r-xl">
          <div className="flex w-full h-screen xl:h-auto">
            <div className="my-auto border-r- bg-white dark:bg-gray-900 xl:dark:bg-gray-800 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none !w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
              <div className="flex flex-col items-center justify-start w-full mb-10">
                <div className="flex items-center justify-center w-20 h-20 overflow-hidden">
                  <img
                    className="w-full h-full object-cover scale-[1.5]"
                    src="/assets/logo.webp"
                  />
                </div>
                <h2 className="uppercase font-[750] ">тангараг</h2>
              </div>
              <Form
                form={form}
                initialValues={{}}
                className="w-full"
                onFinish={onFinish}
              >
                <h2 className="uppercase font-[600] mb-4">Нууц үг солих</h2>
                <Form.Item
                  name="nuutsUg"
                  rules={[
                    { required: true, message: "Шинэ нууц үг оруулна уу" },
                  ]}
                >
                  <Password
                    autoComplete="off"
                    placeholder="Шинэ нууц үг"
                    type="password"
                    className="login-input"
                  />
                </Form.Item>
                <Form.Item
                  name="davtanNuutsUg"
                  rules={[
                    { required: true, message: "Нууц үг давтан оруулна уу" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("nuutsUg") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Нууц үг давхцахгүй байна");
                      },
                    }),
                  ]}
                >
                  <Password
                    autoComplete="off"
                    placeholder="Нууц үг давтан"
                    type="password"
                    className="login-input"
                  />
                </Form.Item>
                <div className="flex items-center justify-between gap-4 mt-4 text-xs text-gray-700 intro-x dark:text-gray-600 sm:text-sm">
                  <a href={null}>Нууц үг сэргээх?</a>
                  <div>
                    <Button
                      htmlType="submit"
                      className="flex items-center justify-center w-full gap-2 px-2 py-2 pr-3 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md group hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Солих
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nevtrekh;
