import type { BlogPost, CmsPage } from "./types";

export const SITE = {
  name: "Ranz Global",
  taglineTr: "Travel & Visa",
  taglineEn: "Travel & Visa",
  email: "info@ranzglobal.com",
  phoneDisplay: "+90 (212) 000 00 00",
  cityTr: "İstanbul, Türkiye",
  cityEn: "Istanbul, Turkey",
  url: "https://ranzglobal.com",
};

export const DEFAULT_PAGES: CmsPage[] = [
  {
    slug: "hakkimizda",
    titleTr: "Hakkımızda",
    titleEn: "About us",
    descriptionTr: "Ranz Global, Avrupa ve Amerika vize danışmanlığında evrak sürecini sadeleştirir.",
    descriptionEn: "Ranz Global simplifies document preparation for Europe and US visa consultancy.",
    bodyTr:
      "Ranz Global, vize danışmanlığını karmaşık form yığınından çıkarıp tek bir dosya deneyimine dönüştürür. Danışmanlarımız Schengen ve ABD başvurularında evrak listesini sizin adınıza kurar; siz yükler, biz inceleriz.\n\nKonsolosluk kararı resmi makamlara aittir. Bizim işimiz, dosyanızın eksiksiz, tutarlı ve takip edilebilir olmasını sağlamaktır.",
    bodyEn:
      "Ranz Global turns visa consultancy into a single file experience instead of a maze of forms. Advisors set the checklist for Schengen and US files; you upload, we review.\n\nConsular decisions belong to official authorities. Our work is to keep your file complete, consistent and trackable.",
    status: "published",
  },
  {
    slug: "hizmetler",
    titleTr: "Hizmetler",
    titleEn: "Services",
    descriptionTr: "Schengen turistik/ticari ve ABD B1/B2 ile F-1 öğrenci vize danışmanlığı.",
    descriptionEn: "Schengen tourist/business and US B1/B2 plus F-1 student visa consultancy.",
    bodyTr:
      "Avrupa vizeleri: Schengen turistik ve ticari dosyalar için güncel evrak listesi, yükleme ve danışman kontrolü.\n\nAmerika vizeleri: B1/B2 ve F-1 öğrenci başvurularında DS-160, mali belgeler ve randevu hazırlığı takibi.\n\nDosya takibi: eksik evrak, revizyon ve onay notları tek panelde.",
    bodyEn:
      "Europe visas: current checklists, uploads and advisor review for Schengen tourist and business files.\n\nUS visas: DS-160, financial evidence and interview prep tracking for B1/B2 and F-1.\n\nFile tracking: missing items, revisions and approval notes on one screen.",
    status: "published",
  },
  {
    slug: "iletisim",
    titleTr: "İletişim",
    titleEn: "Contact",
    descriptionTr: "Ranz Global ile görüşme talebi, e-posta ve WhatsApp.",
    descriptionEn: "Request a meeting with Ranz Global, or reach us by email and WhatsApp.",
    bodyTr: "Görüşme talebinizi bırakın; danışmanımız sizinle iletişime geçer. Acil sorular için WhatsApp hattını kullanabilirsiniz.",
    bodyEn: "Leave a meeting request and an advisor will contact you. For urgent questions, use WhatsApp.",
    status: "published",
  },
  {
    slug: "kvkk",
    titleTr: "KVKK Aydınlatma",
    titleEn: "Personal data notice",
    descriptionTr: "Kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
    descriptionEn: "Notice on the processing of your personal data.",
    bodyTr:
      "Ranz Global, vize danışmanlığı hizmeti kapsamında ad-soyad, iletişim ve evrak verilerinizi dosya takibi amacıyla işler. Veriler yetkisiz indirmeye kapalı saklanır; yasal saklama süreleri sonunda silinir veya anonimleştirilir.\n\nMetnin kesin hukuki metni Ranz Global tarafından sağlanır. Bu sayfa yer tutucudur.",
    bodyEn:
      "Ranz Global processes your name, contact and document data to track visa consultancy files. Files are stored with restricted download access.\n\nThe legally binding notice will be provided by Ranz Global. This page is a placeholder.",
    status: "published",
  },
  {
    slug: "gizlilik",
    titleTr: "Gizlilik politikası",
    titleEn: "Privacy policy",
    descriptionTr: "Ranz Global gizlilik politikası.",
    descriptionEn: "Ranz Global privacy policy.",
    bodyTr:
      "Sitede çerezler dil tercihi ve oturum için kullanılır. İletişim tıklamaları kişisel kimlik tutulmadan ölçülebilir. Üçüncü taraf analitik (GA4) bağlandığında ayrı onay alınır.",
    bodyEn:
      "Cookies are used for locale and session. Contact clicks can be measured without storing personal identity. GA4, when connected, requires separate consent.",
    status: "published",
  },
];

