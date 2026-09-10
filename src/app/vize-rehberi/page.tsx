import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Vize rehberi",
  description: "Schengen ve ABD vize evrak rehberleri.",
  alternates: { canonical: `${SITE.url}/vize-rehberi` },
};

export { default } from "./view";
