"use client";

import { useParams } from "next/navigation";
import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DEFAULT_GUIDES } from "@/lib/cms";

export default function GuideView() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const g = DEFAULT_GUIDES.find((p) => p.slug === slug);
  if (!g) return <MarketingShell><p className="px-5 py-20 text-muted">Not found</p></MarketingShell>;
  return (
    <MarketingShell>
      <PageHero eyebrow={t(locale, "Rehber", "Guide")} title={t(locale, g.titleTr, g.titleEn)} lead={t(locale, g.descriptionTr, g.descriptionEn)} />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Prose>{t(locale, g.bodyTr, g.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
