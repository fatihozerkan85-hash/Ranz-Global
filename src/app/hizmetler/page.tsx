import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "Schengen ve ABD vize danışmanlığı, evrak yükleme ve dosya takibi.",
  alternates: { canonical: `${SITE.url}/hizmetler` },
};

export { default } from "./view";
