import type { VisaCountry, VisaType } from "./types";

type Docs = VisaType["documents"];

const schengenDocs: Docs = [
  { key: "passport", labelTr: "Pasaport (son 10 yıl, 2 boş sayfa)", labelEn: "Passport (issued in last 10 years, 2 blank pages)", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "Schengen başvuru formu", labelEn: "Schengen application form", required: true },
  { key: "flight", labelTr: "Uçak rezervasyonu", labelEn: "Flight reservation", required: true },
  { key: "hotel", labelTr: "Konaklama rezervasyonu", labelEn: "Hotel reservation", required: true },
  { key: "insurance", labelTr: "Seyahat sağlık sigortası (min. 30.000 €)", labelEn: "Travel medical insurance (min. €30,000)", required: true },
  { key: "bank", labelTr: "Banka hesap dökümü (son 3 ay)", labelEn: "Bank statements (last 3 months)", required: true },
  { key: "work", labelTr: "İş / gelir belgesi", labelEn: "Employment or income proof", required: true },
  { key: "invite", labelTr: "Davet mektubu", labelEn: "Invitation letter", required: false },
];

const usaDocs: Docs = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "ds160", labelTr: "DS-160 onay sayfası", labelEn: "DS-160 confirmation", required: true },
  { key: "photo", labelTr: "Fotoğraf (5×5 cm)", labelEn: "Photo (5×5 cm)", required: true },
  { key: "appointment", labelTr: "Konsolosluk randevu teyidi", labelEn: "Consular appointment confirmation", required: true },
  { key: "finance", labelTr: "Mali durum belgesi", labelEn: "Financial evidence", required: true },
  { key: "itinerary", labelTr: "Seyahat planı", labelEn: "Travel itinerary", required: true },
  { key: "work", labelTr: "İş / gelir belgesi", labelEn: "Employment or income proof", required: true },
  { key: "invite", labelTr: "Davet / sponsor yazısı", labelEn: "Invitation or sponsor letter", required: false },
];

const uaeDocs: Docs = [
  { key: "passport", labelTr: "Pasaport (en az 6 ay geçerli)", labelEn: "Passport (valid at least 6 months)", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "BAE vize başvuru formu", labelEn: "UAE visa application form", required: true },
  { key: "flight", labelTr: "Uçak rezervasyonu", labelEn: "Flight reservation", required: true },
  { key: "hotel", labelTr: "Otel / konaklama belgesi", labelEn: "Hotel booking", required: true },
  { key: "bank", labelTr: "Banka hesap dökümü", labelEn: "Bank statements", required: true },
  { key: "work", labelTr: "İş belgesi / maaş bordrosu", labelEn: "Employment letter / payslips", required: true },
  { key: "insurance", labelTr: "Seyahat sigortası", labelEn: "Travel insurance", required: false },
];

const chinaDocs: Docs = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "Çin vize başvuru formu", labelEn: "China visa application form", required: true },
  { key: "flight", labelTr: "Uçak rezervasyonu", labelEn: "Flight reservation", required: true },
  { key: "hotel", labelTr: "Otel rezervasyonu veya davet", labelEn: "Hotel booking or invitation", required: true },
  { key: "itinerary", labelTr: "Seyahat programı", labelEn: "Travel itinerary", required: true },
  { key: "bank", labelTr: "Banka hesap dökümü", labelEn: "Bank statements", required: true },
  { key: "work", labelTr: "İş / gelir belgesi", labelEn: "Employment or income proof", required: true },
];

const russiaDocs: Docs = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "Rusya vize başvuru formu", labelEn: "Russia visa application form", required: true },
  { key: "invite", labelTr: "Turistik vize davetiyesi / voucher", labelEn: "Tourist invitation / voucher", required: true },
  { key: "insurance", labelTr: "Seyahat sağlık sigortası", labelEn: "Travel medical insurance", required: true },
  { key: "flight", labelTr: "Uçak rezervasyonu", labelEn: "Flight reservation", required: true },
  { key: "hotel", labelTr: "Konaklama belgesi", labelEn: "Accommodation proof", required: true },
];

