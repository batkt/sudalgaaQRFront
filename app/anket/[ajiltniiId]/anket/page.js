"use client";

import { CloseCircleFilled, SendOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Radio, Checkbox } from "antd";
import { useState, useEffect } from "react";
import uilchilgee, { aldaaBarigch, url } from "@/services/uilchilgee";
import { usePathname } from "next/navigation";
import styles from "@/styles/Loading.module.css";
import { useTulkhuurUg } from "/hook/useTulkhuurUg";
import { useAuth } from "/services/auth";
import { useTokhirgoo } from "/hook/useTokhirgoo";

function AnketBuglukh() {
  const [form] = Form.useForm();
  const [garakhScreen, setGarakhScreen] = useState(false);
  const [asuultData, setAsuultData] = useState(null);
  const [ajiltanData, setAjiltanData] = useState(null);
  const [unshijBaina, setUnshijBaina] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();
  const { token } = useAuth();
  const { tulkhuurUgGaralt } = useTulkhuurUg(token);
  const { msgTokhirgoo: onooTokhirgoo } = useTokhirgoo(token, "onooTokhirgoo");

  useEffect(() => {
    if (tulkhuurUgGaralt?.jagsaalt) {
      const badWords = tulkhuurUgGaralt.jagsaalt.filter(
        (k) => k.turul === "Muu"
      );
    }
  }, [tulkhuurUgGaralt]);

  const a = pathName.split("/");
  const ajiltniiId = a[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await uilchilgee().get(`/asuultIdevkhteiIAvya`);
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

  const detectBadWords = (text) => {
    if (!text || !tulkhuurUgGaralt?.jagsaalt) return false;

    const badKeywords = tulkhuurUgGaralt.jagsaalt.filter(
      (k) => k.turul === "Muu" && k.ankhaarakhEsekh === true
    );
    if (badKeywords.length === 0) return false;

    const badWords = badKeywords.map((k) => k.tailbar?.trim()).filter(Boolean);
    if (badWords.length === 0) return false;

    // For Mongolian text, use a simpler approach without word boundaries
    const escapedWords = badWords.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const pattern = new RegExp(`(${escapedWords.join("|")})`, "gi");

    return pattern.test(text);
  };

  const calculateScore = (values) => {
    if (!values?.asuultuud || !onooTokhirgoo) {
      return { score: 0, message: "" };
    }

    let totalScore = 0;
    let scoredQuestions = 0;
    const scores = [];

    values.asuultuud.forEach(({ khariult, asuult }, index) => {
      if (khariult && typeof khariult === "string") {
        // Try to extract number from the answer (assuming answers are like "1", "2", "3", etc.)
        const match = khariult.match(/(\d+)/);
        if (match) {
          const score = parseInt(match[1], 10);
          if (score >= 1 && score <= 5) {
            totalScore += score;
            scoredQuestions++;
            scores.push({ question: asuult, answer: khariult, score });
          }
        }
      }
    });

    const negativeThreshold = onooTokhirgoo.surugBosgo || 0;
    const positiveThreshold = onooTokhirgoo.eyregBosgo || 0;

    let message = "";
    if (totalScore <= negativeThreshold) {
      message = `Таны үнэлгээ ${totalScore} оноо. Энэ нь сөрөг босго (${negativeThreshold})-аас бага байна.`;
    } else if (totalScore >= positiveThreshold) {
      message = `Таны үнэлгээ ${totalScore} оноо. Энэ нь эерэг босго (${positiveThreshold})-аас дээш байна.`;
    }

    return { score: totalScore, message };
  };

  function anketIlgeeye(khariult) {
    uilchilgee()
      .post("/khariultKhadgalya", khariult)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setGarakhScreen(true);
          notification.success({ message: "Анкет Амжилттай илгээлээ" });
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
    const allText = [
      values.tailbar || "",
      ...values.asuultuud.map(({ khariult }) => khariult || ""),
    ].join(" ");

    const hasBadWords = detectBadWords(allText);

    // Calculate score and check thresholds
    const { score, message } = calculateScore(values);
    const hasLowScore =
      score > 0 && onooTokhirgoo && score <= (onooTokhirgoo.surugBosgo || 0);


    const khariult = {
      ajiltan: ajiltanData,
      asuultiinId: data._id,
      asuultiinNer: data.ner,
      asuultiinTurul: data.turul,
      utas: values.utas,
      ognoo: new Date(),
      khariultuud: values.asuultuud.map(({ asuult, khariult, turul }, index) => {
        // Map input types to question categories
        const inputType = data?.asuultuud[index]?.turul || "";
        let questionCategory = "";
        
        if (inputType === "radioSelect" || inputType === "singleselect" || inputType === "radio") {
          questionCategory = "Оноо өгөх";
        } else if (inputType === "text" || inputType === "textarea") {
          questionCategory = "Сэтгэгдэл";
        } else if (inputType === "checkbox" || inputType === "multiselect") {
          questionCategory = "Олон сонголт";
        } else {
          questionCategory = "Бусад";
        }
        
        return {
          asuult,
          khariult,
          sudalgaaniiTurul: questionCategory,
        };
      }),
      tailbar: values.tailbar,
      surugEsekh: hasBadWords || hasLowScore,
      onoo: score,
      onooMessage: message,
    };

    // Show score message if available (commented out as requested)
    // if (message) {
    //   notification.info({
    //     message: "Үнэлгээний дүн",
    //     description: message,
    //     duration: 5,
    //   });
    // }

    anketIlgeeye(khariult);
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
      <div className="flex justify-center items-center pt-3 w-full h-screen">
        <div className="flex flex-col justify-center items-center w-10/12 h-3/6 bg-white bg-opacity-80 rounded-xl shadow-2xl dark:bg-gray-900 dark:bg-opacity-80 lg:w-8/12 2xl:w-6/12">
          <p className="flex gap-2 justify-center items-center px-5 text-xl font-medium text-center">
            <CloseCircleFilled className="text-red-400" />
            Уучлаарай, ажилтны мэдээлэл байхгүй байна!
          </p>
          <div className="mt-8">
            <Button
              onClick={() => window.close()}
              className="flex justify-center items-center text-white bg-red-400"
            >
              Хаах
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-5 w-full h-full bg-gray-200 dark:bg-gray-800 md:py-12 lg:py-20">
      {!garakhScreen && data && (
        <div className="block pt-3 w-11/12 h-full bg-white rounded-lg shadow-2xl dark:bg-gray-900 sm:w-10/12 sm:p-5 md:w-8/12 lg:w-6/12 2xl:w-4/12">
          <div className="block relative p-6 pt-3 mb-12 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2 justify-center items-start w-full">
                <span>Овог : {ajiltanData.ovog}</span>
                <span>Нэр : {ajiltanData.ner}</span>
                <span>Цол : {ajiltanData.tsol}</span>
                <span className="truncate whitespace-normal">
                  Тасаг : {ajiltanData.tasag}
                </span>
                <span className="truncate whitespace-normal">
                  Хэлтэс : {ajiltanData.kheltes}
                </span>
              </div>
              <div className="flex overflow-hidden justify-center items-center w-full h-full rounded-full border">
                <img
                  className="w-[150px] h-[150px] object-contain"
                  src={`${url}/file?path=ajiltan/${ajiltanData?.zurgiinId}`}
                />
              </div>
            </div>
          </div>
          <header className="px-3 text-xl font-medium uppercase border-b-2">
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
            className="block overflow-y-auto pt-5 h-5/6"
            layout="vertical"
          >
            <div className="flex flex-col gap-2 px-6 py-2 pb-3 dark:text-gray-200 sm:px-10">
              <Form.Item
                name="utas"
                label="Утасны дугаараа үлдээнэ үү"
                rules={[
                  {
                    required: true,
                    message: "Утасны дугаараа үлдээнэ үү",
                  },
                ]}
              >
                <Input type="text" />
              </Form.Item>
            </div>
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
                            hidden
                            name={[field.name, "turul"]}
                            initialValue={data?.asuultuud[field.name]?.turul}
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
                                message: "Анкетаа бүрэн бөгөлнө үү",
                              },
                            ]}
                          >
                            {(() => {
                              const rawType =
                                data?.asuultuud[field.name]?.turul || "";
                              const type = String(rawType).toLowerCase();

                              // Single select types (radio buttons)
                              if (
                                type === "singleselect" ||
                                type === "single" ||
                                type === "radioselect" ||
                                type === "radio"
                              ) {
                                return (
                                  <Radio.Group className="flex flex-row flex-wrap gap-4">
                                    {data?.asuultuud[
                                      field.name
                                    ]?.khariultuud.map((answer, index) => (
                                      <Radio key={index} value={answer}>
                                        {answer}
                                      </Radio>
                                    ))}
                                  </Radio.Group>
                                );
                              }

                              // Multi select types (checkboxes)
                              if (
                                type === "multiselect" ||
                                type === "multi" ||
                                type === "checkbox" ||
                                type === "checkboxes"
                              ) {
                                return (
                                  <Checkbox.Group className="flex flex-col">
                                    {data?.asuultuud[
                                      field.name
                                    ]?.khariultuud.map((answer, index) => (
                                      <Checkbox key={index} value={answer}>
                                        {answer}
                                      </Checkbox>
                                    ))}
                                  </Checkbox.Group>
                                );
                              }

                              // Default to text input
                              return <Input />;
                            })()}
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Form.List>
            <div className="flex flex-col gap-2 px-6 py-2 pb-3 dark:text-gray-200 sm:px-10">
              <Form.Item
                name="tailbar"
                label="Саналыг хэрхэн шийдвэрлэсэн талаар танд утас болон мэйл хаягаар хариу өгөх тул энд холбогдох мэдээллээ өгнө үү.
              Тухайн алба хаагчийн харилцаа, хандлагын талаар дэлгэрэнгүй мэдээллээ та бичнэ үү.
              /500 тэмдэгтэд багтаах/"
                rules={[
                  {
                    required: true,
                    message: "Тайлбар оруулж өгнө үү",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </div>
            <footer className="flex justify-end px-3 pt-2 pb-5 w-full border-t-2">
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="flex gap-1 justify-center items-center"
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
        <div className="flex justify-center items-center pt-3 w-full h-screen">
          <div className="flex flex-col justify-center items-center w-10/12 h-3/6 bg-white bg-opacity-80 rounded-xl shadow-2xl dark:bg-gray-900 dark:bg-opacity-80 lg:w-8/12 2xl:w-6/12">
            <div className="w-40 h-40 animate-bounce">
              <img src="/assets/check.png" alt="Success" />
            </div>
            <p className="px-5 text-xl font-medium text-center">
              Таны мэдээлэл амжилттай илгээгдлээ, баярлалаа
            </p>
            <div className="mt-8">
              <Button
                onClick={() => window.close()}
                className="flex justify-center items-center text-white bg-green-400"
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
