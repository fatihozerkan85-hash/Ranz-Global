import { publicMeta } from "@/lib/seo-meta";
import { FaqJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import HomeView from "./home-view";

export const metadata = publicMeta({
  title: "Ranz Global · Travel & Visa",
  description:
    "Türkiye ve KKTC’den İngiltere, ABD, Kanada, Schengen ve diğer vize dosyalarında dijital danışmanlık. Ranz Global vize onayı garantisi vermez.",
  path: "",
  absoluteTitle: true,
});

export default function Page() {
  return (
    <>
      <WebSiteJsonLd />
      <FaqJsonLd />
      <HomeView />
    </>
  );
}
