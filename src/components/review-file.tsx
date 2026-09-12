"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentRow } from "@/components/document-row";
import { StatusBadge } from "@/components/badges";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplication, reviewDocument, subscribeStore } from "@/lib/store";
import type { Application } from "@/lib/types";

export function ReviewFile() {
  const params = useParams<{ id: string }>();
  const { locale } = useLocale();
  const [app, setApp] = useState<Application | undefined>();

  useEffect(() => {
    const load = () => setApp(getApplication(params.id));
    load();
    return subscribeStore(load);
  }, [params.id]);

  if (!app) return <p className="text-sm text-muted">{t(locale, "Dosya bulunamadı.", "File not found.")}</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl">{t(locale, app.destinationTr, app.destinationEn)}</h1>
        <StatusBadge status={app.status} locale={locale} />
      </div>
      <p className="mt-2 text-sm text-muted">
        {app.id} · {app.advisorName}
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-paper px-5">
        {app.documents.map((doc) => (
          <DocumentRow
            key={doc.key}
            doc={doc}
            locale={locale}
            actions={
              doc.status === "uploaded" || doc.status === "rejected" || doc.status === "approved" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => reviewDocument(app.id, doc.key, "approved")}
                    className="rounded-full bg-[#e4efe6] px-3 py-1.5 text-xs text-[#215c38]"
                  >
                    {t(locale, "Onayla", "Approve")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const note = window.prompt(
                        t(locale, "Eksik / revizyon notu", "Revision note"),
                        doc.note || "",
                      );
                      if (note !== null) reviewDocument(app.id, doc.key, "rejected", note || undefined);
                    }}
                    className="rounded-full bg-[#f6e4dc] px-3 py-1.5 text-xs text-[#8a3b24]"
                  >
                    {t(locale, "Eksik", "Missing")}
                  </button>
                </div>
              ) : null
            }
          />
        ))}
      </div>
    </div>
  );
}
