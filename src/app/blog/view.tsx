"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DEFAULT_POSTS } from "@/lib/cms";

export default function BlogView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero eyebrow="SEO" title={t(locale, "Blog", "Blog")} lead={t(locale, "Onaylı içerik kuyruğundan yayınlanan yazılar.", "Articles published from the approved content queue.")} />
      <section className="mx-auto max-w-6xl space-y-4 px-5 py-14">
        {DEFAULT_POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-2xl border border-line bg-paper p-7 hover:border-gold">
            <p className="text-xs text-muted">{p.publishedAt}</p>
            <h2 className="mt-2 font-serif text-2xl">{t(locale, p.titleTr, p.titleEn)}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t(locale, p.excerptTr, p.excerptEn)}</p>
          </Link>
        ))}
      </section>
    </MarketingShell>
  );
}
