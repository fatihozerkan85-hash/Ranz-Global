import type { Metadata } from "next";
import { SITE } from "@/lib/cms";
import { LegalView } from "@/components/legal-view";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Ranz Global çerez kullanımı.",
  alternates: { canonical: `${SITE.url}/cerez-politikasi` },
};

export default function Page() {
  return (
    <LegalView
      titleTr="Çerez Politikası"
      titleEn="Cookie Policy"
      bodyTr={`Sitede dil tercihi ve oturum için tarayıcı depolaması (localStorage) kullanılır. Zorunlu işleyiş içindir.

Üçüncü taraf reklam çerezi çalıştırmıyoruz. Analitik bağlanırsa ayrıca bildirilir.`}
      bodyEn={`The site uses browser storage (localStorage) for language and session. That is required for the product to work.

We do not run third-party ad cookies. Analytics, if connected, will be disclosed.`}
    />
  );
}
