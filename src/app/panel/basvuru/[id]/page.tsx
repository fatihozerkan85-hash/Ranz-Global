"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentRow } from "@/components/document-row";
import { StatusBadge } from "@/components/badges";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplication, nextAction, progressOf, subscribeStore, uploadDocument } from "@/lib/store";
import type { Application } from "@/lib/types";

export default function ApplicationPage() {
  const params = useParams<{ id: string }>();
  const { locale } = useLocale();
  const [app, setApp] = useState<Application | undefined>();

  useEffect(() => {
    const load = () => setApp(getApplication(params.id));
    load();
    return subscribeStore(load);
  }, [params.id]);

  if (!app) {
    return <p className="text-sm text-muted">{t(locale, "Dosya bulunamadı.", "File not found.")}</p>;
  }

  const p = progressOf(app);
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">{app.id}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl">
            {t(locale, app.destinationTr, app.destinationEn)}
          </h1>
          <StatusBadge status={app.status} locale={locale} />
        </div>
        <p className="mt-3 text-sm text-ink-soft">{nextAction(app, locale)}</p>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted">
            <span>{t(locale, "Zorunlu evrak", "Required documents")}</span>
            <span>
              {p.done}/{p.total}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-paper px-5">
          {app.documents.map((doc) => (
            <DocumentRow
              key={doc.key}
              doc={doc}
              locale={locale}
              onUpload={(file) => uploadDocument(app.id, doc.key, file.name)}
            />
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {t(locale, "Danışman notu", "Advisor note")}
          </p>
          <p className="mt-2 font-medium">{app.advisorName}</p>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {t(locale, app.advisorNoteTr, app.advisorNoteEn)}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {t(locale, "Süreç", "Timeline")}
          </p>
          <ol className="mt-4 space-y-4">
            {app.timeline.map((item) => (
              <li key={item.at} className="border-l border-gold pl-4">
                <p className="text-xs text-muted">{item.at}</p>
                <p className="text-sm font-medium">{t(locale, item.titleTr, item.titleEn)}</p>
                <p className="mt-1 text-xs text-ink-soft">{t(locale, item.bodyTr, item.bodyEn)}</p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
