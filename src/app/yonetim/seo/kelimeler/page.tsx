"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addKeyword, getSeo, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function KeywordsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
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
  const csv = () => {
    const rows = [["query", "locale", "position", "clicks", "impressions"], ...(seo?.keywords.map((k) => [k.query, k.locale, k.position, k.clicks, k.impressions]) ?? [])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
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
        {t(locale, "GSC tıklama/gösterim. Hacim ve KD API kredisi olunca dolar. En fazla 200 kelime.", "GSC clicks/impressions. Volume and KD fill when API credits exist. Max 200 keywords.")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="q" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" placeholder={t(locale, "Kelime ekle", "Add keyword")} />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
        <button type="button" onClick={csv} className="btn">CSV</button>
      </form>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">{t(locale, "Kelime", "Query")}</th>
              <th className="px-4 py-3">{t(locale, "Sıra", "Pos")}</th>
              <th className="px-4 py-3">{t(locale, "Tıklama", "Clicks")}</th>
              <th className="px-4 py-3">{t(locale, "Gösterim", "Impr.")}</th>
              <th className="px-4 py-3">Hacim</th>
              <th className="px-4 py-3">KD</th>
            </tr>
          </thead>
          <tbody>
            {seo?.keywords.map((k) => (
              <tr key={k.query} className="border-t border-line">
                <td className="px-4 py-3">{k.query}</td>
                <td className="px-4 py-3">{k.position ?? "—"}</td>
                <td className="px-4 py-3">{k.clicks}</td>
                <td className="px-4 py-3">{k.impressions}</td>
                <td className="px-4 py-3">{k.volume ?? "—"}</td>
                <td className="px-4 py-3">{k.kd ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
