import { SITE } from "@/lib/cms";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    image: `${SITE.url}/logo.jpg`,
    slogan: "Travel & Visa",
    areaServed: ["Europe", "United States"],
    knowsAbout: ["Schengen visa", "US B1/B2 visa", "F-1 student visa"],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
