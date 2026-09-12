"use client";

import { useParams } from "next/navigation";
import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CmsImg, useGuides } from "@/lib/use-site";

export default function GuideView() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const g = useGuides().find((p) => p.slug === slug && p.status === "published");
  if (!g) {
    return (
      <MarketingShell>
        <p className="px-5 py-20 text-muted">{t(locale, "Rehber bulunamadı.", "Not found.")}</p>
      </MarketingShell>
    );
  }
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Rehber", "Guide")}
        title={t(locale, g.titleTr, g.titleEn)}
        lead={t(locale, g.descriptionTr, g.descriptionEn)}
      />
      <section className="mx-auto max-w-6xl px-5 py-14">
        {g.imageId ? <CmsImg id={g.imageId} alt="" className="mb-8 max-h-80 w-full rounded-2xl object-cover" /> : null}
        <Prose>{t(locale, g.bodyTr, g.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
