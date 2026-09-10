import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Ranz Global ile görüşme talebi, e-posta ve WhatsApp.",
  alternates: { canonical: `${SITE.url}/iletisim` },
};

export { default } from "./view";
