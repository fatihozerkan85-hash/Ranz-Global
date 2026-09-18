import { SITE } from "@/lib/cms";
import { FAQ_ITEMS } from "@/lib/faq";
import type { Service } from "@/lib/services";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": `${SITE.url}/#org`,
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        logo: `${SITE.url}/logo.jpg`,
        image: `${SITE.url}/logo.jpg`,
        slogan: "Travel & Visa",
        address: {
          "@type": "PostalAddress",
          addressLocality: "İstanbul",
          addressCountry: "TR",
        },
        areaServed: [
          "Türkiye",
          "Northern Cyprus",
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
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: SITE.email,
          availableLanguage: ["Turkish", "English"],
        },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: ["tr", "en"],
        publisher: { "@id": `${SITE.url}/#org` },
      }}
    />
  );
}

export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.qTr,
          acceptedAnswer: { "@type": "Answer", text: item.aTr },
        })),
      }}
    />
  );
}

export function ServiceJsonLd({ service }: { service: Service }) {
  const url = `${SITE.url}/hizmet/${service.slug}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.titleTr,
        description: `${service.titleTr} — ${service.visaTr}. Danışmanlık hizmetidir; vize kararı resmi makamlara aittir.`,
        url,
        provider: { "@id": `${SITE.url}/#org` },
        areaServed: ["TR", "CY"],
        offers: service.fee
          ? {
              "@type": "Offer",
              priceCurrency: service.fee.includes("EUR") ? "EUR" : "USD",
              price: service.fee.replace(/[^\d.]/g, "") || undefined,
              description: "Ranz Global danışmanlık ücreti. Konsolosluk ve merkez harçları ayrıdır.",
            }
          : undefined,
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  path,
  datePublished,
}: {
  title: string;
  description?: string;
  path: string;
  datePublished?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${SITE.url}${path}`,
        datePublished,
        author: { "@id": `${SITE.url}/#org` },
        publisher: { "@id": `${SITE.url}/#org` },
        mainEntityOfPage: `${SITE.url}${path}`,
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.path ? `${SITE.url}${item.path}` : SITE.url,
        })),
      }}
    />
  );
}
