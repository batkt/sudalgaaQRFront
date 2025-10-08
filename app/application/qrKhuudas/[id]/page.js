"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import QRCode from "qrcode.react";
import uilchilgee from "@/services/uilchilgee";

const page = () => {
  const [ajiltanData, setAjiltanData] = useState([]);
  useEffect(() => {
    const a = window.location.pathname.split("/");
    const ajiltniiId = a[a.length - 1];
    const fetchData = async () => {
      try {
        const response = await uilchilgee().get(
          `ajiltanIdgaarAvya/${ajiltniiId}`
        );
        setAjiltanData(response.data);
      } catch (error) {}
    };
    fetchData();
  }, []);
  return (
    <Nav>
      <div className="flex items-center justify-center gap-20">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-start justify-center gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h1 className="text-lg font-bold">{`${ajiltanData?.ovog} ${ajiltanData?.ner}`}</h1>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h1 className="text-lg font-bold">{`${ajiltanData?.tsol}`}</h1>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h1 className="text-lg font-bold">{`${ajiltanData?.tasag}`}</h1>
            </div>
          </div>
          <div className="flex items-center justify-center border w-fit h-fit">
            Zurag
          </div>
        </div>
        <div className="flex items-center justify-center">
          <QRCode
            // value="http://feedback.transportation.police.gov.mn/anket/646b56afc5ae265a7e4611ca/646cc4460744bece6baf087a"
            value="http://sudalgaa.zevtabs.mn/anket/646b56afc5ae265a7e4611ca/646cc4460744bece6baf087a"
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
      </div>
    </Nav>
  );
};

export default page;
