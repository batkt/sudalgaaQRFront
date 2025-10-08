"use client";

import { useRouter, usePathname } from "next/navigation";

export default function GoToAnket() {
  const router = useRouter();
  const pathName = usePathname();

  const a = pathName.split("/");

  const ajiltniiId = a[2];

  return router.push(`/uilAjillagaa/${ajiltniiId}/654a406e943e5ca31352edb1`);
}
