"use client";

import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function LegalView({
  titleTr,
  titleEn,
  bodyTr,
  bodyEn,
}: {
  titleTr: string;
  titleEn: string;
  bodyTr: string;
  bodyEn: string;
}) {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero eyebrow={t(locale, "Hukuki", "Legal")} title={t(locale, titleTr, titleEn)} />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Prose>{t(locale, bodyTr, bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
