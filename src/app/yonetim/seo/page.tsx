"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function SeoOverview() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  if (!seo) return null;
  const last = seo.crawls[0];
  const open = seo.issues.filter((i) => i.status === "open").length;
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Yapay zeka SEO paneli", "AI SEO panel")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        {t(
          locale,
          "Tek domain, TR+EN. Tarama, onaylı onarım, içerik kuyruğu, GSC/GA4, sıra, uptime ve etkileşim. Üçüncü taraf SEO aboneliği değil.",
          "Single domain, TR+EN. Crawl, approved fixes, content queue, GSC/GA4, ranks, uptime and engagement. Not a third-party SEO subscription.",
        )}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          [t(locale, "Son tarama URL", "URLs last crawl"), last?.urls.length ?? 0],
          [t(locale, "Açık hata", "Open issues"), open],
          [t(locale, "İçerik kuyruğu", "Content queue"), seo.queue.filter((q) => q.status !== "published").length],
          [t(locale, "Takip kelime", "Tracked keywords"), seo.keywords.length],
        ].map(([l, v]) => (
          <div key={String(l)} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{l}</p>
            <p className="mt-3 font-serif text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted">
        {t(
          locale,
          "Hacim / KD / SERP API kotası Ranz Global’e aittir. API yoksa bu alanlar boş kalır; tarama ve GSC çalışmaya devam eder.",
          "Volume / KD / SERP API credits belong to Ranz Global. Without an API those metrics stay empty; crawl and GSC still run.",
        )}
      </p>
    </div>
  );
}
