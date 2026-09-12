"use client";

import { useParams } from "next/navigation";
import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CmsImg, usePosts } from "@/lib/use-site";

export default function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const p = usePosts().find((x) => x.slug === slug);
  if (!p) {
    return (
      <MarketingShell>
        <p className="px-5 py-20 text-muted">{t(locale, "Yazı bulunamadı.", "Not found.")}</p>
      </MarketingShell>
    );
  }
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
        {p.imageId ? <CmsImg id={p.imageId} alt={t(locale, p.coverAltTr, p.coverAltEn)} className="mb-8 max-h-96 w-full rounded-2xl object-cover" /> : null}
        <Prose>{t(locale, p.bodyTr, p.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
