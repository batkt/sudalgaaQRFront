"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import uilchilgee from "@/services/uilchilgee";

export default function GoToAnket() {
  const router = useRouter();
  const pathName = usePathname();

  const a = pathName.split("/");

  const ajiltniiId = a[2];

  useEffect(() => {
    uilchilgee()
      .get("/idevkhteiAsuultIdAvya")
      .then((res) => {
        router.push(`/anket/${ajiltniiId}/${res.data}`);
      });
  }, []);

  return null;
}
