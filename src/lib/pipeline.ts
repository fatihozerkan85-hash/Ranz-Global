import type { Application, Locale } from "./types";
import { t } from "./i18n";

export type StageState = "done" | "current" | "todo";

export type FileStage = {
  id: string;
  label: string;
  state: StageState;
};

export function fileStages(app: Application, locale: Locale): FileStage[] {
  const required = app.documents.filter((d) => d.required);
  const paid = app.paidTry > 0;
  const uploaded = required.length > 0 && required.every((d) => d.status !== "empty");
  const anyRejected = required.some((d) => d.status === "rejected");
  const anyPendingReview = required.some((d) => d.status === "uploaded");
  const allApproved = required.length > 0 && required.every((d) => d.status === "approved");
  const complete = app.status === "complete";

  const doneFlags = [
    paid,
    true,
    uploaded,
    uploaded && !anyPendingReview,
    uploaded && !anyPendingReview && !anyRejected,
    allApproved,
    allApproved,
    complete,
    complete,
  ];

  const labels = [
    t(locale, "Ödeme alındı", "Payment received"),
    t(locale, "Evrak listesi oluşturuldu", "Document list created"),
    t(locale, "Evraklar yüklendi", "Documents uploaded"),
    t(locale, "Danışman kontrolünde", "Advisor review"),
    t(locale, "Revizyon bekleniyor", "Revision needed"),
    t(locale, "Başvuruya hazır", "Ready to apply"),
    t(locale, "Randevu", "Appointment"),
    t(locale, "Başvuru yapıldı", "Application submitted"),
    t(locale, "Sonuç bekleniyor", "Awaiting decision"),
  ];

  let currentSet = false;
  return labels.map((label, i) => {
    const id = String(i);
    if (complete || doneFlags[i]) return { id, label, state: "done" as const };
    if (!currentSet) {
      currentSet = true;
      return { id, label, state: "current" as const };
    }
    return { id, label, state: "todo" as const };
  });
}