const ukDocs: Docs = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "UKVI başvuru özeti", labelEn: "UKVI application summary", required: true },
  { key: "bank", labelTr: "Banka hesap dökümü (son 6 ay)", labelEn: "Bank statements (last 6 months)", required: true },
  { key: "work", labelTr: "İş belgesi ve bordro", labelEn: "Employment letter and payslips", required: true },
  { key: "itinerary", labelTr: "Seyahat planı", labelEn: "Travel itinerary", required: true },
  { key: "hotel", labelTr: "Konaklama belgesi", labelEn: "Accommodation proof", required: true },
  { key: "ties", labelTr: "Türkiye’ye dönüş bağları (tapu, aile vb.)", labelEn: "Proof of ties to home country", required: false },
];

const canadaDocs: Docs = [
  { key: "passport", labelTr: "Pasaport", labelEn: "Passport", required: true },
  { key: "photo", labelTr: "Biyometrik fotoğraf", labelEn: "Biometric photo", required: true },
  { key: "form", labelTr: "IRCC başvuru formu / özeti", labelEn: "IRCC application form / summary", required: true },
  { key: "bank", labelTr: "Banka hesap dökümü", labelEn: "Bank statements", required: true },
  { key: "work", labelTr: "İş / gelir belgesi", labelEn: "Employment or income proof", required: true },
  { key: "itinerary", labelTr: "Seyahat planı", labelEn: "Travel itinerary", required: true },
  { key: "hotel", labelTr: "Konaklama / davet", labelEn: "Accommodation or invitation", required: true },
  { key: "family", labelTr: "Aile bağları belgesi", labelEn: "Family ties documents", required: false },
];

export const VISA_TYPES: VisaType[] = [
  {
    id: "schengen",
    family: "schengen",
    titleTr: "Schengen ülkeleri",
    titleEn: "Schengen countries",
    hintTr: "Avrupa kısa konaklama, tur ve aile ziyareti",
    titleHintEn: "Short stay in Europe, tourism and family visits",
    feeTry: 18500,
    documents: schengenDocs,
  },
  {
    id: "usa",
    family: "usa",
    titleTr: "Amerika Birleşik Devletleri",
    titleEn: "United States",
    hintTr: "B1/B2 turistik ve kısa süreli iş ziyareti",
    titleHintEn: "B1/B2 tourism and short business visits",
    feeTry: 24500,
    documents: usaDocs,
  },
  {
    id: "uae",
    family: "uae",
    titleTr: "Birleşik Arap Emirlikleri",
    titleEn: "United Arab Emirates",
    hintTr: "Dubai, Abu Dabi ve diğer emirlikler",
    titleHintEn: "Dubai, Abu Dhabi and other emirates",
    feeTry: 16500,
    documents: uaeDocs,
  },
  {
    id: "china",
    family: "china",
    titleTr: "Çin",
    titleEn: "China",
    hintTr: "Turistik ve kısa süreli ziyaret",
    titleHintEn: "Tourism and short visits",
    feeTry: 19500,
    documents: chinaDocs,
  },
  {
    id: "russia",
    family: "russia",
    titleTr: "Rusya",
    titleEn: "Russia",
    hintTr: "Turistik vize ve davetiye süreci",
    titleHintEn: "Tourist visa and invitation process",
    feeTry: 17500,
    documents: russiaDocs,
  },
  {
    id: "uk",
    family: "uk",
    titleTr: "İngiltere",
    titleEn: "United Kingdom",
    hintTr: "Standart ziyaretçi vizesi",
    titleHintEn: "Standard visitor visa",
    feeTry: 22500,
    documents: ukDocs,
  },
  {
    id: "canada",
    family: "canada",
    titleTr: "Kanada",
    titleEn: "Canada",
    hintTr: "Ziyaretçi vizesi / eTA danışmanlığı",
    titleHintEn: "Visitor visa / eTA consultancy",
    feeTry: 23500,
    documents: canadaDocs,
  },
];

export function visaTypeById(id: string) {
  return VISA_TYPES.find((v) => v.id === id);
}

export function isVisaCountry(id: string): id is VisaCountry {
  return VISA_TYPES.some((v) => v.id === id);
}
