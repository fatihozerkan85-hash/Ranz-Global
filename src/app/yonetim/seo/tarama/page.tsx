"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, saveCrawl, subscribeSeo } from "@/lib/seo-store";
import { runSiteCrawl } from "@/lib/seo-audit";
import type { SeoStore } from "@/lib/seo-store";

export default function CrawlPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const run = async () => {
    setBusy(true);
    const { run: crawl, issues } = await runSiteCrawl(window.location.origin);
    saveCrawl(crawl, issues);
    setBusy(false);
  };
  const last = seo?.crawls[0];
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "SEO spider", "SEO spider")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "URL keşfi, durum kodu, title, canonical, noindex, OG ve JSON-LD.", "URL discovery, status codes, title, canonical, noindex, OG and JSON-LD.")}
      </p>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm text-cream disabled:opacity-50"
      >
        {busy ? t(locale, "Taranıyor…", "Crawling…") : t(locale, "Şimdi tara", "Run crawl")}
      </button>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">HTTP</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">{t(locale, "Sorun", "Issues")}</th>
            </tr>
          </thead>
          <tbody>
            {last?.urls.map((u) => (
              <tr key={u.url} className="border-t border-line">
                <td className="px-4 py-3">{u.url}</td>
                <td className="px-4 py-3">{u.status || "—"}</td>
                <td className="max-w-xs truncate px-4 py-3">{u.title || "—"}</td>
                <td className="px-4 py-3 text-xs text-muted">{u.issues.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!last && <p className="px-4 py-6 text-sm text-muted">{t(locale, "Henüz tarama yok.", "No crawl yet.")}</p>}
      </div>
    </div>
  );
}
