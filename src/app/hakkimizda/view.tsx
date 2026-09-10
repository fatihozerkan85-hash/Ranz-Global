"use client";

import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DEFAULT_PAGES } from "@/lib/cms";

export default function AboutView() {
  const { locale } = useLocale();
  const page = DEFAULT_PAGES.find((p) => p.slug === "hakkimizda")!;
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Ranz Global"
        title={t(locale, page.titleTr, page.titleEn)}
        lead={t(locale, page.descriptionTr, page.descriptionEn)}
      />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Prose>{t(locale, page.bodyTr, page.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
