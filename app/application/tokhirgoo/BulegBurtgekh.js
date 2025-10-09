import React, { useEffect, useImperativeHandle, useState } from "react";
import { Input, message, Modal } from "antd";
import createMethod from "tools/functions/crud/createMethod";
import updateMethod from "tools/functions/crud/updateMethod";
import _ from "lodash";

function BulegMur({
  buleg,
  dedBulegNemekh,
  bulegNemekh,
  murUstgaya,
  onChangeBuleg,
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
            buleg.dedKhesguud ? (showDed ? "border " : "border ") : ""
          }`}
          onClick={() => setShowDed(!showDed)}
        >
          {buleg.dedKhesguud ? (showDed ? "-" : "+") : ""}
        </div>
        <div
          className="flex items-center rounded-sm px-2"
          style={{ width: `calc(100% - ${zam !== "" ? "6" : "3"}rem)` }}
        >
          <Input
            id="bulegMurInput"
            placeholder={t("Нэр")}
            value={buleg.ner}
            style={{ width: "100%" }}
            onChange={(e) => onChangeBuleg(e, zam)}
          />
        </div>
        <div
          className="ml-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border text-center"
          onClick={() => {
            if (buleg?.dedKhesguud?.length > 0) bulegNemekh(zam);
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
      {showDed && buleg.dedKhesguud && (
        <div className="w-full pl-12">
          <Buleg
            buleguud={buleg.dedKhesguud}
            dedBulegNemekh={dedBulegNemekh}
            bulegNemekh={bulegNemekh}
            murUstgaya={murUstgaya}
            onChangeBuleg={onChangeBuleg}
            zam={zam + (zam === "" ? "" : ".") + "dedKhesguud"}
            t={t}
          />
        </div>
      )}
    </div>
  );
}

function Buleg({
  buleguud,
  dedBulegNemekh,
  bulegNemekh,
  murUstgaya,
  onChangeBuleg,
  zam,
  t,
}) {
  return (
    <div className="w-full space-y-4">
      {buleguud?.map((a, i) => (
        <BulegMur
          key={a?._id}
          buleg={a}
          index={i}
          dedBulegNemekh={dedBulegNemekh}
          bulegNemekh={bulegNemekh}
          murUstgaya={murUstgaya}
          onChangeBuleg={onChangeBuleg}
          realZam={zam}
          defaultZam={zam + `.${i}`}
          t={t}
        />
      ))}
    </div>
  );
}

function BulegBurtgekh({ data = {}, token, destroy, onRefresh, t }, ref) {
  const [buleg, setBuleg] = useState(data);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const method = buleg?._id ? updateMethod : createMethod;
        method("buleg", token, buleg).then(({ data }) => {
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
    [buleg]
  );

  function garya() {
    if (buleg !== data)
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
    }, [buleg]);

  useEffect(() => {
    document.getElementById("bulegMurInput")?.focus();
  }, []);

  function onChangeBuleg({ target }, zam) {
    _.set(buleg, zam + (zam === "" ? "" : ".") + "ner", target.value);
    setBuleg({ ...buleg });
  }

  function dedBulegNemekh(zam) {
    _.set(buleg, zam + (zam === "" ? "" : ".") + "dedKhesguud", [
      { ner: t("Бүлэг") },
    ]);
    setBuleg({ ...buleg });
  }

  function murUstgaya(index, zam) {
    const jagsaalt = _.get(buleg, zam);
    jagsaalt.splice(index, 1);
    _.set(buleg, zam, jagsaalt);
    setBuleg({ ...buleg });
  }

  function bulegNemekh(zam) {
    const jagsaalt = _.get(
      buleg,
      zam + (zam === "" ? "" : ".") + "dedKhesguud",      
    );
    jagsaalt.push({ ner: t("Бүлгүүд") });
    _.set(buleg, zam + (zam === "" ? "" : ".") + "dedKhesguud", jagsaalt);
    setBuleg({ ...buleg });
  }

  return (
    <BulegMur
      buleg={buleg}
      dedBulegNemekh={dedBulegNemekh}
      bulegNemekh={bulegNemekh}
      murUstgaya={murUstgaya}
      onChangeBuleg={onChangeBuleg}
      t={t}
    />
  );
}

export default React.forwardRef(BulegBurtgekh);
