"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, setIssueStatus, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function FixesPage() {
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
      <h1 className="font-serif text-4xl">{t(locale, "Onaylı onarım", "Approved repairs")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Varsayılan: yayın öncesi onay. Onarım CMS kaydına yazılır; geri alınabilir.", "Default: approve before publish. Fixes write to CMS records and can be rolled back.")}
      </p>
      <div className="mt-8 space-y-3">
        {seo?.issues.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted">{issue.url} · {issue.severity}</p>
                <p className="mt-1 font-medium">{t(locale, issue.titleTr, issue.titleEn)}</p>
                <p className="mt-1 text-sm text-ink-soft">{issue.suggestion}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full bg-navy px-3 py-1.5 text-xs text-cream" onClick={() => setIssueStatus(issue.id, "applied")}>
                  {t(locale, "Onayla ve uygula", "Approve & apply")}
                </button>
                <button type="button" className="btn btn-sm" onClick={() => setIssueStatus(issue.id, "ignored")}>
                  {t(locale, "Yoksay", "Ignore")}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs uppercase tracking-wider text-gold-deep">{issue.status}</p>
          </div>
        ))}
        {seo && seo.issues.length === 0 && <p className="text-sm text-muted">{t(locale, "Önce tarama çalıştırın.", "Run a crawl first.")}</p>}
      </div>
    </div>
  );
}
