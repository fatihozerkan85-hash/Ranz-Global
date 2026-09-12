"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, setIntegrations, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function GscPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">Search Console / Analytics</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Hesaplar Ranz Global’e aittir. OAuth bağlanınca sorgu, sayfa, tıklama ve organik oturum panoda görünür.", "Accounts belong to Ranz Global. After OAuth, queries, pages, clicks and organic sessions appear here.")}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">Google Search Console</h2>
          <p className="mt-2 text-sm text-muted">{seo?.gscConnected ? t(locale, "Bağlı (demo)", "Connected (demo)") : t(locale, "Bağlı değil", "Not connected")}</p>
          <button type="button" className="mt-4 rounded-full bg-navy px-4 py-2 text-sm text-cream" onClick={() => setIntegrations(true, seo?.ga4Connected ?? false)}>
            {t(locale, "OAuth bağla", "Connect OAuth")}
          </button>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">GA4</h2>
          <p className="mt-2 text-sm text-muted">{seo?.ga4Connected ? t(locale, "Bağlı (demo)", "Connected (demo)") : t(locale, "Bağlı değil", "Not connected")}</p>
          <button type="button" className="mt-4 rounded-full bg-navy px-4 py-2 text-sm text-cream" onClick={() => setIntegrations(seo?.gscConnected ?? false, true)}>
            {t(locale, "OAuth bağla", "Connect OAuth")}
          </button>
        </div>
      </div>
    </div>
  );
}
