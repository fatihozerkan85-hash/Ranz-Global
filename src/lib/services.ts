import type { Locale } from "./types";
import { t } from "./i18n";

export type ServiceSlug =
  | "ingiltere"
  | "abd"
  | "kanada"
  | "schengen"
  | "dubai"
  | "cin"
  | "rusya"
  | "almanya"
  | "danimarka";

export type ProfileId = "employee" | "owner" | "retired" | "student" | "sponsored";

export const SCOPE_TR = [
  "Başvuru profilinin ön değerlendirmesi",
  "Kişiye özel evrak listesi",
  "Online başvuru formunun hazırlanması",
  "Evrak kontrolü",
  "Mali durum ve seyahat amacının dosya bütünlüğü açısından kontrolü",
  "Gerekli dilekçelerin hazırlanması",
  "Randevu sürecinde destek",
  "Başvuru öncesi son dosya kontrolü",
  "Süreç boyunca danışman desteği",
];

export const SCOPE_EN = [
  "Preliminary assessment of the applicant profile",
  "A document list tailored to you",
  "Help preparing the online application form",
  "Document review",
  "Checking finances and travel purpose for file consistency",
  "Drafting supporting letters where needed",
  "Support during the appointment process",
  "Final file check before submission",
  "Advisor support throughout the process",
];

export type Service = {
  slug: ServiceSlug;
  flag: string;
  titleTr: string;
  titleEn: string;
  visaTr: string;
  visaEn: string;
  fee: string;
  feeNoteTr?: string;
  destId: string;
  quizKey: string;
};

export const SERVICES: Service[] = [
  {
    slug: "ingiltere",
    flag: "gb",
    titleTr: "İngiltere Vizesi",
    titleEn: "UK Visa",
    visaTr: "Ziyaretçi Vizesi (Standard Visitor)",
    visaEn: "Standard Visitor Visa",
    fee: "350 USD",
    destId: "uk",
    quizKey: "uk",
  },
  {
    slug: "abd",
    flag: "us",
    titleTr: "ABD Vizesi",
    titleEn: "USA Visa",
    visaTr: "B1/B2 Ziyaretçi Vizesi",
    visaEn: "B1/B2 Visitor Visa",
    fee: "350 USD",
    destId: "usa",
    quizKey: "usa",
  },
  {
    slug: "kanada",
    flag: "ca",
    titleTr: "Kanada Vizesi",
    titleEn: "Canada Visa",
    visaTr: "Ziyaretçi Vizesi",
    visaEn: "Visitor Visa",
    fee: "350 USD",
    destId: "canada",
    quizKey: "canada",
  },
  {
    slug: "schengen",
    flag: "eu",
    titleTr: "Schengen Vizesi",
    titleEn: "Schengen Visa",
    visaTr: "Kısa Konaklama (C tipi)",
    visaEn: "Short-stay (type C)",
    fee: "320 EUR",
    destId: "schengen",
    quizKey: "schengen",
  },
  {
    slug: "almanya",
    flag: "de",
    titleTr: "Almanya Vizesi",
    titleEn: "Germany Visa",
    visaTr: "Schengen kısa konaklama",
    visaEn: "Schengen short-stay",
    fee: "320 EUR",
    destId: "schengen",
    quizKey: "schengen",
  },
  {
    slug: "danimarka",
    flag: "dk",
    titleTr: "Danimarka Vizesi",
    titleEn: "Denmark Visa",
    visaTr: "Schengen kısa konaklama",
    visaEn: "Schengen short-stay",
    fee: "320 EUR",
    destId: "schengen",
    quizKey: "schengen",
  },
  {
    slug: "dubai",
    flag: "ae",
    titleTr: "BAE / Dubai Vizesi",
    titleEn: "UAE / Dubai Visa",
    visaTr: "Turistik vize",
    visaEn: "Tourist visa",
    fee: "",
    destId: "uae",
    quizKey: "uae",
  },
  {
    slug: "cin",
    flag: "cn",
    titleTr: "Çin Vizesi",
    titleEn: "China Visa",
    visaTr: "Turistik vize",
    visaEn: "Tourist visa",
    fee: "",
    destId: "china",
    quizKey: "china",
  },
  {
    slug: "rusya",
    flag: "ru",
    titleTr: "Rusya Vizesi",
    titleEn: "Russia Visa",
    visaTr: "Turistik vize",
    visaEn: "Tourist visa",
    fee: "",
    destId: "russia",
    quizKey: "russia",
  },
];

export const PRICED_SLUGS: ServiceSlug[] = ["ingiltere", "abd", "almanya", "danimarka"];

