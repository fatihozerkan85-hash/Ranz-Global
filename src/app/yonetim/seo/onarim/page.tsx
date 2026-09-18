"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { applySeoIssue, getSeo, setIssueStatus, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function FixesPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const open = seo?.issues.filter((i) => i.status === "open") ?? [];
  const rest = seo?.issues.filter((i) => i.status !== "open") ?? [];
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Onaylı onarım", "Approved repairs")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Onayladığınız madde CMS kaydına yazılır (sayfa, rehber, blog). Kod şablonundaki hizmet URL’leri işaretlenir.",
          "Approved items write into CMS records (pages, guides, posts). Service URLs from code are marked done.",
        )}
      </p>
      {note && <p className="mt-4 text-sm text-gold-deep">{note}</p>}
      <div className="mt-8 space-y-3">
        {open.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted">
                  {issue.url} · {issue.severity}
                </p>
                <p className="mt-1 font-medium">{t(locale, issue.titleTr, issue.titleEn)}</p>
                <p className="mt-1 text-sm text-ink-soft">{issue.suggestion}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full bg-navy px-3 py-1.5 text-xs text-cream"
                  onClick={() => setNote(applySeoIssue(issue.id))}
                >
                  {t(locale, "Onayla ve uygula", "Approve & apply")}
                </button>
                <button type="button" className="btn btn-sm" onClick={() => setIssueStatus(issue.id, "ignored")}>
                  {t(locale, "Yoksay", "Ignore")}
                </button>
              </div>
            </div>
          </div>
        ))}
        {rest.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-line bg-paper p-5 opacity-70">
            <p className="text-xs text-muted">
              {issue.url} · {issue.status}
            </p>
            <p className="mt-1 font-medium">{t(locale, issue.titleTr, issue.titleEn)}</p>
          </div>
        ))}
        {seo && seo.issues.length === 0 && <p className="text-sm text-muted">{t(locale, "Önce tarama çalıştırın.", "Run a crawl first.")}</p>}
      </div>
    </div>
  );
}
