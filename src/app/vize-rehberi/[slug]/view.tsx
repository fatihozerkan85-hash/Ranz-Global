"use client";

import { useParams } from "next/navigation";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { SchengenCountryScroller } from "@/components/schengen-country-scroller";
import { GuideArticle } from "@/components/guide-article";
import { getVisaGuide } from "@/lib/visa-guides";

export default function GuideView() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const g = getVisaGuide(slug);
  if (!g) {
    return (
      <MarketingShell>
        <p className="px-5 py-20 text-muted">{t(locale, "Rehber bulunamadı.", "Not found.")}</p>
      </MarketingShell>
    );
  }
  return (
    <MarketingShell>
      <PageHero eyebrow={t(locale, "Vize Rehberi", "Visa Guide")} title={t(locale, g.titleTr, g.titleEn)} />
      <section className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        {g.slug.includes("schengen") && (
          <div className="mb-8 rounded-2xl border border-line bg-paper p-5">
            <SchengenCountryScroller mode="links" />
          </div>
        )}
        <GuideArticle guide={g} />
      </section>
    </MarketingShell>
  );
}
