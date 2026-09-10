import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Gizlilik",
  description: "Ranz Global gizlilik politikası.",
  alternates: { canonical: `${SITE.url}/gizlilik` },
};

export { default } from "./view";
