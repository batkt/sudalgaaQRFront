"use client";

import Nav from "@/components/Nav";
import { Button, Form, Input, message, Upload } from "antd";
import { useRef, useState } from "react";
import QRCode from "qrcode.react";
import getBase64 from "@/tools/functions/getBase64";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";
import { useAuth } from "@/services/auth";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { url } from "@/services/uilchilgee";
import { useRouter } from "next/navigation";

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

  const [qrData, setQrData] = useState([]);
  const [zurag, setZurag] = useState();
  const [qrUussenEsekh, setQrUussenEsekh] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const zuragRef = useRef(null);

  const { token } = useAuth();

  function qrUusgey() {
    const values = form.getFieldsValue();
    const isFormComplete = Object.values(values).every(
      (value) => value !== undefined && value !== ""
    );
    if (!isFormComplete)
      return message.warning("Талбарууд зурагтай цуг гүйцэд бөглөж өгнө үү");
    if (qrUussenEsekh) return message.warning("QR үүссэн байна");
    uilchilgee(token)
      .post("/ajiltan")
      .then((response) => {
        setQrData(response.data);
        setQrUussenEsekh(true);
      })
      .catch((error) => {
        aldaaBarigch(error);
      });
  }

  function khadgalakh() {
    setLoading(true);
    const values = form.getFieldsValue();
    values.zurgiinId = zurag;
    uilchilgee(token)
      .post("/ajiltan", values)
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
      <div className="relative flex flex-col items-center justify-center w-full px-0 md:flex-row">
        <h1 className="gap-2 text-4xl font-bold text-gray-900">Бүртгэх</h1>
        <div className="flex flex-col items-center justify-center w-full">
          <Form
            form={form}
            ref={ref}
            onFinish={khadgalakh}
            className="relative w-full max-w-4xl"
            style={{ rowGap: "4px" }}
            labelCol={{ xs: 24, sm: 24, md: 9 }}
            wrapperCol={{ xs: 24, sm: 24, md: 16 }}
            labelAlign="right"
            layout={{ xs: "vertical", sm: "vertical", md: "horizontal" }}
            autoComplete="off"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:gap-0">
              <Form.Item
                name="zurgiinId"
                className="mb-4 col-span-full md:col-span-1"
                colon={false}
                label={
                  <div className="flex items-center pt-3 space-x-5">
                    <span>Зураг оруулах:</span>
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
                          getBase64(img, (base64Img) => {
                            zuragRef.current.src = base64Img;
                            zuragRef.current.classList.remove("hidden");
                          });
                        }
                        return beforeUpload(file, handleChange);
                      }}
                    >
                      <Button
                        size="small"
                        className="px-1 py-10"
                        icon={zurag ? <EditOutlined /> : <UploadOutlined />}
                      >
                        {zurag ? "Засах" : "Зураг оруулах"}
                      </Button>
                    </Upload>
                  </div>
                }
              >
                <img
                  ref={zuragRef}
                  width={200}
                  src=""
                  alt="Зураг"
                  className="hidden mt-2 border rounded shadow"
                />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Хувийн дугаар оруулна уу",
                  },
                ]}
                label="Нэвтрэх нэр / Хувийн дугаар"
                name="nevtrekhNer"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

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
                className="col-span-1"
              >
                <Input />
              </Form.Item>

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
                className="col-span-1"
              >
                <Input />
              </Form.Item>

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
                    message: "Регистрийн формат  зөв оруулна уу! {ӨҮ00000000}",
                  },
                ]}
                name="register"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

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
                className="col-span-1"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Нэр дуудлага"
                rules={[
                  {
                    required: true,
                    message: "Нэр дуудлага оруулна уу",
                  },
                ]}
                name="porool"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Цол"
                rules={[
                  {
                    required: true,
                    message: "Цол оруулна уу",
                  },
                ]}
                name="tsol"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Албан тушаал"
                rules={[
                  {
                    required: true,
                    message: "Албан тушаал оруулна уу",
                  },
                ]}
                name="albanTushaal"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Дүүрэг"
                rules={[
                  {
                    required: true,
                    message: "Дүүрэг оруулна уу",
                  },
                ]}
                name="duureg"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Хэлтэс"
                rules={[
                  {
                    required: true,
                    message: "Хэлтэс оруулна уу",
                  },
                ]}
                name="kheltes"
                className="col-span-1"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Тасаг"
                rules={[
                  {
                    required: true,
                    message: "Тасаг оруулна уу",
                  },
                ]}
                name="tasag"
                className="col-span-1"
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex flex-col items-end w-full px-4">
              <Form
                form={form}
                ref={ref}
                onFinish={khadgalakh}
                className="w-full max-w-4xl"
                labelCol={{ xs: 24, sm: 24, md: 9 }}
                wrapperCol={{ xs: 24, sm: 24, md: 16 }}
                labelAlign="right"
                layout={{ xs: "vertical", sm: "vertical", md: "horizontal" }}
                autoComplete="off"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 md:gap-0">
                  <Form.Item colon={false} label=" " className="mt-6">
                    <div className="flex flex-row items-center justify-end gap-4">
                      <Button
                        onClick={qrUusgey}
                        type="default"
                        className="w-full sm:w-auto"
                      >
                        QR үүсгэх
                      </Button>
                      <Button
                        loading={loading}
                        type="default"
                        htmlType="submit"
                        className="flex justify-center w-full text-white bg-blue-500 sm:w-auto hover:text-white"
                      >
                        Хадгалах
                      </Button>
                    </div>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </Form>
        </div>

        {qrUussenEsekh && (
          <div className="mt-6 md:absolute md:right-[5%] md:top-1/2 md:transform md:-translate-y-1/2">
            <QRCode
              // value={`http://feedback.transportation.police.gov.mn/anket/${qrData._id}`}
              value={`http://qr.zevtabs.mn/anket/${qrData._id}`}
              renderAs="svg"
              level="H"
              size={200}
              imageSettings={{
                src: "/assets/shuukhLogo.webp",
                excavate: true,
                height: 40,
                width: 40,
              }}
            />
          </div>
        )}
      </div>
    </Nav>
  );
}
