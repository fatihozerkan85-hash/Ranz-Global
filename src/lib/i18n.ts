import type { AppStatus, DocStatus, Locale } from "./types";

export function t(locale: Locale, tr: string, en: string) {
  return locale === "en" ? en : tr;
}

export const STATUS_LABEL: Record<AppStatus, { tr: string; en: string }> = {
  draft: { tr: "Taslak", en: "Draft" },
  missing: { tr: "Evrak eksik", en: "Documents missing" },
  review: { tr: "İncelemede", en: "In review" },
  revision: { tr: "Revizyon", en: "Revision" },
  complete: { tr: "Tamamlandı", en: "Complete" },
};

export const DOC_LABEL: Record<DocStatus, { tr: string; en: string }> = {
  empty: { tr: "Yüklenmedi", en: "Not uploaded" },
  uploaded: { tr: "Kontrol bekliyor", en: "Awaiting review" },
  approved: { tr: "Onaylı", en: "Approved" },
  rejected: { tr: "Revizyon", en: "Needs revision" },
};
