import type { Metadata } from "next";
import { SITE } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Vize Reddi",
  description: "Ret kararınızı uzmanımız değerlendirsin. Ranz Global vize onayı garantisi vermez.",
  alternates: { canonical: `${SITE.url}/vize-reddi` },
};

export { default } from "./view";
