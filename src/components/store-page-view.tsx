"use client";

import { MarketingShell, PageHero, Prose } from "@/components/marketing-shell";
import { CmsImg, usePages } from "@/lib/use-site";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export function StorePageView({
  slug,
  eyebrow,
}: {
  slug: string;
  eyebrow?: string;
}) {
  const { locale } = useLocale();
  const pages = usePages();
  const page = pages.find((p) => p.slug === slug && p.status === "published");
  if (!page) {
    return (
      <MarketingShell>
        <p className="px-5 py-20 text-sm text-muted">{t(locale, "Sayfa yok.", "Page not found.")}</p>
      </MarketingShell>
    );
  }
  return (
    <MarketingShell>
      <PageHero
        eyebrow={eyebrow ?? "Ranz Global"}
        title={t(locale, page.titleTr, page.titleEn)}
        lead={t(locale, page.descriptionTr, page.descriptionEn)}
      />
      <section className="mx-auto max-w-6xl px-5 py-14">
        {page.imageId ? (
          <CmsImg id={page.imageId} alt={page.titleTr} className="mb-8 max-h-80 w-full rounded-2xl object-cover" />
        ) : null}
        <Prose>{t(locale, page.bodyTr, page.bodyEn)}</Prose>
      </section>
    </MarketingShell>
  );
}
