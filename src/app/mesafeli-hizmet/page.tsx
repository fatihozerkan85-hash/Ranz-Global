import type { Metadata } from "next";
import { SITE } from "@/lib/cms";
import { LegalView } from "@/components/legal-view";

export const metadata: Metadata = {
  title: "Mesafeli Hizmet Sözleşmesi",
  description: "Ranz Global mesafeli danışmanlık hizmetine ilişkin bilgilendirme.",
  alternates: { canonical: `${SITE.url}/mesafeli-hizmet` },
};

export default function Page() {
  return (
    <LegalView
      titleTr="Mesafeli Hizmet Sözleşmesi"
      titleEn="Distance Services Notice"
      bodyTr={`Bu metin yer tutucudur; imzalı sözleşme metni Ranz Global tarafından ayrı iletilir.

Hizmet, vize dosyası hazırlığı ve danışmanlıktır. Vize kararı resmi makamlara aittir. Konsolosluk ve başvuru merkezi ücretleri danışmanlık bedeline dahil değildir.

Cayma, iade ve fatura koşulları size yazılı teklifte belirtilir.`}
      bodyEn={`This page is a placeholder; the signed terms are sent separately by Ranz Global.

The service is file preparation and consultancy. Visa decisions belong to official authorities. Consulate and VAC fees are not included in the consultancy fee.

Withdrawal, refund and invoice terms are stated in your written offer.`}
    />
  );
}
