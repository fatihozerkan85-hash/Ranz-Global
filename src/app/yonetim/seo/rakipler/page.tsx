"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import {
  addCompetitor,
  addContentJob,
  getSeo,
  removeCompetitor,
  setCompetitorTopics,
  subscribeSeo,
} from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";
import { DEFAULT_SERP_QUERIES, type SerpReport } from "@/lib/serp-competitor";

function pos(n: number | null) {
  return n == null ? "—" : String(n);
}

export default function CompetitorsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [queries, setQueries] = useState(DEFAULT_SERP_QUERIES.join("\n"));
  const [competitors, setCompetitors] = useState("");
  const [report, setReport] = useState<SerpReport | null>(null);
  const [serpBusy, setSerpBusy] = useState<"analyze" | "pdf" | null>(null);
  const [serpError, setSerpError] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);

  useEffect(() => {
    void fetch("/api/seo/serp", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { configured?: boolean }) => setConfigured(Boolean(json.configured)))
      .catch(() => setConfigured(false));
  }, []);

  const savedHosts = useMemo(() => (seo?.competitors ?? []).map((c) => c.domain).join("\n"), [seo]);
  useEffect(() => {
    if (savedHosts && !competitors) setCompetitors(savedHosts);
  }, [savedHosts, competitors]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = String(new FormData(e.currentTarget).get("d") || "");
    if (d) addCompetitor(d);
    e.currentTarget.reset();
  };
  const scan = async (domain: string) => {
    setBusy(domain);
    setError(null);
    try {
      const res = await fetch("/api/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "competitor", domain }),
      });
      const json = (await res.json()) as { topics?: string[]; error?: string };
      if (!res.ok) throw new Error(json.error || "Tarama başarısız.");
      setCompetitorTopics(domain, json.topics ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const analyze = async () => {
    setSerpBusy("analyze");
    setSerpError(null);
    try {
      const res = await fetch("/api/seo/serp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze", queries, competitors, gl: "tr", hl: "tr" }),
      });
      const json = (await res.json()) as { report?: SerpReport; error?: string };
      if (!res.ok || !json.report) throw new Error(json.error || "SERP analizi alınamadı.");
      setReport(json.report);
    } catch (err) {
      setSerpError((err as Error).message);
    } finally {
      setSerpBusy(null);
    }
  };

  const downloadPdf = async () => {
    if (!report) return;
    setSerpBusy("pdf");
    setSerpError(null);
    try {
      const res = await fetch("/api/seo/serp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pdf", report }),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error || "PDF üretilemedi.");
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `ranz-serp-rakip-${report.at.slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      setSerpError((err as Error).message);
    } finally {
      setSerpBusy(null);
    }
  };

  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Rakip analizi", "Competitor analysis")}</h1>

      <section className="mt-8 rounded-2xl border border-line bg-paper p-6">
        <h2 className="font-serif text-2xl">{t(locale, "Google SERP karşılaştırması", "Google SERP comparison")}</h2>
        <p className="mt-2 text-sm text-ink-soft">
          {t(
            locale,
            "SerpAPI ile Google’daki ilk 10 sonucu çeker. ranzglobal.com ile rakiplerin sırasını yan yana koyar. PDF’e Search Console ve Analytics’teki son 28 günlük istatistikler de eklenir. Vize onayı sözü yoktur.",
            "Pulls Google’s top 10 via SerpAPI and compares ranzglobal.com with competitors. The PDF also includes the last 28 days of Search Console and Analytics stats. Not a visa-approval promise.",
          )}
        </p>
        {configured === false && (
          <p className="mt-3 text-sm text-[#8a3b24]">
            {t(
              locale,
              "SERPAPI_API_KEY yok. serpapi.com’dan anahtar alıp Vercel Environment Variables’a ekleyin, sonra yeniden yayınlayın.",
              "SERPAPI_API_KEY is missing. Add a key from serpapi.com to Vercel Environment Variables, then redeploy.",
            )}
          </p>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            {t(locale, "Arama kelimeleri (satır satır, en fazla 8)", "Queries (one per line, max 8)")}
            <textarea
              value={queries}
              onChange={(e) => setQueries(e.target.value)}
              rows={8}
              className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            {t(locale, "Rakip domainler (satır satır)", "Competitor domains (one per line)")}
            <textarea
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              rows={8}
              placeholder={"ornek.com\nbaska.com"}
              className="mt-2 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-full bg-navy px-4 py-2 text-sm text-cream disabled:opacity-50" disabled={serpBusy !== null} onClick={() => void analyze()}>
            {serpBusy === "analyze" ? t(locale, "Google taranıyor…", "Scanning Google…") : t(locale, "SERP analizi çalıştır", "Run SERP analysis")}
          </button>
          <button type="button" className="btn" disabled={!report || serpBusy !== null} onClick={() => void downloadPdf()}>
            {serpBusy === "pdf" ? t(locale, "PDF hazırlanıyor…", "Preparing PDF…") : t(locale, "PDF rapor indir", "Download PDF report")}
          </button>
        </div>
        {serpError && <p className="mt-3 text-sm text-[#8a3b24]">{serpError}</p>}
        {report && (
          <div className="mt-6 overflow-x-auto">
            <p className="mb-3 text-xs text-muted">
              {t(locale, "Pazar", "Market")}: Google {report.gl.toUpperCase()} · {t(locale, "Biz", "Us")}: {report.ourDomain}
            </p>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted">
                <tr>
                  <th className="px-2 py-2">{t(locale, "Domain", "Domain")}</th>
                  <th className="px-2 py-2">{t(locale, "İlk 10", "Page 1")}</th>
                  <th className="px-2 py-2">{t(locale, "Ort. sıra", "Avg pos")}</th>
                </tr>
              </thead>
              <tbody>
                {report.scores.map((s) => (
                  <tr key={s.domain} className="border-t border-line">
                    <td className="px-2 py-2">
                      {s.domain}
                      {s.ours ? ` (${t(locale, "biz", "us")})` : ""}
                    </td>
                    <td className="px-2 py-2">
                      {s.page1}/{report.queries.length}
                    </td>
                    <td className="px-2 py-2">{s.avgPosition ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="mt-6 w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted">
                <tr>
                  <th className="px-2 py-2">{t(locale, "Kelime", "Query")}</th>
                  <th className="px-2 py-2">Ranz</th>
                  <th className="px-2 py-2">{t(locale, "1. site", "Top result")}</th>
                </tr>
              </thead>
              <tbody>
                {report.queries.map((row) => (
                  <tr key={row.query} className="border-t border-line align-top">
                    <td className="px-2 py-2">
                      <p>{row.query}</p>
                      <p className="mt-1 text-xs text-muted">
                        {Object.entries(row.competitorPositions)
                          .map(([d, p]) => `${d} ${pos(p)}`)
                          .join(" · ")}
                      </p>
                    </td>
                    <td className="px-2 py-2">{pos(row.ourPosition)}</td>
                    <td className="px-2 py-2">{row.results[0] ? `${row.results[0].domain} (#${row.results[0].position})` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.gaps.length > 0 && (
              <div className="mt-4 text-sm">
                <p className="font-medium">{t(locale, "Boşluk (rakip var, biz yokuz)", "Gaps (competitor ranks, we do not)")}</p>
                <ul className="mt-2 list-disc pl-5 text-ink-soft">
                  {report.gaps.map((g) => (
                    <li key={g.query}>
                      {g.query} — {g.leader} #{g.leaderPos}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <h2 className="mt-12 font-serif text-2xl">{t(locale, "Anasayfa tarama", "Homepage scrape")}</h2>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Rakip anasayfadan başlık çeker. Konuyu içerik kuyruğuna atabilirsiniz.", "Pull titles from a competitor homepage. Send a topic to the content queue.")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="d" placeholder="ornek.com" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
      </form>
      {error && <p className="mt-3 text-sm text-[#8a3b24]">{error}</p>}
      <div className="mt-8 space-y-3">
        {seo?.competitors.map((c) => (
          <article key={c.domain} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">{c.domain}</p>
              <div className="flex gap-2">
                <button type="button" className="btn btn-sm" disabled={busy === c.domain} onClick={() => void scan(c.domain)}>
                  {busy === c.domain ? t(locale, "Taranıyor…", "Scanning…") : t(locale, "Siteyi tara", "Scan site")}
                </button>
                <button type="button" className="text-xs text-[#8a3b24]" onClick={() => removeCompetitor(c.domain)}>
                  {t(locale, "Sil", "Delete")}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(c.topics.length ? c.topics : [t(locale, "Önce siteyi tarayın", "Scan the site first")]).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="btn btn-sm"
                  disabled={!c.topics.length}
                  onClick={() => addContentJob(topic, locale)}
                >
                  {topic}
                  {c.topics.length ? ` → ${t(locale, "kuyruk", "queue")}` : ""}
                </button>
              ))}
            </div>
          </article>
        ))}
        {seo && seo.competitors.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Henüz rakip yok.", "No competitors yet.")}</p>
        )}
      </div>
    </div>
  );
}