export const HOME_DEST_SLUGS: ServiceSlug[] = [
  "ingiltere",
  "abd",
  "kanada",
  "schengen",
  "dubai",
  "cin",
  "rusya",
];

export const PROCESS_STEPS = [
  {
    n: "01",
    titleTr: "Ön Değerlendirme",
    titleEn: "Preliminary assessment",
    bodyTr: "Seyahat amacınızı ve başvuru profilinizi değerlendiriyoruz.",
    bodyEn: "We assess your travel purpose and applicant profile.",
  },
  {
    n: "02",
    titleTr: "Kişiye Özel Evrak Listesi",
    titleEn: "Tailored document list",
    bodyTr: "Mesleğinize ve seyahat amacınıza göre gerekli belgeleri belirliyoruz.",
    bodyEn: "We set the documents required for your occupation and travel purpose.",
  },
  {
    n: "03",
    titleTr: "Başvuru Formları",
    titleEn: "Application forms",
    bodyTr: "İlgili ülkenin vize başvuru formlarının hazırlanmasında destek sağlıyoruz.",
    bodyEn: "We help prepare the destination country’s visa forms.",
  },
  {
    n: "04",
    titleTr: "Evrak Kontrolü",
    titleEn: "Document review",
    bodyTr: "Belgeleriniz uzman danışman tarafından tek tek inceleniyor.",
    bodyEn: "An advisor reviews each document individually.",
  },
  {
    n: "05",
    titleTr: "Dosya Hazırlığı",
    titleEn: "File preparation",
    bodyTr: "Başvurunuzun tutarlı ve eksiksiz sunulması için dosyanızı hazırlıyoruz.",
    bodyEn: "We assemble a consistent, complete file for submission.",
  },
  {
    n: "06",
    titleTr: "Randevu Süreci",
    titleEn: "Appointments",
    bodyTr: "Uygun olan başvurularda randevu sürecinde destek veriyoruz.",
    bodyEn: "Where applicable, we support the appointment process.",
  },
  {
    n: "07",
    titleTr: "Başvuru Öncesi Son Kontrol",
    titleEn: "Final check",
    bodyTr: "Dosyanızı teslimden önce yeniden kontrol ediyoruz.",
    bodyEn: "We check the file again before it is submitted.",
  },
  {
    n: "08",
    titleTr: "Süreç Takibi",
    titleEn: "Tracking",
    bodyTr: "Başvuru durumunuzu Ranz Global panelinizden takip ediyorsunuz.",
    bodyEn: "You follow status in your Ranz Global portal.",
  },
];

export const WHY_POINTS = [
  {
    titleTr: "Kişiye özel dosya hazırlığı",
    titleEn: "A file built around you",
    bodyTr: "Her başvuruyu başvuru sahibinin durumuna göre değerlendiriyoruz.",
    bodyEn: "Every file is assessed against that applicant’s circumstances.",
  },
  {
    titleTr: "Uzman evrak kontrolü",
    titleEn: "Specialist document review",
    bodyTr: "Belgeleriniz başvurudan önce danışmanlarımız tarafından kontrol edilir.",
    bodyEn: "Documents are reviewed by advisors before submission.",
  },
  {
    titleTr: "Şeffaf süreç",
    titleEn: "A transparent process",
    bodyTr: "Dosyanızın hangi aşamada olduğunu panelinizden takip edebilirsiniz.",
    bodyEn: "You can see which stage your file is at in the portal.",
  },
  {
    titleTr: "Tek noktadan yönetim",
    titleEn: "One place for the file",
    bodyTr: "Belgeleriniz, danışman notları ve başvuru süreciniz tek panelde.",
    bodyEn: "Documents, advisor notes and progress sit in one portal.",
  },
  {
    titleTr: "Türkiye ve KKTC danışmanlığı",
    titleEn: "Türkiye and TRNC consultancy",
    bodyTr: "Başvuruyu Türkiye veya KKTC’den yürütenler için süreç buna göre kurulur.",
    bodyEn: "The process is set up for applications from Türkiye or the TRNC.",
  },
  {
    titleTr: "WhatsApp ve e-posta desteği",
    titleEn: "WhatsApp and email support",
    bodyTr: "Dosya notlarının yanında doğrudan yazışma kanalı açık kalır.",
    bodyEn: "You can reach us on WhatsApp and email alongside portal notes.",
  },
];

