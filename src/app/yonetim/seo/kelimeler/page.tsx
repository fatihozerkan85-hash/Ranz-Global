"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addKeyword, getSeo, removeKeyword, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";
import { useGoogleSeo } from "@/lib/google-seo-client";
import { TARGET_KEYWORDS } from "@/lib/seo-keywords";
import Link from "next/link";

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
      href: TARGET_KEYWORDS.find((k) => k.query.toLowerCase() === (r.keys[0] || "").toLowerCase())?.href,
    }));
    const extras = [
      ...TARGET_KEYWORDS.map((k) => ({
        query: k.query,
        locale: "TR" as const,
        position: null as number | null,
        clicks: 0,
        impressions: 0,
        volume: null as number | null,
        kd: null as number | null,
        href: k.href,
      })),
      ...(seo?.keywords ?? []).map((k) => ({
        ...k,
        href: TARGET_KEYWORDS.find((t) => t.query.toLowerCase() === k.query.toLowerCase())?.href,
      })),
    ].filter((k) => !fromGsc.some((g) => g.query.toLowerCase() === k.query.toLowerCase()));
    const seen = new Set<string>();
    const extra = extras.filter((k) => {
      const key = k.query.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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
        {t(
          locale,
          "Hedef kelimeler ve Search Console sırası. Kelimeyi buraya yazmak Google’da yayınlamaz; yanında bağlı sayfa vardır.",
          "Target keywords and Search Console ranks. Adding a word here does not publish it on Google; the linked page does.",
        )}
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
              <th className="px-4 py-3">{t(locale, "Sayfa", "Page")}</th>
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
                <td className="px-4 py-3">
                  {"href" in k && k.href ? (
                    <Link href={k.href} className="text-gold-deep">
                      {k.href}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
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
