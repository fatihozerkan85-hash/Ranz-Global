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
    areaServed: [
      "Schengen Area",
      "United States",
      "United Arab Emirates",
      "China",
      "Russia",
      "United Kingdom",
      "Canada",
    ],
    knowsAbout: [
      "Schengen visa",
      "US visa",
      "UAE visa",
      "China visa",
      "Russia visa",
      "UK visa",
      "Canada visa",
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
