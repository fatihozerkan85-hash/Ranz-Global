"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DEFAULT_GUIDES } from "@/lib/cms";

export default function GuidesView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Rehber", "Guides")}
        title={t(locale, "Vize rehberi", "Visa guides")}
        lead={t(locale, "Schengen ve ABD dosyalarında izlenen evrak çerçevesi.", "Document framework for Schengen and US files.")}
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-2">
        {DEFAULT_GUIDES.map((g) => (
          <Link key={g.slug} href={`/vize-rehberi/${g.slug}`} className="rounded-2xl border border-line bg-paper p-7 hover:border-gold">
            <h2 className="font-serif text-2xl">{t(locale, g.titleTr, g.titleEn)}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t(locale, g.descriptionTr, g.descriptionEn)}</p>
          </Link>
        ))}
      </section>
    </MarketingShell>
  );
}
