"use client";

import { IoMdRefresh } from "react-icons/io";
import { BiRefresh, BiTrash } from "react-icons/bi";
import { BsCheckCircle, BsPlusCircle } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { Form, Input, Select, Button, message, Radio } from "antd";
import Nav from "@/components/Nav";
import { useAuth } from "@/services/auth";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";
import { useRouter, usePathname } from "next/navigation";
import {
  CloseCircleOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function Item() {
  const [asuultData, setAsuultData] = useState(null);
  const [shineTurul, setShineTurul] = useState("sudalgaanii");
  const [asuultDataEsekh, setAsuultDataEsekh] = useState(false);
  const [unshijBaina, setUnshijBaina] = useState(false);
  const [indexAsuultTurul, setIndexAsuultTurul] = useState([]);
  const [form] = Form.useForm();
  const ref = useRef();
  const router = useRouter();
  const pathName = usePathname();
  const zam = pathName.split("/");
  const id = zam[zam.length - 1];
  const huvisdagNer = Form.useWatch("ner", form);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const defaultOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { token, nevtersenAjiltanErkh } = useAuth();

  const asuultTurul = (index, val) => {
    var addTurul = [{ key: index, value: val }];
    if (indexAsuultTurul?.length > 0)
      addTurul.push(...indexAsuultTurul?.filter((a) => a.key !== index));
    setIndexAsuultTurul(addTurul);
  };

  useEffect(() => {
    if (id !== "new") {
      const fetchData = async () => {
        try {
          const response = await uilchilgee().get(`/asuultIdgaarAvya/${id}`);
          setAsuultData(response.data);
          if (response.data) {
            setAsuultDataEsekh(true);
          }
          form.setFieldsValue({ ...response.data });
          if (response.data?.turul) setShineTurul(response.data?.turul);

          var tempTurul = [];
          response.data?.asuultuud.forEach((element, index) => {
            var filter = indexAsuultTurul?.filter((a) => a.key !== index);
            if (filter?.length === 0)
              tempTurul.push({ key: index, value: element.turul });
          });
          setIndexAsuultTurul(tempTurul);
        } catch (error) {
          aldaaBarigch(error);
        }
      };
      fetchData();
    }
  }, [id]);

  const onFinish = (values) => {
    let maxPossibleScore = 0;
    if (values?.asuultuud) {
      values.asuultuud.forEach((question, index) => {
        if (question.turul === "singleSelect" || question.turul === "radioSelect") {
          maxPossibleScore += 5;
        }
      });
    }
    
    setUnshijBaina(true);
    if (!values) {
      message.warning("Хоосон утгатай байна");
      setUnshijBaina(false);
      return;
    }
    if (!values.asuultuud || !values.asuultuud.length) {
      message.warning("Асуулт оруулна уу");
      setUnshijBaina(false);
      return;
    }
    if (!asuultDataEsekh) {
      uilchilgee(token)
        .post("/asuult", values)
        .then((response) => {
          if (response.data === "Amjilttai") {
            ref.current.resetFields();
            message.success("Амжилттай хадгалагдлаа!");
            router.back();
          }
        })
        .catch((error) => {
          aldaaBarigch(error);
          setUnshijBaina(false);
        });
    }
    if (!!asuultDataEsekh) {
      uilchilgee(token)
        .put(`/asuult/${id}`, values)
        .then((response) => {
          if (response.data === "Amjilttai") {
            ref.current.resetFields();
            message.success("Амжилттай хадгалагдлаа!");
            router.back();
          }
        })
        .catch((error) => {
          aldaaBarigch(error);
          setUnshijBaina(false);
        });
    }
  };

  return (
    <Nav>
      <div className="flex justify-center items-center lg:pr-[295px] relative">
        <button
          onClick={toggleSidebar}
          className="fixed top-6 right-1 z-[1001] flex items-center justify-center drawer-toggle lg:hidden"
        >
          {sidebarOpen ? (
            <CloseOutlined className="flex items-center justify-center w-12 h-12 text-gray-700" />
          ) : (
            <MenuOutlined className="flex items-center justify-center w-12 h-12 text-gray-700" />
          )}
        </button>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[999] lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        <div className="flex flex-col w-full gap-4 px-4 lg:px-0">
          <div className="flex flex-col justify-between w-full gap-4 lg:flex-row">
            <div className="flex flex-col w-full p-4 bg-white lg:w-1/3 h-fit rounded-xl">
              <h1 className="pb-4">Судалгаа</h1>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Гарчиг</p>
                  <h2 className="text-sm">{huvisdagNer}</h2>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Төрөл</p>
                  <h2 className="text-sm">
                    {asuultData?.turul
                      ? asuultData?.turul === "sudalgaanii"
                        ? "Судалгааны"
                        : asuultData?.turul === "ajiltnii"
                        ? "Ажилтны"
                        : "Иргэдийн"
                      : shineTurul === "sudalgaanii"
                      ? "Судалгааны"
                      : shineTurul === "ajiltnii"
                      ? "Ажилтны"
                      : "Иргэдийн"}
                  </h2>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-500">Огноо</p>
                  <h2 className="text-sm">
                    {asuultData?.createdAt
                      ? moment(asuultData.createdAt).format("YYYY/MM/DD")
                      : moment(new Date()).format("YYYY/MM/DD")}
                  </h2>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <div className="flex flex-col items-stretch justify-start">
                <Form
                  form={form}
                  ref={ref}
                  disabled={
                    nevtersenAjiltanErkh !== "superAdmin" &&
                    nevtersenAjiltanErkh !== "admin"
                  }
                  labelAlign="left"
                  labelWrap
                  onFinish={onFinish}
                  labelCol={{ span: 5 }}
                  autoComplete="off"
                  className="p-4 bg-white rounded-xl"
                >
                  <div className="flex flex-col items-center justify-between w-full gap-4 lg:flex-row">
                    <Form.Item
                      label={<span className="text-lg">Гарчиг</span>}
                      name="ner"
                      className="w-full"
                      rules={[
                        {
                          required: true,
                          message: "Судалгааны гарчиг оруулна уу",
                        },
                      ]}
                    >
                      <Input placeholder="Гарчиг оруулна уу..." type="text" />
                    </Form.Item>
                    <Form.Item
                      name="turul"
                      label={<span className="text-lg">Төрөл</span>}
                      className="w-full"
                      initialValue="sudalgaanii"
                    >
                      <Select
                        onChange={(v) => setShineTurul(v)}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="sudalgaanii">
                          Судалгааны
                        </Select.Option>
                        <Select.Option value="ajiltnii">Ажилтны</Select.Option>
                        <Select.Option value="irgediin">Иргэдийн</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <Form.List name="asuultuud">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => {
                            const currentQuestionType =
                              indexAsuultTurul?.find((a) => a.key === index)
                                ?.value || "text";

                            return (
                              <div
                                className="relative p-4 border rounded-lg shadow-md lg:p-8"
                                key={field.key}
                              >
                                <Form.Item
                                  label={`Асуулт ${index + 1}`}
                                  name={[field.name, "asuult"]}
                                  fieldKey={[field.fieldKey, "asuult"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Асуулт оруулна уу",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Асуултаа оруулна уу" />
                                </Form.Item>

                                <Form.Item
                                  label="Төрөл"
                                  name={[field.name, "turul"]}
                                  fieldKey={[field.fieldKey, "turul"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Төрөл оруулна уу",
                                    },
                                  ]}
                                  initialValue="text"
                                >
                                  <Select
                                    defaultValue="text"
                                    onChange={(e) => asuultTurul(index, e)}
                                  >
                                    <Select.Option value="text">
                                      Бөглөх
                                    </Select.Option>
                                    <Select.Option value="singleSelect">
                                      Нэгийг сонгох
                                    </Select.Option>
                                    <Select.Option value="radioSelect">
                                      Оноо өгөх
                                    </Select.Option>
                                  </Select>
                                </Form.Item>

                                {currentQuestionType === "singleSelect" && (
                                  <Form.List
                                    name={[field.name, "khariultuud"]}
                                    rules={[
                                      {
                                        validator: (_, value) => {
                                          if (!value || value.length === 0) {
                                            message.warning(
                                              "Хариулт оруулна уу"
                                            );
                                            return Promise.reject();
                                          }
                                          return Promise.resolve();
                                        },
                                      },
                                    ]}
                                  >
                                    {(
                                      subFields,
                                      { add: addSub, remove: removeSub }
                                    ) => (
                                      <>
                                        {subFields.map((subField, subIndex) => (
                                          <div
                                            className="relative"
                                            key={subField.key}
                                          >
                                            <Form.Item
                                              label={`Хариулт ${subIndex + 1}`}
                                              name={[subField.name]}
                                              fieldKey={[subField.fieldKey]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Хариулт талбар хоосон байна",
                                                },
                                              ]}
                                            >
                                              <Input type="text" />
                                            </Form.Item>
                                            <Button
                                              icon={<BiTrash />}
                                              onClick={() =>
                                                removeSub(subIndex)
                                              }
                                              className="absolute top-0 right-0 text-red-600"
                                            />
                                          </div>
                                        ))}
                                        <div className="flex items-center justify-center">
                                          <Button
                                            type="default"
                                            onClick={() => addSub()}
                                            className="flex items-center gap-2"
                                          >
                                            <BsPlusCircle /> Хариулт нэмэх
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </Form.List>
                                )}

                                {currentQuestionType === "multiSelect" && (
                                  <Form.List
                                    name={[field.name, "khariultuud"]}
                                    rules={[
                                      {
                                        validator: (_, value) => {
                                          if (!value || value.length === 0) {
                                            message.warning(
                                              "Хариулт оруулна уу"
                                            );
                                            return Promise.reject();
                                          }
                                          return Promise.resolve();
                                        },
                                      },
                                    ]}
                                  >
                                    {(
                                      subFields,
                                      { add: addSub, remove: removeSub }
                                    ) => (
                                      <>
                                        <div className="mb-4">
                                          <p className="mb-2 text-sm font-medium">
                                            Сонголтууд:
                                          </p>
                                        </div>
                                        {subFields.map((subField, subIndex) => (
                                          <div
                                            className="relative"
                                            key={subField.key}
                                          >
                                            <Form.Item
                                              label={`Сонголт ${subIndex + 1}`}
                                              name={[subField.name]}
                                              fieldKey={[subField.fieldKey]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Сонголт хоосон байна",
                                                },
                                              ]}
                                            >
                                              <Input
                                                placeholder="Сонголт оруулна уу"
                                                type="text"
                                              />
                                            </Form.Item>
                                            <Button
                                              icon={<BiTrash />}
                                              onClick={() =>
                                                removeSub(subIndex)
                                              }
                                              className="absolute top-0 right-0 text-red-600"
                                            />
                                          </div>
                                        ))}
                                        <div className="flex items-center justify-center">
                                          <Button
                                            type="default"
                                            onClick={() => addSub()}
                                            className="flex items-center gap-2"
                                          >
                                            <BsPlusCircle /> Сонголт нэмэх
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </Form.List>
                                )}

                                {currentQuestionType === "radioSelect" && (
                                  <Form.List
                                    name={[field.name, "khariultuud"]}
                                    rules={[
                                      {
                                        validator: (_, value) => {
                                          if (!value || value.length === 0) {
                                            message.warning(
                                              "Хариулт оруулна уу"
                                            );
                                            return Promise.reject();
                                          }
                                          return Promise.resolve();
                                        },
                                      },
                                    ]}
                                  >
                                    {(
                                      subFields,
                                      { add: addSub, remove: removeSub }
                                    ) => (
                                      <>
                                        <div className="mb-4">
                                          <p className="mb-2 text-sm font-medium">
                                            Оноо сонголтууд:
                                          </p>
                                        </div>
                                        {subFields.map((subField, subIndex) => (
                                          <div
                                            className="relative"
                                            key={subField.key}
                                          >
                                            <Form.Item
                                              label={`Сонголт ${subIndex + 1}`}
                                              name={[subField.name]}
                                              fieldKey={[subField.fieldKey]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Сонголт хоосон байна",
                                                },
                                              ]}
                                            >
                                              <Input
                                                placeholder="Сонголт оруулна уу (жишээ: 1 - Маш муу)"
                                                type="radioselect"
                                              />
                                            </Form.Item>
                                            <Button
                                              icon={<BiTrash />}
                                              onClick={() =>
                                                removeSub(subIndex)
                                              }
                                              className="absolute top-0 right-0 text-red-600"
                                            />
                                          </div>
                                        ))}
                                        <div className="flex items-center justify-center">
                                          <Button
                                            type="default"
                                            onClick={() => addSub()}
                                            className="flex items-center gap-2"
                                          >
                                            <BsPlusCircle /> Сонголт нэмэх
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </Form.List>
                                )}

                                <div
                                  className="absolute flex items-center justify-center w-6 h-6 text-gray-500 top-2 right-2 hover:text-gray-800"
                                  onClick={() => remove(field.name)}
                                >
                                  <CloseCircleOutlined
                                    style={{ fontSize: "20px" }}
                                  />
                                </div>
                              </div>
                            );
                          })}

                          <Button
                            type="default"
                            onClick={() => add()}
                            className="flex items-center justify-center gap-2"
                          >
                            <BsPlusCircle /> Асуулт нэмэх
                          </Button>
                        </>
                      )}
                    </Form.List>

                    <Form.Item className="flex justify-end">
                      <Button
                        type="default"
                        htmlType="submit"
                        loading={unshijBaina}
                      >
                        Хадгалах
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`
            fixed z-[1000] top-0 right-0 h-full p-4 bg-white text-gray-500 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
            w-full max-w-sm
            lg:translate-x-0 lg:top-[100px] lg:w-[295px] lg:h-[calc(100vh-100px)] lg:rounded-l-xl lg:max-w-[295px] lg:pr-12
          `}
        >
          <div className="fixed z-[2] top-[100px] right-0 w-[295px] h-[calc(100vh-100px)] p-4 pr-12 bg-white rounded-l-xl text-gray-500">
            <div className="flex flex-col w-full h-full gap-4">
              <div className="flex flex-col">
                <div className="pb-4 text-xs">
                  <p>Судалгаа</p>
                </div>
                <div className="flex items-center justify-between px-2 py-1 pb-3 text-sm transition-colors rounded cursor-pointer hover:bg-gray-50">
                  <a className="flex items-center justify-center gap-2">
                    <IoMdRefresh className="text-lg" />
                    <p>Нийт</p>
                  </a>
                  <span>{"1"}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 pb-3 text-sm transition-colors rounded cursor-pointer hover:bg-gray-50">
                  <a className="flex items-center justify-center gap-2">
                    <BiRefresh className="text-lg" />
                    <p>Идэвхтэй</p>
                  </a>
                  <span>{"1"}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 pb-3 text-sm transition-colors rounded cursor-pointer hover:bg-gray-50">
                  <a className="flex items-center justify-center gap-2">
                    <BsCheckCircle />
                    <p>Дууссан</p>
                  </a>
                  <span>{"0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Nav>
  );
}
