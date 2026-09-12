"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CmsImg, useGuides, usePosts } from "@/lib/use-site";

export default function GuidesView() {
  const { locale } = useLocale();
  const guides = useGuides().filter((g) => g.status === "published");
  const posts = usePosts().filter((p) => p.status === "published");
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Bilgi", "Guides")}
        title={t(locale, "Ranz Global Vize Rehberi", "Ranz Global Visa Guide")}
        lead={t(
          locale,
          "Google’da aranan gerçek sorular: evrak, banka, ret, sponsor ve mülakat.",
          "Real search questions: documents, funds, refusal, sponsors and interviews.",
        )}
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/vize-rehberi/${g.slug}`} className="overflow-hidden rounded-2xl border border-line bg-paper hover:border-gold">
            {g.imageId ? <CmsImg id={g.imageId} alt="" className="h-40 w-full object-cover" /> : null}
            <div className="p-7">
              <h2 className="font-serif text-2xl">{t(locale, g.titleTr, g.titleEn)}</h2>
              <p className="mt-2 text-sm text-ink-soft">{t(locale, g.descriptionTr, g.descriptionEn)}</p>
            </div>
          </Link>
        ))}
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-line bg-paper p-7 hover:border-gold">
            <h2 className="font-serif text-2xl">{t(locale, p.titleTr, p.titleEn)}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t(locale, p.excerptTr, p.excerptEn)}</p>
          </Link>
        ))}
      </section>
    </MarketingShell>
  );
}
