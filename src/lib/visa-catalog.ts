import type { VisaType } from "./types";

const schengenDocs: VisaType["documents"] = [
  { key: "passport", labelTr: "Pasaport (son 10 yıl, 2 boş sayfa)", labelEn: "Passport (issued in last 10 years, 2 blank pages)", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "Başvuru formu", labelEn: "Application form", required: true },
  { key: "flight", labelTr: "Uçak rezervasyonu", labelEn: "Flight reservation", required: true },
  { key: "hotel", labelTr: "Konaklama rezervasyonu", labelEn: "Hotel reservation", required: true },
  { key: "insurance", labelTr: "Seyahat sağlık sigortası", labelEn: "Travel medical insurance", required: true },
  { key: "bank", labelTr: "Banka hesap dökümü (son 3 ay)", labelEn: "Bank statements (last 3 months)", required: true },
  { key: "work", labelTr: "İş / gelir belgesi", labelEn: "Employment or income proof", required: true },
  { key: "invite", labelTr: "Davet mektubu", labelEn: "Invitation letter", required: false },
];

const usBDocs: VisaType["documents"] = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "ds160", labelTr: "DS-160 onay sayfası", labelEn: "DS-160 confirmation", required: true },
  { key: "photo", labelTr: "Fotoğraf (5×5 cm)", labelEn: "Photo (5×5 cm)", required: true },
  { key: "appointment", labelTr: "Randevu teyidi", labelEn: "Appointment confirmation", required: true },
  { key: "finance", labelTr: "Mali durum belgesi", labelEn: "Financial evidence", required: true },
  { key: "itinerary", labelTr: "Seyahat planı", labelEn: "Travel itinerary", required: true },
  { key: "invite", labelTr: "Davet / sponsor yazısı", labelEn: "Invitation or sponsor letter", required: false },
];

const usStudentDocs: VisaType["documents"] = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "i20", labelTr: "I-20 formu", labelEn: "Form I-20", required: true },
  { key: "ds160", labelTr: "DS-160 onay sayfası", labelEn: "DS-160 confirmation", required: true },
  { key: "sevis", labelTr: "SEVIS ödeme belgesi", labelEn: "SEVIS payment receipt", required: true },
  { key: "photo", labelTr: "Fotoğraf", labelEn: "Photo", required: true },
  { key: "finance", labelTr: "Mali yeterlilik", labelEn: "Financial ability", required: true },
  { key: "admission", labelTr: "Kabul mektubu", labelEn: "Admission letter", required: true },
];

export const VISA_TYPES: VisaType[] = [
  {
    id: "schengen-tourist",
    family: "europe",
    titleTr: "Schengen turistik",
    titleEn: "Schengen tourist",
    hintTr: "Kısa konaklama, tur ve aile ziyareti",
    titleHintEn: "Short stay, tourism and family visits",
    feeTry: 18500,
    documents: schengenDocs,
  },
  {
    id: "schengen-business",
    family: "europe",
    titleTr: "Schengen ticari",
    titleEn: "Schengen business",
    hintTr: "Fuar, toplantı ve iş seyahati",
    titleHintEn: "Fairs, meetings and business travel",
    feeTry: 21000,
    documents: [
      ...schengenDocs.filter((d) => d.key !== "invite"),
      { key: "invite", labelTr: "Şirket davet mektubu", labelEn: "Company invitation", required: true },
      { key: "trade", labelTr: "Ticaret sicil / şirket evrakı", labelEn: "Company registry documents", required: true },
    ],
  },
  {
    id: "us-b1b2",
    family: "america",
    titleTr: "ABD B1/B2",
    titleEn: "USA B1/B2",
    hintTr: "Turistik ve kısa süreli iş ziyareti",
    titleHintEn: "Tourism and short business visits",
    feeTry: 24500,
    documents: usBDocs,
  },
  {
    id: "us-f1",
    family: "america",
    titleTr: "ABD öğrenci (F-1)",
    titleEn: "USA student (F-1)",
    hintTr: "Üniversite ve dil okulu",
    titleHintEn: "University and language school",
    feeTry: 28000,
    documents: usStudentDocs,
  },
];

export function visaTypeById(id: string) {
  return VISA_TYPES.find((v) => v.id === id);
}
