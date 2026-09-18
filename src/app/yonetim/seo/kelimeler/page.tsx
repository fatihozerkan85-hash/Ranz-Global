"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addKeyword, getSeo, removeKeyword, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";
import { useGoogleSeo } from "@/lib/google-seo-client";

export default function KeywordsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const { data: google } = useGoogleSeo();
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") || "");
    if (q) addKeyword(q, "TR");
    e.currentTarget.reset();
  };
  const rows = useMemo(() => {
    const fromGsc = google.gscQueries.map((r) => ({
      query: r.keys[0] || "—",
      locale: "TR" as const,
      position: Math.round(r.position * 10) / 10,
      clicks: Math.round(r.clicks),
      impressions: Math.round(r.impressions),
      volume: null as number | null,
      kd: null as number | null,
    }));
    const extra = (seo?.keywords ?? []).filter((k) => !fromGsc.some((g) => g.query === k.query));
    return [...fromGsc, ...extra];
  }, [google.gscQueries, seo]);
  const csv = () => {
    const table = [["query", "locale", "position", "clicks", "impressions"], ...rows.map((k) => [k.query, k.locale, k.position, k.clicks, k.impressions])];
    const blob = new Blob([table.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ranz-keywords.csv";
    a.click();
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Kelime ve sıra", "Keywords & ranks")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Search Console’daki tıklama, gösterim ve ortalama sıra. Ek kelime elle izlenir.", "Clicks, impressions and average position from Search Console. Extra keywords can be tracked manually.")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="q" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" placeholder={t(locale, "Kelime ekle", "Add keyword")} />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
        <button type="button" onClick={csv} className="btn">
          CSV
        </button>
      </form>
      {rows.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          {t(locale, "GSC bağlıysa sorgular burada görünür. Elle kelime de ekleyebilirsiniz.", "Queries appear here when Search Console is connected. You can also add keywords by hand.")}
        </p>
      )}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">{t(locale, "Kelime", "Query")}</th>
              <th className="px-4 py-3">{t(locale, "Sıra", "Pos")}</th>
              <th className="px-4 py-3">{t(locale, "Tıklama", "Clicks")}</th>
              <th className="px-4 py-3">{t(locale, "Gösterim", "Impr.")}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.query} className="border-t border-line">
                <td className="px-4 py-3">{k.query}</td>
                <td className="px-4 py-3">{k.position ?? "—"}</td>
                <td className="px-4 py-3">{k.clicks}</td>
                <td className="px-4 py-3">{k.impressions}</td>
                <td className="px-4 py-3">
                  {(seo?.keywords ?? []).some((row) => row.query === k.query) && (
                    <button type="button" className="text-xs text-[#8a3b24]" onClick={() => removeKeyword(k.query)}>
                      {t(locale, "Sil", "Delete")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
