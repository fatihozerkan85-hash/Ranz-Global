import { publicMeta } from "@/lib/seo-meta";
import { LegalView } from "@/components/legal-view";
import { COMPANY } from "@/lib/company";

export const metadata = publicMeta({
  title: "Çerez Politikası",
  description: "Ranz Global çerez ve ölçüm kullanımı. Reklam ağı çerezi yoktur.",
  path: "/cerez-politikasi",
});

export default function Page() {
  return (
    <LegalView
      titleTr="Çerez Politikası"
      titleEn="Cookie Policy"
      bodyTr={`Veri sorumlusu: ${COMPANY.legalName}. ${COMPANY.brandNoteTr}

Sitede dil tercihi ve oturum için tarayıcı depolaması (localStorage) kullanılır. Zorunlu işleyiş içindir.

Üçüncü taraf reklam çerezi çalıştırmıyoruz. Google Analytics (GA4) bağlandığında Google ölçüm çerezleri çalışır; amaç site kullanımını anlamaktır, vize kararı ile ilgili değildir.

Kişisel veri işleme ayrıntısı KVKK aydınlatma metnindedir.`}
      bodyEn={`Controller: ${COMPANY.legalName}. ${COMPANY.brandNoteEn}

The site uses browser storage (localStorage) for language and session. That is required for the product to work.

We do not run third-party ad cookies. When Google Analytics (GA4) is connected, Google measurement cookies run so we can understand site use. This is not related to visa decisions.

Details of personal-data processing are in the KVKK notice.`}
    />
  );
}
