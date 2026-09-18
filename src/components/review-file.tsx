"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentRow } from "@/components/document-row";
import { AdminFeeField } from "@/components/admin-fee-field";
import { StatusBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplication, markFileOutcome, reviewDocument, setAdvisorNote, setFileAppointment, subscribeStore } from "@/lib/store";
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
    void import("@/lib/ops-client").then((mod) => mod.pullOps().then(load));
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
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <form
            className="rounded-2xl border border-line bg-paper p-5"
            onSubmit={(e) => {
              e.preventDefault();
              setAdvisorNote(app.id, note);
              setNote("");
            }}
          >
            <label className="block text-xs text-muted">
              {t(locale, "Müşteriye not (e-posta ve WhatsApp)", "Note to client (email and WhatsApp)")}
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
          <form
            className="rounded-2xl border border-line bg-paper p-5"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setFileAppointment(app.id, {
                date: String(data.get("date") || ""),
                time: String(data.get("time") || ""),
                cityTr: String(data.get("city") || ""),
                cityEn: String(data.get("city") || ""),
                venueTr: String(data.get("venue") || ""),
                venueEn: String(data.get("venue") || ""),
                bringTr: String(data.get("bring") || ""),
                bringEn: String(data.get("bring") || ""),
                mapsUrl: String(data.get("maps") || "") || undefined,
                docUrl: String(data.get("doc") || "") || undefined,
              });
            }}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t(locale, "Randevu kaydı", "Appointment")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input name="date" type="date" required defaultValue={app.appointment?.date} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm" />
              <input name="time" type="time" required defaultValue={app.appointment?.time} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm" />
              <input name="city" required placeholder={t(locale, "Şehir", "City")} defaultValue={app.appointment?.cityTr} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm" />
              <input name="venue" required placeholder={t(locale, "Başvuru merkezi", "Application centre")} defaultValue={app.appointment?.venueTr} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm sm:col-span-2" />
              <textarea name="bring" rows={2} placeholder={t(locale, "Yanında götürülecekler", "What to bring")} defaultValue={app.appointment?.bringTr} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm sm:col-span-2" />
              <input name="maps" placeholder="https://maps..." defaultValue={app.appointment?.mapsUrl} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm sm:col-span-2" />
              <input name="doc" placeholder={t(locale, "Randevu belgesi URL", "Appointment letter URL")} defaultValue={app.appointment?.docUrl} className="rounded-lg border border-line bg-cream px-3 py-2 text-sm sm:col-span-2" />
            </div>
            <button type="submit" className="btn btn-sm mt-3">
              {t(locale, "Randevuyu kaydet", "Save appointment")}
            </button>
          </form>
        </div>
      )}
      {(user?.role === "admin" || user?.role === "staff") && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm" onClick={() => markFileOutcome(app.id, "ready")}>
            {t(locale, "Başvuruya hazır", "Ready to apply")}
          </button>
          <button type="button" className="btn btn-sm" onClick={() => markFileOutcome(app.id, "complete")}>
            {t(locale, "Dosyayı sonuçlandı işaretle", "Mark file closed")}
          </button>
        </div>
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
