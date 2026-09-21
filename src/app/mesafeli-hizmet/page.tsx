import { publicMeta } from "@/lib/seo-meta";
import { LegalView } from "@/components/legal-view";
import { COMPANY } from "@/lib/company";

export const metadata = publicMeta({
  title: "Mesafeli Hizmet Sözleşmesi",
  description: "BP Grup / Ranz Global mesafeli danışmanlık hizmetine ilişkin bilgilendirme. Vize kararı resmi makamlara aittir.",
  path: "/mesafeli-hizmet",
});

export default function Page() {
  return (
    <LegalView
      titleTr="Mesafeli Hizmet Sözleşmesi"
      titleEn="Distance Services Notice"
      bodyTr={`Hizmet sağlayıcı: ${COMPANY.legalName}.
${COMPANY.brandNoteTr}
Adres: ${COMPANY.address}
${COMPANY.tradeRegistry}
${COMPANY.taxOffice}, VKN ${COMPANY.taxNo}
E-posta: ${COMPANY.email}

İmzalı sözleşme metni ayrıca iletilir. Bu sayfa mesafeli hizmete ilişkin genel bilgilendirmedir.

Hizmet, vize dosyası hazırlığı ve danışmanlıktır. Vize kararı resmi makamlara aittir. Konsolosluk ve başvuru merkezi ücretleri danışmanlık bedeline dahil değildir.

Cayma, iade ve fatura koşulları size yazılı teklifte belirtilir.`}
      bodyEn={`Provider: ${COMPANY.legalName}.
${COMPANY.brandNoteEn}
Address: ${COMPANY.address}
${COMPANY.tradeRegistry}
Tax office ${COMPANY.taxOffice}, tax no ${COMPANY.taxNo}
Email: ${COMPANY.email}

The signed contract is sent separately. This page is a general distance-services notice.

The service is file preparation and consultancy. Visa decisions belong to official authorities. Consulate and VAC fees are not included in the consultancy fee.

Withdrawal, refund and invoice terms are stated in your written offer.`}
    />
  );
}
