"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CmsImg, usePosts } from "@/lib/use-site";

export default function BlogView() {
  const { locale } = useLocale();
  const posts = usePosts();
  return (
    <MarketingShell>
      <PageHero
        eyebrow="SEO"
        title={t(locale, "Blog", "Blog")}
        lead={t(locale, "Onaylı içerik kuyruğundan yayınlanan yazılar.", "Articles published from the approved content queue.")}
      />
      <section className="mx-auto max-w-6xl space-y-4 px-5 py-14">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block overflow-hidden rounded-2xl border border-line bg-paper hover:border-gold">
            {p.imageId ? <CmsImg id={p.imageId} alt={t(locale, p.coverAltTr, p.coverAltEn)} className="h-48 w-full object-cover" /> : null}
            <div className="p-7">
              <p className="text-xs text-muted">{p.publishedAt}</p>
              <h2 className="mt-2 font-serif text-2xl">{t(locale, p.titleTr, p.titleEn)}</h2>
              <p className="mt-2 text-sm text-ink-soft">{t(locale, p.excerptTr, p.excerptEn)}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-sm text-muted">{t(locale, "Henüz yazı yok.", "No articles yet.")}</p>}
      </section>
    </MarketingShell>
  );
}
