import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "KVKK",
  description: "Ranz Global kişisel verilerin işlenmesine ilişkin aydınlatma.",
  alternates: { canonical: `${SITE.url}/kvkk` },
};

export { default } from "./view";
