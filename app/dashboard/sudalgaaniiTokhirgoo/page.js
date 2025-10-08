"use client";

import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { useTokhirgoo } from "@/hook/useTokhirgoo";
import { useAuth } from "@/services/auth";
import uilchilgeeService from "@/services/uilchilgee";

const SudalgaaniiTokhirgoo = () => {
  const { token } = useAuth();
  const [badThreshold, setBadThreshold] = useState(0);
  const [goodThreshold, setGoodThreshold] = useState(0);
  const [alert, setAlert] = useState("");

  const { msgTokhirgoo: onooTokhirgoo, saveMsgTokhirgoo: setOnooTokhirgoo } =
    useTokhirgoo(token, "onooTokhirgoo");

  useEffect(() => {
    if (onooTokhirgoo) {
      setBadThreshold(onooTokhirgoo.surugBosgo || 0);
      setGoodThreshold(onooTokhirgoo.eyregBosgo || 0); 
    }
  }, [onooTokhirgoo]);

  const handleSave = async () => {
    const badT = Number(badThreshold) || 0;
    const goodT = Number(goodThreshold) || 0;
    

    if (badT > goodT) {
      setAlert("Сөрөг босго эерэг босгоос их байж болохгүй.");
      window.setTimeout(() => setAlert(""), 2500);
      return;
    }

    if (!token) {
      setAlert("Нэвтрэх шаардлагатай.");
      window.setTimeout(() => setAlert(""), 3000);
      return;
    }

    try {
      const uilchilgee = uilchilgeeService(token);


      const result = await setOnooTokhirgoo(token, {
        surugBosgo: badT, 
        eyregBosgo: goodT, 
      });


      setAlert("Амжилттай хадгаллаа");
      window.setTimeout(() => setAlert(""), 2000);
    } catch (e) {
  

      if (e?.response?.data?.aldaa) {
        setAlert(`Алдаа: ${e.response.data.aldaa}`);
      } else if (e?.message) {
        setAlert(`Алдаа: ${e.message}`);
      } else {
        setAlert("Сервертэй холбогдох үед алдаа гарлаа.");
      }
      window.setTimeout(() => setAlert(""), 5000);
    }
  };

  return (
    <Nav>
      <div className="max-w-3xl p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-semibold">Оноо тохиргоо</h1>

        <div className="p-6 mb-6 bg-white border rounded-lg">
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Сөрөг босго
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={badThreshold || ""}
                onChange={(e) => setBadThreshold(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-600">
                Эерэг босго
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={goodThreshold || ""}
                onChange={(e) => setGoodThreshold(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Хадгалах
            </button>
          </div>
        </div>

        {alert && (
          <div
            className={`px-4 py-3 mb-4 border rounded-md ${
              alert.includes("алдаа")
                ? "text-red-800 border-red-200 bg-red-50"
                : "text-green-800 border-green-200 bg-green-50"
            }`}
          >
            {alert}
          </div>
        )}
      </div>
    </Nav>
  );
};

export default SudalgaaniiTokhirgoo;
