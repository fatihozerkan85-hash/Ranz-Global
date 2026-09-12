"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentRow } from "@/components/document-row";
import { AdminFeeField } from "@/components/admin-fee-field";
import { StatusBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplication, reviewDocument, setAdvisorNote, subscribeStore } from "@/lib/store";
import type { Application } from "@/lib/types";

export function ReviewFile() {
  const params = useParams<{ id: string }>();
  const { locale } = useLocale();
  const { user } = useAuth();
  const [app, setApp] = useState<Application | undefined>();
  const [note, setNote] = useState("");

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
        {app.id} · {app.advisorName} · {app.feeTry.toLocaleString("tr-TR")} TL
      </p>
      {user?.role === "admin" && (
        <div className="mt-4 max-w-xs">
          <AdminFeeField appId={app.id} feeTry={app.feeTry} locale={locale} />
        </div>
      )}
      {(user?.role === "admin" || user?.role === "staff") && (
        <form
          className="mt-6 max-w-xl rounded-2xl border border-line bg-paper p-5"
          onSubmit={(e) => {
            e.preventDefault();
            setAdvisorNote(app.id, note);
            setNote("");
          }}
        >
          <label className="block text-xs text-muted">
            {t(locale, "Müşteriye not / uyarı (e-posta gider)", "Note to client (sends email)")}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
          </label>
          <button type="submit" className="btn btn-sm mt-3">
            {t(locale, "Gönder", "Send")}
          </button>
        </form>
      )}
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
