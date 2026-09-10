import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Görüşme talebi",
  description: "Ranz Global ile randevu / görüşme talebi formu.",
  alternates: { canonical: `${SITE.url}/randevu` },
};

export { default } from "./view";