const BASE_DOCS: Record<string, { tr: string; en: string }[]> = {
  uk: [
    { tr: "Pasaport", en: "Passport" },
    { tr: "Biyometrik fotoğraf", en: "Biometric photo" },
    { tr: "Seyahat planı ve konaklama", en: "Itinerary and accommodation" },
    { tr: "Banka hesap dökümü (son 6 ay)", en: "Bank statements (last 6 months)" },
  ],
  usa: [
    { tr: "Pasaport", en: "Passport" },
    { tr: "DS-160 için bilgiler", en: "Information for DS-160" },
    { tr: "Mali durum belgesi", en: "Financial evidence" },
    { tr: "Seyahat planı", en: "Travel itinerary" },
  ],
  canada: [
    { tr: "Pasaport", en: "Passport" },
    { tr: "Biyometrik fotoğraf", en: "Biometric photo" },
    { tr: "Seyahat ve konaklama", en: "Travel and accommodation" },
    { tr: "Mali belgeler", en: "Financial documents" },
  ],
  schengen: [
    { tr: "Pasaport (2 boş sayfa)", en: "Passport (2 blank pages)" },
    { tr: "Biyometrik fotoğraf", en: "Biometric photo" },
    { tr: "Uçak ve otel rezervasyonu", en: "Flight and hotel booking" },
    { tr: "Seyahat sağlık sigortası", en: "Travel medical insurance" },
    { tr: "Banka dökümü (son 3 ay)", en: "Bank statements (last 3 months)" },
  ],
  uae: [
    { tr: "Pasaport (en az 6 ay)", en: "Passport (min. 6 months)" },
    { tr: "Fotoğraf", en: "Photo" },
    { tr: "Uçak ve otel", en: "Flight and hotel" },
  ],
  china: [
    { tr: "Pasaport", en: "Passport" },
    { tr: "Form ve fotoğraf", en: "Form and photo" },
    { tr: "Uçak, otel veya davet", en: "Flight, hotel or invitation" },
  ],
  russia: [
    { tr: "Pasaport", en: "Passport" },
    { tr: "Davetiye / voucher", en: "Invitation / voucher" },
    { tr: "Sigorta ve rezervasyon", en: "Insurance and bookings" },
  ],
};

const PROFILE_EXTRAS: Record<ProfileId, { tr: string; en: string }[]> = {
  employee: [
    { tr: "İşveren yazısı", en: "Employer letter" },
    { tr: "Maaş bordrosu (son 3–6 ay)", en: "Payslips (last 3–6 months)" },
    { tr: "SGK hizmet dökümü", en: "Social-security record" },
  ],
  owner: [
    { tr: "Şirket evrakı (vergi levhası, faaliyet belgesi)", en: "Company papers (tax plate, activity certificate)" },
    { tr: "Şirket hesap hareketi", en: "Company account activity" },
    { tr: "İmza sirküleri", en: "Signature circular" },
  ],
  retired: [
    { tr: "Emeklilik belgesi", en: "Pension certificate" },
    { tr: "Emekli maaşı dökümü", en: "Pension payment record" },
  ],
  student: [
    { tr: "Öğrenci belgesi", en: "Student certificate" },
    { tr: "Okul izin / kayıt yazısı", en: "School enrolment or leave letter" },
    { tr: "Sponsor mali belgesi (varsa)", en: "Sponsor finances (if any)" },
  ],
  sponsored: [
    { tr: "Sponsor dilekçesi", en: "Sponsor letter" },
    { tr: "Sponsor kimliği ve mali belgesi", en: "Sponsor ID and finances" },
    { tr: "Akrabalık / ilişki belgesi", en: "Proof of relationship" },
  ],
};

export const PROFILES: { id: ProfileId; tr: string; en: string }[] = [
  { id: "employee", tr: "Çalışanım", en: "I am employed" },
  { id: "owner", tr: "Şirket sahibiyim", en: "I own a company" },
  { id: "retired", tr: "Emekliyim", en: "I am retired" },
  { id: "student", tr: "Öğrenciyim", en: "I am a student" },
  { id: "sponsored", tr: "Sponsorlu başvuracağım", en: "I will be sponsored" },
];

export function serviceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export function docsFor(quizKey: string, profile: ProfileId, locale: Locale) {
  const base = BASE_DOCS[quizKey] ?? BASE_DOCS.schengen;
  const extra = PROFILE_EXTRAS[profile];
  return [...base, ...extra].map((row) => t(locale, row.tr, row.en));
}

export const FEE_DISCLAIMER_TR =
  "Ranz Global danışmanlık ücreti ile konsolosluk, başvuru merkezi, biyometri, kurye ve diğer üçüncü taraf ücretleri birbirinden ayrıdır. Başvuru öncesinde ücretlendirme tarafınıza açık şekilde bildirilir.";

export const FEE_DISCLAIMER_EN =
  "Ranz Global’s consultancy fee is separate from consulate, visa-centre, biometrics, courier and other third-party charges. Fees are explained to you before you apply.";
