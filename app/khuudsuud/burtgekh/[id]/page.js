"use client";

import Nav from "@/components/Nav";
import { Button, Form, Input, message, Upload, Row, Col } from "antd";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import getBase64 from "@/tools/functions/getBase64";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";
import { useAuth } from "@/services/auth";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { url } from "@/services/uilchilgee";
import { useRouter, usePathname } from "next/navigation";

function beforeUpload(file, callback) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  callback(file);
  return true;
}

export default function burtgekh() {
  const router = useRouter();
  const pathName = usePathname();
  const zam = pathName.split("/");
  const id = zam[zam.length - 1];
  const [negAjiltan, setNegAjiltan] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await uilchilgee().get(`ajiltanIdgaarAvya/${id}`);
        setNegAjiltan(response.data);
      } catch (error) {}
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    form.setFieldsValue(negAjiltan);
  }, [negAjiltan]);

  const [qrData, setQrData] = useState([]);
  const [zurag, setZurag] = useState();
  const [qrUussenEsekh, setQrUussenEsekh] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const zuragRef = useRef(null);

  const { token } = useAuth();

  function butsya() {
    router.back();
  }

  function uurchlukh() {
    setLoading(true);
    const values = form.getFieldsValue();
    values.zurgiinId = zurag;
    uilchilgee(token)
      .put(`/ajiltan/${id}`, values)
      .then(({ data }) => {
        {
          zurag &&
            uilchilgee(token)
              .post("/confirmFile", {
                filename: zurag,
                path: "ajiltan",
              })
              .then((res) => {
                setZurag();
              })
              .catch((err) => {
                aldaaBarigch(err);
              });
        }
        if (data === "Amjilttai") {
          message.success("Амжилттай хадгалагдлаа!");
          router.push("/khuudsuud/ajiltniiJagsaalt");
        }
      })
      .catch((err) => {
        aldaaBarigch(err);
        setLoading(false);
      });
  }

  return (
    <Nav>
      <div className="relative w-[90vw] lg:w-full flex flex-col justify-center items-center pr-12">
        <h1 className="text-4xl font-bold text-gray-900 pb-4">
          Бүртгэл өөрчлөх
        </h1>
        <div className="flex mr-8 flex-col justify-center items-center w-[90vw] lg:w-full">
          <Form
            form={form}
            ref={ref}
            onFinish={uurchlukh}
            className="w-full max-w-[800px]"
            labelAlign="top"
            layout="vertical"
            autoComplete="off"
          >
            {!negAjiltan?.zurgiinId && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item name="zurgiinId" label="Зураг оруулах">
                    <Upload
                      showUploadList={false}
                      multiple={false}
                      name="file"
                      maxCount={1}
                      action={`${url}/upload`}
                      method="POST"
                      onChange={(v) => setZurag(v.file.response)}
                      beforeUpload={(file) => {
                        function handleChange(img) {
                          getBase64(img, (img) => (zuragRef.current.src = img));
                          zuragRef.current.classList.remove("hidden");
                        }
                        return beforeUpload(file, handleChange);
                      }}
                    >
                      <div className="flex flex-row space-x-1">
                        <div className="flex flex-row space-x-1">
                          {!zurag && (
                            <Button icon={<UploadOutlined />}>
                              Зураг оруулах
                            </Button>
                          )}
                          <img
                            ref={zuragRef}
                            width={200}
                            src=""
                            className="hidden"
                          />
                          {!!zurag && <Button icon={<EditOutlined />}></Button>}
                        </div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={8} lg={6}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Хувийн дугаар оруулна уу",
                    },
                  ]}
                  label="Нэвтрэх нэр / Дугаар"
                  name="nevtrekhNer"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={8} lg={6}>
                <Form.Item
                  normalize={(input) =>
                    input?.charAt(0).toUpperCase() + input?.slice(1)
                  }
                  label="Овог"
                  rules={[
                    {
                      required: true,
                      message: "Овог оруулна уу",
                    },
                  ]}
                  name="ovog"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={8} lg={6}>
                <Form.Item
                  normalize={(input) =>
                    input?.charAt(0).toUpperCase() + input?.slice(1)
                  }
                  label="Нэр"
                  rules={[
                    {
                      required: true,
                      message: "Нэр оруулна уу",
                    },
                  ]}
                  name="ner"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={8} lg={6}>
                <Form.Item
                  label="Регистр"
                  rules={[
                    {
                      required: true,
                      message: "Регистрийн дугаар оруулна уу",
                    },
                    {
                      len: 10,
                      pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                      message:
                        "Регистрийн формат  зөв оруулна уу! {ӨҮ00000000}",
                    },
                  ]}
                  name="register"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={8} lg={6}>
                <Form.Item
                  label="Утас"
                  rules={[
                    {
                      required: true,
                      message: "Утасны дугаар оруулна уу",
                    },
                    {
                      pattern: /^\d{8}$/,
                      message: "Утасны дугаар 8 оронтой байх ёстой",
                    },
                  ]}
                  name="utas"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Form.Item colon={false} label=" ">
          <div className="flex justify-end items-center gap-1 w-full">
            <Button onClick={butsya} type="default">
              Буцах
            </Button>
            <Button
              loading={loading}
              type="default"
              htmlType="submit"
              className="w-fit flex justify-end gap-2 bg-blue-500 text-white hover:text-white"
            >
              Хадгалах
            </Button>
          </div>
        </Form.Item>
      </div>
    </Nav>
  );
}
