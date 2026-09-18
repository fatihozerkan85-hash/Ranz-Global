import type { Application, FileAppointment, Locale, User, VisaCountry } from "./types";
import { t } from "./i18n";

export function firstNameOf(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

export function progressOfDocs(app: Application) {
  const required = app.documents.filter((d) => d.required);
  const uploaded = required.filter((d) => d.status !== "empty").length;
  const approved = required.filter((d) => d.status === "approved").length;
  const missing = required.filter((d) => d.status === "empty").length;
  const revision = required.filter((d) => d.status === "rejected").length;
  const pending = required.filter((d) => d.status === "uploaded").length;
  return { required: required.length, uploaded, approved, missing, revision, pending };
}

export function fileReadiness(app: Application) {
  const docs = progressOfDocs(app);
  const docPct = docs.required ? Math.round((docs.uploaded / docs.required) * 100) : 0;
  const formDocs = app.documents.filter((d) => isFormDoc(d.labelTr, d.labelEn, d.key));
  const formPct = formDocs.length
    ? Math.round((formDocs.filter((d) => d.status !== "empty").length / formDocs.length) * 100)
    : docs.required
      ? Math.round((docs.approved / docs.required) * 100)
      : 0;
  const bookingDocs = app.documents.filter((d) => isBookingDoc(d.labelTr, d.labelEn, d.key));
  const bookingPct = bookingDocs.length
    ? Math.round((bookingDocs.filter((d) => d.status === "approved" || d.status === "uploaded").length / bookingDocs.length) * 100)
    : docPct;
  const reviewPct = docs.required ? Math.round((docs.approved / docs.required) * 100) : 0;
  const paid = app.feeTry === 0 || app.paidTry > 0;
  const overall = Math.round(docPct * 0.45 + formPct * 0.15 + bookingPct * 0.15 + reviewPct * 0.2 + (paid ? 5 : 0));
  return {
    overall: Math.min(100, overall),
    docs: docPct,
    form: formPct,
    bookings: bookingPct,
    review: reviewPct,
    reviewWaiting: docs.pending > 0 || app.status === "review",
    paid,
    docsDetail: docs,
  };
}

export function isFormDoc(labelTr: string, labelEn: string, key: string) {
  const hay = `${labelTr} ${labelEn} ${key}`.toLowerCase();
  return /form|ds-?160|başvuru formu|basvuru formu|ukvi|online/.test(hay);
}

export function isBookingDoc(labelTr: string, labelEn: string, key: string) {
  const hay = `${labelTr} ${labelEn} ${key}`.toLowerCase();
  return /otel|hotel|uçuş|ucus|flight|rezerv|itiner|konaklama|seyahat plan/.test(hay);
}

export type HubStep = { id: string; label: string; state: "done" | "warn" | "current" | "todo" };

export function hubChecklist(app: Application, locale: Locale): HubStep[] {
  const p = progressOfDocs(app);
  const paid = app.feeTry === 0 || app.paidTry > 0;
  const listReady = app.documents.length > 0;
  const reviewDone = p.required > 0 && p.approved === p.required;
  return [
    {
      id: "pay",
      label: t(locale, "Ödeme tamamlandı", "Payment completed"),
      state: paid ? "done" : "todo",
    },
    {
      id: "list",
      label: t(locale, "Evrak listesi oluşturuldu", "Document list created"),
      state: listReady ? "done" : "todo",
    },
    {
      id: "up",
      label: t(locale, `${p.uploaded}/${p.required} evrak yüklendi`, `${p.uploaded}/${p.required} documents uploaded`),
      state: p.uploaded === p.required && p.required > 0 ? "done" : p.uploaded > 0 ? "current" : "todo",
    },
    {
      id: "miss",
      label:
        p.missing > 0
          ? t(locale, `${p.missing} evrak eksik`, `${p.missing} documents missing`)
          : t(locale, "Eksik evrak yok", "No missing documents"),
      state: p.missing > 0 ? "warn" : "done",
    },
    {
      id: "rev",
      label:
        p.revision > 0
          ? t(locale, `${p.revision} evrak revizyon bekliyor`, `${p.revision} documents need revision`)
          : p.pending > 0
            ? t(locale, "Danışman kontrolü bekleniyor", "Advisor review pending")
            : t(locale, "Danışman kontrolü", "Advisor review"),
      state: p.revision > 0 ? "warn" : p.pending > 0 ? "current" : reviewDone ? "done" : "todo",
    },
    {
      id: "ready",
      label: t(locale, "Başvuruya hazır", "Ready to apply"),
      state: app.status === "ready" || app.status === "complete" ? "done" : "todo",
    },
  ];
}

export function formatReviewedAt(value: string | undefined, locale: Locale) {
  if (!value) return t(locale, "Henüz inceleme kaydı yok.", "No review recorded yet.");
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const sameDay = new Date().toDateString() === d.toDateString();
  const time = d.toLocaleTimeString(locale === "en" ? "en-GB" : "tr-TR", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) {
    return t(locale, `Dosyanız en son bugün ${time}’de incelendi.`, `Your file was last reviewed today at ${time}.`);
  }
  const day = d.toLocaleDateString(locale === "en" ? "en-GB" : "tr-TR", { day: "numeric", month: "long" });
  return t(locale, `Dosyanız en son ${day} ${time}’de incelendi.`, `Your file was last reviewed on ${day} at ${time}.`);
}

export function advisorTitle(user: User | undefined, locale: Locale) {
  if (user?.titleTr || user?.titleEn) return t(locale, user.titleTr || "Vize uzmanı", user.titleEn || "Visa specialist");
  return t(locale, "Vize uzmanı", "Visa specialist");
}

export function visaBucket(family: VisaCountry): "uk" | "usa" | "canada" | "schengen" | "other" {
  if (family === "uk") return "uk";
  if (family === "usa") return "usa";
  if (family === "canada") return "canada";
  if (family === "schengen") return "schengen";
  return "other";
}

export function appointmentSoon(appt: FileAppointment | undefined, days = 14) {
  if (!appt?.date) return false;
  const t0 = new Date(`${appt.date}T${appt.time || "09:00"}`).getTime();
  if (Number.isNaN(t0)) return false;
  const diff = t0 - Date.now();
  return diff >= 0 && diff <= days * 86400000;
}

export function crmStatusOf(app: Application): "draft" | "missing" | "review" | "revision" | "ready" | "appointment" | "complete" {
  if (app.status === "complete") return "complete";
  if (app.appointment) return "appointment";
  if (app.status === "ready") return "ready";
  return app.status;
}
