import Script from "next/script";
import { GooglePageView } from "@/components/google-pageview";

export function GoogleTags() {
  const ga = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  if (!ga) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
      <Script id="ga4-gtag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{send_page_view:false});`}
      </Script>
      <GooglePageView />
    </>
  );
}
