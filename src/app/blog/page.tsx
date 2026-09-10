import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ranz Global vize ve evrak yazıları.",
  alternates: { canonical: `${SITE.url}/blog` },
};

export { default } from "./view";
