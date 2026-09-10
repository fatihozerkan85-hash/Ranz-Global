"use client";

import { useParams } from "next/navigation";
import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DEFAULT_POSTS } from "@/lib/cms";

export default function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const p = DEFAULT_POSTS.find((x) => x.slug === slug);
  if (!p) return <MarketingShell><p className="px-5 py-20 text-muted">Not found</p></MarketingShell>;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.titleTr,
    datePublished: p.publishedAt,
    author: { "@type": "Organization", name: "Ranz Global" },
  };
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={p.publishedAt} title={t(locale, p.titleTr, p.titleEn)} lead={t(locale, p.excerptTr, p.excerptEn)} />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Prose>{t(locale, p.bodyTr, p.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
