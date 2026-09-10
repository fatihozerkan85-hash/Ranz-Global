import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Ranz Global, Avrupa ve Amerika vize danışmanlığında evrak sürecini sadeleştirir.",
  alternates: { canonical: `${SITE.url}/hakkimizda` },
};

export { default } from "./view";
