"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";
import { useGoogleSeo } from "@/lib/google-seo-client";
import Link from "next/link";

export default function SeoOverview() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const { data: google, loading: googleLoading } = useGoogleSeo();
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  if (!seo) {
    return (
      <div>
        <SeoNav />
        <p className="text-sm text-muted">{t(locale, "SEO paneli yükleniyor…", "Loading SEO panel…")}</p>
      </div>
    );
  }
  const last = seo.crawls[0];
  const open = seo.issues.filter((i) => i.status === "open").length;
  const gscClicks = google.gscQueries.reduce((s, r) => s + r.clicks, 0);
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Yapay zeka SEO paneli", "AI SEO panel")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        {t(
          locale,
          "Tek domain, TR+EN. Tarama, onaylı onarım, içerik kuyruğu, GSC/GA4, sıra, uptime ve etkileşim. Google’ı GSC sekmesinden bağlayın; tarama ve uptime’ı bir kez çalıştırın.",
          "Single domain, TR+EN. Crawl, approved fixes, content queue, GSC/GA4, ranks, uptime and engagement.",
        )}
      </p>
      <p className="mt-3 text-sm">
        {googleLoading
          ? t(locale, "Google verisi yükleniyor…", "Loading Google data…")
          : google.connected
            ? t(locale, "Google bağlı", "Google connected") + (google.email ? ` · ${google.email}` : "")
            : t(locale, "Google bağlı değil — GSC / GA4 sekmesinden bağlayın.", "Google is not connected — connect it on the GSC / GA4 tab.")}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          [t(locale, "Son tarama URL", "URLs last crawl"), last?.urls.length ?? 0],
          [t(locale, "Açık hata", "Open issues"), open],
          [t(locale, "GSC tıklama (28g)", "GSC clicks (28d)"), gscClicks],
          [t(locale, "GA4 oturum (28g)", "GA4 sessions (28d)"), google.ga4Totals?.sessions ?? 0],
        ].map(([l, v]) => (
          <div key={String(l)} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{l}</p>
            <p className="mt-3 font-serif text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/yonetim/seo/tarama" className="text-gold-deep">
          {t(locale, "Tarama çalıştır", "Run crawl")}
        </Link>
        <Link href="/yonetim/seo/gsc" className="text-gold-deep">
          GSC / GA4
        </Link>
        <Link href="/yonetim/seo/kelimeler" className="text-gold-deep">
          {t(locale, "Kelimeler", "Keywords")}
        </Link>
      </div>
    </div>
  );
}