export const DEFAULT_GUIDES: CmsPage[] = [
  {
    slug: "schengen",
    titleTr: "Schengen vize rehberi",
    titleEn: "Schengen visa guide",
    descriptionTr: "Schengen turistik ve ticari başvurularda evrak çerçevesi.",
    descriptionEn: "Document framework for Schengen tourist and business applications.",
    bodyTr:
      "Schengen kısa konaklama vizelerinde pasaport süresi, biometrik fotoğraf, seyahat sağlık sigortası, uçuş ve konaklama rezervasyonu ile mali döküm temel belgelerdir. Ticari dosyalarda davet mektubu ve şirket evrakı zorunlu hale gelir.\n\nRanz Global panelinde size özel liste açılır; konsolosluk formunu burada doldurtmayız.",
    bodyEn:
      "For Schengen short-stay visas, passport validity, biometric photo, travel insurance, flight and hotel reservations and bank statements are core. Business files add invitation and company papers.\n\nYour personal checklist opens in the Ranz Global portal; we do not dump consular forms here.",
    status: "published",
  },
  {
    slug: "abd",
    titleTr: "ABD vize rehberi",
    titleEn: "USA visa guide",
    descriptionTr: "B1/B2 ve F-1 öğrenci dosyalarında izlenen evraklar.",
    descriptionEn: "Documents tracked for B1/B2 and F-1 student files.",
    bodyTr:
      "B1/B2 için DS-160 onay sayfası, fotoğraf, randevu teyidi, mali belgeler ve seyahat planı izlenir. F-1’de I-20, SEVIS ödemesi ve kabul mektubu eklenir.\n\nRandevu sistemi resmi makamlara aittir; biz dosya hazırlığını yönetiriz.",
    bodyEn:
      "B1/B2 files track DS-160 confirmation, photo, appointment, finances and itinerary. F-1 adds I-20, SEVIS payment and admission letter.\n\nAppointment systems belong to official authorities; we manage file readiness.",
    status: "published",
  },
];

export const DEFAULT_POSTS: BlogPost[] = [
  {
    slug: "schengen-evragi-nasil-hazirlanir",
    titleTr: "Schengen evrakları nasıl hazırlanır?",
    titleEn: "How to prepare Schengen documents",
    excerptTr: "Turistik Schengen dosyasında en çok eksik kalan belgeler ve sırası.",
    excerptEn: "The documents most often missing in tourist Schengen files, in order.",
    bodyTr:
      "Schengen turistik dosyada sıra nettir: pasaport ve fotoğraf, sigorta, rezervasyonlar, banka dökümü, gelir belgesi. Eksik ay içeren hesap özeti en sık revizyon nedenidir.\n\nRanz Global panelinde zorunlu maddeler işaretlenir; danışman notunu aynı ekrandan görürsünüz.",
    bodyEn:
      "Tourist Schengen files follow a clear order: passport and photo, insurance, reservations, bank statements, income proof. Incomplete months on statements are the most common revision trigger.\n\nRequired items are flagged in the Ranz Global portal; you read advisor notes on the same screen.",
    coverAltTr: "Schengen evrak klasörü",
    coverAltEn: "Schengen document folder",
    publishedAt: "2026-08-12",
    status: "published",
  },
  {
    slug: "abd-b1b2-randevu-oncesi",
    titleTr: "ABD B1/B2 randevu öncesi kontrol listesi",
    titleEn: "USA B1/B2 pre-interview checklist",
    excerptTr: "DS-160, mali tutarlılık ve seyahat planının aynı hikâyeyi anlatması.",
    excerptEn: "DS-160, finances and itinerary should tell the same story.",
    bodyTr:
      "B1/B2 mülakatı resmi süreçtir. Danışmanlık tarafında DS-160 onay sayfası, mali belgeler ve itinerary’nin çelişmemesi hedeflenir.\n\nRanz Global evrak kasasında bu üçlü yan yana durur.",
    bodyEn:
      "The B1/B2 interview is an official process. On the consultancy side we keep DS-160 confirmation, finances and itinerary consistent.\n\nThey sit side by side in the Ranz Global vault.",
    coverAltTr: "ABD vize hazırlığı",
    coverAltEn: "USA visa preparation",
    publishedAt: "2026-07-03",
    status: "published",
  },
];
