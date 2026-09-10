"use client";

import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DEFAULT_PAGES } from "@/lib/cms";

export default function KvkkView() {
  const { locale } = useLocale();
  const page = DEFAULT_PAGES.find((p) => p.slug === "kvkk")!;
  return (
    <MarketingShell>
      <PageHero eyebrow="KVKK" title={t(locale, page.titleTr, page.titleEn)} />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Prose>{t(locale, page.bodyTr, page.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
