export const MAIL_EVENT_IDS = [
  "signup",
  "doc_status",
  "advisor_note",
  "advisor_assigned",
  "assignment_left",
  "file_opened",
  "all_docs_uploaded",
  "file_complete",
  "staff_created",
  "contact_form",
  "fee_changed",
] as const;

export type MailEventId = (typeof MAIL_EVENT_IDS)[number];

export type MailEventMeta = {
  id: MailEventId;
  locked: boolean;
  defaultOn: boolean;
  labelTr: string;
  labelEn: string;
};

export const MAIL_EVENTS: MailEventMeta[] = [
  { id: "signup", locked: true, defaultOn: true, labelTr: "Kayıt — müşteriye hoş geldin", labelEn: "Sign-up — welcome to client" },
  { id: "doc_status", locked: true, defaultOn: true, labelTr: "Evrak durum değişimi — müşteri ve danışman", labelEn: "Document status — client and advisor" },
  { id: "advisor_note", locked: true, defaultOn: true, labelTr: "Danışman notu / uyarı — müşteri", labelEn: "Advisor note — client" },
  { id: "advisor_assigned", locked: true, defaultOn: true, labelTr: "Dosya atandı — danışman", labelEn: "File assigned — advisor" },
  { id: "assignment_left", locked: false, defaultOn: true, labelTr: "Atama değişti — önceki danışman", labelEn: "Reassigned — previous advisor" },
  { id: "file_opened", locked: false, defaultOn: true, labelTr: "Yeni dosya — danışman ve yönetici", labelEn: "New file — advisor and admin" },
  { id: "all_docs_uploaded", locked: false, defaultOn: true, labelTr: "Zorunlu evraklar yüklendi — danışman", labelEn: "Required docs uploaded — advisor" },
  { id: "file_complete", locked: false, defaultOn: true, labelTr: "Dosya tamamlandı — müşteri ve yönetici", labelEn: "File complete — client and admin" },
  { id: "staff_created", locked: false, defaultOn: true, labelTr: "Danışman hesabı açıldı — danışman", labelEn: "Advisor account created" },
  { id: "contact_form", locked: false, defaultOn: true, labelTr: "İletişim formu — yönetici", labelEn: "Contact form — admin" },
  { id: "fee_changed", locked: false, defaultOn: true, labelTr: "Hizmet bedeli değişti — yönetici", labelEn: "Fee changed — admin" },
];

export type MailSettings = Record<MailEventId, boolean>;

export function defaultMailSettings(): MailSettings {
  return Object.fromEntries(MAIL_EVENTS.map((e) => [e.id, e.defaultOn])) as MailSettings;
}

export function isMailEventId(value: string): value is MailEventId {
  return (MAIL_EVENT_IDS as readonly string[]).includes(value);
}

export function isDeliverableEmail(email: string | undefined | null) {
  if (!email) return false;
  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
  if (value.endsWith("@ranz.demo") || value.endsWith("@ranz.staff")) return false;
  return true;
}
