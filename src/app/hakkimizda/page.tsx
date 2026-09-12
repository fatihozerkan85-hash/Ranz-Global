import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Ranz Global dijital vize yönetim platformu ve uzman danışmanlık. Vize onayı garantisi vermez.",
  alternates: { canonical: `${SITE.url}/hakkimizda` },
};

export { default } from "./view";
