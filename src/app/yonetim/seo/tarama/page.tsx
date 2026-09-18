"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, saveCrawl, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function CrawlPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "crawl" }),
      });
      const json = (await res.json()) as { run?: SeoStore["crawls"][0]; issues?: SeoStore["issues"]; error?: string };
      if (!res.ok || !json.run) throw new Error(json.error || "Tarama başarısız.");
      saveCrawl(json.run, json.issues ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const last = seo?.crawls[0];
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "SEO spider", "SEO spider")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Canlı sitedeki kamu sayfalarını tarar: HTTP, title, canonical, noindex, OG, JSON-LD.",
          "Crawls public pages on the live site: HTTP, title, canonical, noindex, OG, JSON-LD.",
        )}
      </p>
      <button
        type="button"
        onClick={() => void run()}
        disabled={busy}
        className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm text-cream disabled:opacity-50"
      >
        {busy ? t(locale, "Taranıyor…", "Crawling…") : t(locale, "Şimdi tara", "Run crawl")}
      </button>
      {error && <p className="mt-3 text-sm text-[#8a3b24]">{error}</p>}
      {last && (
        <p className="mt-4 text-xs text-muted">
          {t(locale, "Son tarama", "Last crawl")}: {last.startedAt.replace("T", " ").slice(0, 19)} · {last.urls.length} URL
        </p>
      )}
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
