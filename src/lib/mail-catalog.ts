export const MAIL_EVENT_IDS = [
  "signup",
  "password_reset",
  "doc_status",
  "advisor_note",
  "advisor_assigned",
  "assignment_left",
  "file_opened",
  "all_docs_uploaded",
  "docs_submitted",
  "file_complete",
  "staff_created",
  "contact_form",
  "contact_form_client",
  "refusal_form",
  "refusal_form_client",
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
  { id: "password_reset", locked: true, defaultOn: true, labelTr: "Şifre sıfırlama — kullanıcı", labelEn: "Password reset — user" },
  { id: "doc_status", locked: true, defaultOn: true, labelTr: "Evrak onay / revizyon — müşteri ve danışman", labelEn: "Document approved / revision — client and advisor" },
  { id: "advisor_note", locked: true, defaultOn: true, labelTr: "Danışman notu / uyarı — müşteri", labelEn: "Advisor note — client" },
  { id: "advisor_assigned", locked: true, defaultOn: true, labelTr: "Dosya atandı — danışman", labelEn: "File assigned — advisor" },
  { id: "assignment_left", locked: false, defaultOn: true, labelTr: "Atama değişti — önceki danışman", labelEn: "Reassigned — previous advisor" },
  { id: "file_opened", locked: true, defaultOn: true, labelTr: "Yeni dosya — yönetici", labelEn: "New file — admin" },
  { id: "all_docs_uploaded", locked: false, defaultOn: false, labelTr: "Eski: her evrak yüklemesinde mail", labelEn: "Legacy: mail on each document upload" },
  { id: "docs_submitted", locked: true, defaultOn: true, labelTr: "Evraklar gönderildi — müşteri ve yönetici", labelEn: "Documents submitted — client and admin" },
  { id: "file_complete", locked: false, defaultOn: true, labelTr: "Dosya tamamlandı — müşteri ve yönetici", labelEn: "File complete — client and admin" },
  { id: "staff_created", locked: false, defaultOn: true, labelTr: "Danışman hesabı açıldı — danışman", labelEn: "Advisor account created" },
  { id: "contact_form", locked: false, defaultOn: true, labelTr: "İletişim formu — yönetici", labelEn: "Contact form — admin" },
  {
    id: "contact_form_client",
    locked: false,
    defaultOn: true,
    labelTr: "İletişim formu — müşteriye alındı onayı",
    labelEn: "Contact form — received confirmation to client",
  },
  { id: "refusal_form", locked: true, defaultOn: true, labelTr: "Vize ret dosyası — yönetici", labelEn: "Visa refusal file — admin" },
  {
    id: "refusal_form_client",
    locked: true,
    defaultOn: true,
    labelTr: "Vize ret dosyası — müşteriye alındı onayı",
    labelEn: "Visa refusal file — received confirmation to client",
  },
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
