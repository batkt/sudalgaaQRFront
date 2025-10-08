import { useRef } from "react";
import { Form, Select, Input } from "antd";
import { useAuth } from "@/services/auth";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";

const sudalgaaModal = ({ closeModal }) => {
  const ref = useRef();
  const [form] = Form.useForm();
  const { token } = useAuth();

  function khadgalakh() {
    const formData = form.getFieldsValue();
    uilchilgee(token).post('/asuult', formData)
      .then((response) => {
        closeModal();
      })
      .catch((error) => {
        aldaaBarigch(error);
      });
    closeModal();
  }

  return (
    <div className="absolute top-0 left-0 z-10">
      <div ref={ref} className="flex">
        <div
          onClick={closeModal}
          className="w-[80vw] h-screen bg-black opacity-75"
        />
        <div className="w-[20vw] h-screen bg-white">
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col">
              <div className="pl-8 h-[150px] flex items-center ">
                <h2 className="font-semibold">ШИНЭ СУДАЛГАА ОРУУЛАХ</h2>
              </div>
              <hr />
              <div className="h-full flex flex-col gap-4 w-fit pl-8 pt-8">
                <Form form={form} onFinish={khadgalakh} labelWrap>
                  <Form.Item label="Гарчиг" name="ner">
                    <Input type="text" placeholder="Гарчиг оруулна уу..." />
                  </Form.Item>
                  <Form.Item label="Төрөл">
                    <Select placeholder="Төрөл сонгоно уу...">
                      <Select.Option value="sudalgaa">Судалгааны</Select.Option>
                      <Select.Option value="ajiltan">Ажилтны</Select.Option>
                      <Select.Option value="irged">Иргэдийн</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className="pl-8 pb-8 flex justify-center items-center w-full gap-8">
              <button
                className="border rounded-2xl py-2 px-4"
                onClick={closeModal}
              >
                Гарах
              </button>
              <button
                className="border rounded-2xl py-2 px-4 bg-blue-500 text-white"
                onClick={khadgalakh}
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sudalgaaModal;
