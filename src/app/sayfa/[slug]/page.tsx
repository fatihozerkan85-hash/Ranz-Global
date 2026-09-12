import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Sayfa",
  alternates: { canonical: `${SITE.url}/sayfa` },
};

export { default } from "./view";
