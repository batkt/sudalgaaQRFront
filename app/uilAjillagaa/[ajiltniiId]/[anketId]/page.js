"use client";

import { CloseCircleFilled, SendOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Radio, Checkbox } from "antd";
import { useState, useEffect } from "react";
import uilchilgee, { aldaaBarigch, url } from "@/services/uilchilgee";
import { usePathname } from "next/navigation";
import styles from "@/styles/Loading.module.css";

function AnketBuglukh() {
  const [form] = Form.useForm();
  const [garakhScreen, setGarakhScreen] = useState(false);
  const [asuultData, setAsuultData] = useState(null);
  const [ajiltanData, setAjiltanData] = useState(null);
  const [unshijBaina, setUnshijBaina] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();

  const a = pathName.split("/");
  const ajiltniiId = a[2];
  const anketniiId = a[3];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await uilchilgee().get(
          `/asuultIdgaarAvya/${anketniiId}`
        );
        setAsuultData(response.data);
      } catch (error) {}
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await uilchilgee().get(
          `ajiltanIdgaarAvya/${ajiltniiId}`
        );
        setAjiltanData(response.data);
      } catch (error) {
      } finally {
        setUnshijBaina(false);
      }
    };
    fetchData();
  }, []);

  const data = asuultData;

  function unelgeeIlgeey(khariult) {
    uilchilgee()
      .post("/unelgeeKhadgalya", khariult)
      .then(({ data }) => {
        if (data === "Amjilttai") {
           setGarakhScreen(true);
          notification.success({ message: "Үнэлгээ амжилттай илгээгдлээ" });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }

  const onFinish = (values) => {
    const khariult = {
      ajiltan: ajiltanData,
      asuultiinId: data._id,
      asuultiinNer: data.ner,
      asuultiinTurul: data.turul,
      ognoo: new Date(),
      khariultuud: values.asuultuud.map(({ asuult, khariult }) => ({
        asuult,
        khariult,
      })),
    };
    unelgeeIlgeey(khariult);
  };

  if (unshijBaina) {
    return (
      <div id={styles.page_loading}>
        <div className={styles.three_balls}>
          <div className={styles.ball + " " + styles.ball1}></div>
          <div className={styles.ball + " " + styles.ball2}></div>
          <div className={styles.ball + " " + styles.ball3}></div>
        </div>
      </div>
    );
  }

  if (!ajiltanData) {
    return (
      <div className="flex h-screen w-full items-center justify-center pt-3">
        <div className="flex h-3/6 w-10/12 flex-col items-center justify-center rounded-xl bg-white bg-opacity-80 shadow-2xl dark:bg-gray-900 dark:bg-opacity-80 lg:w-8/12 2xl:w-6/12">
          <p className="px-5 text-xl font-medium text-center flex gap-2 justify-center items-center">
            <CloseCircleFilled className="text-red-400" />
            Уучлаарай, ажилтны мэдээлэл байхгүй байна!
          </p>
          <div className="mt-8">
            <Button
              onClick={() => window.close()}
              className="bg-red-400 text-white flex justify-center items-center"
            >
              Хаах
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 py-5 dark:bg-gray-800  md:py-12  lg:py-20 ">
      {!garakhScreen && data && (
        <div className="block h-full w-11/12 rounded-lg bg-white pt-3 shadow-2xl dark:bg-gray-900 sm:w-10/12 sm:p-5 md:w-8/12 lg:w-6/12 2xl:w-4/12">
          <div className="block relative rounded-lg bg-white pt-3 shadow-md dark:bg-gray-900 p-6 mb-12">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2 justify-center items-start w-full">
                <span>Овог : {ajiltanData.ovog}</span>
                <span>Нэр : {ajiltanData.ner}</span>
                <span>Цол : {ajiltanData.tsol}</span>
                <span className="truncate whitespace-normal">
                  Албан тушаал : {ajiltanData.albanTushaal}
                </span>
              </div>
              <div className="flex justify-center items-center w-full h-full border rounded-full overflow-hidden">
                <img
                  className="w-[150px] h-[150px] object-contain"
                  src={`${url}/file?path=ajiltan/${ajiltanData?.zurgiinId}`}
                />
              </div>
            </div>
          </div>
          <header className="border-b-2 px-3 text-xl font-medium uppercase">
            {data.ner}
          </header>
          <Form
            form={form}
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete="off"
            scrollToFirstError={{
              behavior: "smooth",
              block: "center",
              inline: "center",
            }}
            initialValues={data}
            className="block h-5/6 overflow-y-auto pt-5"
            layout="vertical"
          >
            <Form.List name="asuultuud">
              {(fields) => (
                <>
                  <div className="flex flex-col">
                    {fields.map((field) => (
                      <div
                        className="px-6 pb-3 dark:text-gray-300"
                        key={field.key}
                      >
                        <div className="flex gap-1 text-sm">
                          <span>{data?.asuultuud[field.name]?.asuult}</span>
                        </div>
                        <div className="flex flex-col gap-2 py-2 dark:text-gray-200 sm:px-10">
                          <Form.Item
                            {...field}
                            hidden
                            name={[field.name, "asuult"]}
                            initialValue={data?.asuultuud[field.name]?.asuult}
                            noStyle
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "khariult"]}
                            className="w-full"
                            rules={[
                              {
                                required: true,
                                message: "Үнэлгээ өгнө үү",
                              },
                            ]}
                          >
                            {data?.asuultuud[field.name]?.turul ===
                            "singleSelect" ? (
                              <Radio.Group className="flex flex-col">
                                {data?.asuultuud[field.name]?.khariultuud.map(
                                  (answer, index) => (
                                    <Radio key={index} value={answer}>
                                      {answer}
                                    </Radio>
                                  )
                                )}
                              </Radio.Group>
                            ) : data?.asuultuud[field.name]?.turul ===
                              "text" ? (
                              <Input />
                            ) : (
                              <Checkbox.Group className="flex flex-col">
                                {data?.asuultuud[field.name]?.khariultuud.map(
                                  (answer, index) => (
                                    <Checkbox key={index} value={answer}>
                                      {answer}
                                    </Checkbox>
                                  )
                                )}
                              </Checkbox.Group>
                            )}
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Form.List>
            <footer className="flex w-full justify-end border-t-2 px-3 pt-2 pb-5">
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="flex justify-center items-center gap-1"
                style={{ backgroundColor: "#209669", color: "#ffffff" }}
              >
                <SendOutlined />
                Илгээх
              </Button>
            </footer>
          </Form>
        </div>
      )}
      {garakhScreen && (
        <div className="flex h-screen w-full items-center justify-center pt-3">
          <div className="flex h-3/6 w-10/12 flex-col items-center justify-center rounded-xl bg-white bg-opacity-80 shadow-2xl dark:bg-gray-900 dark:bg-opacity-80 lg:w-8/12 2xl:w-6/12">
            <div className="h-40 w-40 animate-bounce">
              <img src="/assets/check.png" alt="Success" />
            </div>
            <p className="px-5 text-xl font-medium text-center">
              Таны мэдээлэл амжилттай илгээгдлээ, баярлалаа
            </p>
            <div className="mt-8">
              <Button
                onClick={() => window.close()}
                className="bg-green-400 text-white flex justify-center items-center"
              >
                Дуусгах
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnketBuglukh;
