import React, { useEffect, useImperativeHandle, useState } from "react";
import { Input, message, Modal } from "antd";
import createMethod from "tools/functions/crud/createMethod";
import updateMethod from "tools/functions/crud/updateMethod";
import _ from "lodash";

function ZardalMur({
  zardal,
  dedBulegNemekh,
  zardalNemekh,
  murUstgaya,
  onChangeZardal,
  defaultZam = "",
  index,
  realZam,
  t,
}) {
  const zam = defaultZam || "";
  const [showDed, setShowDed] = useState(true);

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full flex-row space-x-4 dark:text-white">
        <div
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-center dark:text-gray-200 ${
            zardal.dedKhesguud ? (showDed ? "border " : "border ") : ""
          }`}
          onClick={() => setShowDed(!showDed)}
        >
          {zardal.dedKhesguud ? (showDed ? "-" : "+") : ""}
        </div>
        <div
          className="flex items-center rounded-sm px-2"
          style={{ width: `calc(100% - ${zam !== "" ? "6" : "3"}rem)` }}
        >
          <Input
            id="zardalMurInput"
            placeholder={t("Нэр")}
            value={zardal.ner}
            style={{ width: "100%" }}
            onChange={(e) => onChangeZardal(e, zam)}
          />
        </div>
        <div
          className="ml-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-center"
          onClick={() => {
            if (zardal?.dedKhesguud?.length > 0) zardalNemekh(zam);
            else dedBulegNemekh(zam);
          }}
        >
          +
        </div>
        {zam !== "" && (
          <div
            className="ml-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-center"
            onClick={() => murUstgaya(index, realZam)}
          >
            -
          </div>
        )}
      </div>
      {showDed && zardal.dedKhesguud && (
        <div className="w-full pl-12">
          <Zardal
            zardaluud={zardal.dedKhesguud}
            dedBulegNemekh={dedBulegNemekh}
            zardalNemekh={zardalNemekh}
            murUstgaya={murUstgaya}
            onChangeZardal={onChangeZardal}
            zam={zam + (zam === "" ? "" : ".") + "dedKhesguud"}
            t={t}
          />
        </div>
      )}
    </div>
  );
}

function Zardal({
  zardaluud,
  dedBulegNemekh,
  zardalNemekh,
  murUstgaya,
  onChangeZardal,
  zam,
  t,
}) {
  return (
    <div className="w-full space-y-4">
      {zardaluud?.map((a, i) => (
        <ZardalMur
          key={a?._id}
          zardal={a}
          index={i}
          dedBulegNemekh={dedBulegNemekh}
          zardalNemekh={zardalNemekh}
          murUstgaya={murUstgaya}
          onChangeZardal={onChangeZardal}
          realZam={zam}
          defaultZam={zam + `.${i}`}
          t={t}
        />
      ))}
    </div>
  );
}

function ZardalBurtgekh({ data = {}, token, destroy, onRefresh, t }, ref) {
  const [zardal, setZardal] = useState(data);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const method = zardal?._id ? updateMethod : createMethod;
        method("zardal", token, zardal).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
            onRefresh && onRefresh();
            destroy();
          }
        });
      },
      khaaya() {
        destroy();
      },
    }),
    [zardal]
  );

  function garya() {
    if (zardal !== data)
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [zardal]);

  useEffect(() => {
    document.getElementById("zardalMurInput")?.focus();
  }, []);

  function onChangeZardal({ target }, zam) {
    _.set(zardal, zam + (zam === "" ? "" : ".") + "ner", target.value);
    setZardal({ ...zardal });
  }

  function dedBulegNemekh(zam) {
    _.set(zardal, zam + (zam === "" ? "" : ".") + "dedKhesguud", [
      { ner: t("Бүлэг") },
    ]);
    setZardal({ ...zardal });
  }

  function murUstgaya(index, zam) {
    const jagsaalt = _.get(zardal, zam);
    jagsaalt.splice(index, 1);
    _.set(zardal, zam, jagsaalt);
    setZardal({ ...zardal });
  }

  function zardalNemekh(zam) {
    const jagsaalt = _.get(
      zardal,
      zam + (zam === "" ? "" : ".") + "dedKhesguud"
    );
    jagsaalt.push({ ner: t("Бүлгүүд") });
    _.set(zardal, zam + (zam === "" ? "" : ".") + "dedKhesguud", jagsaalt);
    setZardal({ ...zardal });
  }

  return (
    <ZardalMur
      zardal={zardal}
      dedBulegNemekh={dedBulegNemekh}
      zardalNemekh={zardalNemekh}
      murUstgaya={murUstgaya}
      onChangeZardal={onChangeZardal}
      t={t}
    />
  );
}

export default React.forwardRef(ZardalBurtgekh);
