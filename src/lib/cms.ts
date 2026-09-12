import type { BlogPost, CmsPage } from "./types";

export const SITE = {
  name: "Ranz Global",
  taglineTr: "Travel & Visa",
  taglineEn: "Travel & Visa",
  email: "info@ranzglobal.com",
  phoneDisplay: "+90 (212) 000 00 00",
  cityTr: "İstanbul, Türkiye",
  cityEn: "Istanbul, Turkey",
  url: "https://www.ranzglobal.com",
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
      "Ranz Global, vize danışmanlığı kapsamında ad, iletişim, dosya durumu ve yüklenen evrakları işler. Hesap ve dosya özeti tarayıcınızdaki yerel depoda (localStorage) durur. Yüklediğiniz PDF/JPEG/PNG belgeler Vercel Blob özel deposuna HTTPS ile aktarılır; doğrudan herkese açık bir bağlantı verilmez, indirme site üzerinden yapılır.\n\nŞifreleme iddiası kullanmıyoruz. Amaç yalnızca danışmanlık sürecini yürütmektir. Resmi aydınlatma metni ayrıca iletilebilir.",
    bodyEn:
      "Ranz Global processes name, contact, file status and uploaded documents for visa consultancy. Account and file summaries sit in your browser’s localStorage. PDF/JPEG/PNG files you upload go over HTTPS to a private Vercel Blob store; they are not given a public URL and are opened through this site.\n\nWe do not claim encryption. The purpose is to run the consultancy. A formal notice can be issued separately.",
    status: "published",
  },
  {
    slug: "gizlilik",
    titleTr: "Gizlilik politikası",
    titleEn: "Privacy policy",
    descriptionTr: "Ranz Global gizlilik politikası.",
    descriptionEn: "Ranz Global privacy policy.",
    bodyTr:
      "Dil ve oturum için tarayıcı depolaması kullanılır. İletişim formu kayıtları bu tarayıcıdaki yerel depoda tutulur. Yüklenen evraklar Vercel Blob özel deposunda saklanır. Üçüncü taraf reklam çerezi yok. Analitik bağlanırsa ayrıca bildirilir.",
    bodyEn:
      "Browser storage is used for language and session. Contact form records stay in local storage on this browser. Uploaded documents are stored in a private Vercel Blob store. No third-party ad cookies. Analytics, if added, will be disclosed.",
    status: "published",
  },
];

export const DEFAULT_GUIDES: CmsPage[] = [
  {
    slug: "schengen",
    titleTr: "Schengen Vize Rehberi",
    titleEn: "Schengen Visa Guide",
    descriptionTr: "Schengen turistik ve ticari başvurularda evrak çerçevesi.",
    descriptionEn: "Document framework for Schengen tourist and business applications.",
    bodyTr:
      "Schengen kısa konaklama vizelerinde pasaport süresi, biyometrik fotoğraf, seyahat sağlık sigortası, uçuş ve konaklama rezervasyonu ile mali döküm temel belgelerdir. Ticari dosyalarda davet mektubu ve şirket evrakı zorunlu hale gelir.\n\nAracı kullanmak vize alma şansını artırmaz; resmi karar konsolosluğa aittir.",
    bodyEn:
      "For Schengen short-stay visas, passport validity, biometric photo, travel insurance, flight and hotel reservations and bank statements are core. Business files add invitation and company papers.\n\nUsing an intermediary does not increase the chance of a visa; the decision is official.",
    status: "published",
  },
  {
    slug: "abd",
    titleTr: "ABD Vize Rehberi",
    titleEn: "USA Visa Guide",
    descriptionTr: "B1/B2 ve F-1 öğrenci dosyalarında izlenen evraklar.",
    descriptionEn: "Documents tracked for B1/B2 and F-1 student files.",
    bodyTr:
      "B1/B2 için DS-160 onay sayfası, fotoğraf, randevu teyidi, mali belgeler ve seyahat planı izlenir. F-1’de I-20, SEVIS ödemesi ve kabul mektubu eklenir.\n\nRandevu sistemi resmi makamlara aittir.",
    bodyEn:
      "B1/B2 files track DS-160 confirmation, photo, appointment, finances and itinerary. F-1 adds I-20, SEVIS payment and admission letter.\n\nAppointment systems belong to official authorities.",
    status: "published",
  },
  {
    slug: "2026-ingiltere-vizesi-evraklar",
    titleTr: "2026 İngiltere Vizesi İçin Gerekli Evraklar",
    titleEn: "Documents For A 2026 UK Visa",
    descriptionTr: "Ziyaretçi dosyasında pasaport, döküm, bağ ve konaklama nasıl durur.",
    descriptionEn: "How passport, statements, ties and accommodation sit in a visitor file.",
    bodyTr:
      "İngiltere Standard Visitor dosyasında pasaport, seyahat planı, konaklama, birkaç aylık banka dökümü ve bağlar birlikte okunur. Çalışan, şirket sahibi, emekli veya sponsorlu olmanıza göre liste değişir. Tek bir evrak şablonu yoktur.\n\nRanz Global panelinde size özel madde listesi açılır.",
    bodyEn:
      "A UK Standard Visitor file is read as passport, itinerary, stay, several months of statements and ties together. The list changes if you are employed, a business owner, retired or sponsored.\n\nYour personal list opens in the Ranz Global portal.",
    status: "published",
  },
  {
    slug: "abd-vizesi-mulakat",
    titleTr: "ABD Vizesi Mülakatında Ne Sorulur?",
    titleEn: "What Is Asked At A US Visa Interview?",
    descriptionTr: "DS-160, mali tablo ve seyahat planının aynı hikâyeyi anlatması.",
    descriptionEn: "DS-160, finances and itinerary should tell the same story.",
    bodyTr:
      "Mülakat resmi süreçtir. Sık bakılan konular seyahat amacı, dönüş bağı ve mali yeterliliktir. Danışmanlık tarafında DS-160 ile evrakların çelişmemesi hedeflenir. Ranz Global mülakatı sizin yerinize yapmaz.",
    bodyEn:
      "The interview is official. Purpose, ties and funds are commonly tested. We keep DS-160 and documents consistent. Ranz Global does not attend the interview in your place.",
    status: "published",
  },
  {
    slug: "schengen-banka-hesabi",
    titleTr: "Schengen Vizesi Banka Hesabında Ne Kadar Para Olmalı?",
    titleEn: "How Much Money For A Schengen Visa Bank Account?",
    descriptionTr: "Sihirli bir tutar yoktur; tutarlılık ve kaynak önemlidir.",
    descriptionEn: "There is no magic figure; consistency and source of funds matter.",
    bodyTr:
      "Schengen’de günlük harcama varsayımı ülkeye göre değişir. Bakiyenin rezervasyon, gelir ve seyahat süresiyle uyumu bakılır. Ani yüklü para veya eksik ay dökümü sık revizyon nedenidir. Kesin bir euro rakamı vaat etmeyiz.",
    bodyEn:
      "Schengen daily-cost assumptions vary by country. The balance must match bookings, income and trip length. Sudden deposits or missing months are common issues. We do not promise a euro figure.",
    status: "published",
  },
  {
    slug: "vize-reddi-sonrasi",
    titleTr: "Vize Reddinden Sonra Tekrar Başvuru Yapılabilir Mi?",
    titleEn: "Can You Apply Again After A Visa Refusal?",
    descriptionTr: "Çoğu ülkede mümkündür; önceki gerekçe dosyada durur.",
    descriptionEn: "Usually yes; the previous grounds stay on the file.",
    bodyTr:
      "Yeniden başvuru mümkündür. Aynı gerekçeyi tekrar etmek risklidir. Ret yazısını okuyup yeni dosyayı ona göre kurarız. Onay yine garanti değildir.",
    bodyEn:
      "A new application is possible. Repeating the same grounds is risky. We read the letter and rebuild the file. Approval is still not guaranteed.",
    status: "published",
  },
  {
    slug: "sirket-sahipleri-ingiltere",
    titleTr: "Şirket Sahipleri İçin İngiltere Vizesi Evrakları",
    titleEn: "UK Visa Documents For Company Owners",
    descriptionTr: "Şirket evrakı, hesap hareketi ve kişisel bağlar birlikte durur.",
    descriptionEn: "Company papers, account activity and personal ties sit together.",
    bodyTr:
      "Şirket sahibinde vergi levhası, faaliyet, imza sirküleri ve şirket/kişisel hesap dökümü sık istenir. Kişisel bağlar da gösterilir. Liste dosyaya göredir.",
    bodyEn:
      "Owners often need tax plate, activity papers, signature circular and company/personal statements, plus personal ties. The list follows the file.",
    status: "published",
  },
  {
    slug: "calismayan-vize",
    titleTr: "Çalışmayan Biri Vize Alabilir Mi?",
    titleEn: "Can Someone Who Is Not Working Get A Visa?",
    descriptionTr: "Gelir kaynağı, sponsor ve dönüş bağı net olmalıdır.",
    descriptionEn: "Source of funds, a sponsor and return ties must be clear.",
    bodyTr:
      "Çalışmamak tek başına ret demek değildir. Sponsor, birikim ve bağlar açık durmalıdır. Sonuç resmi makama aittir.",
    bodyEn:
      "Not working is not an automatic refusal. Sponsor, savings and ties must be clear. The decision is official.",
    status: "published",
  },
  {
    slug: "sponsorlu-vize",
    titleTr: "Sponsorlu Vize Başvurusu Nasıl Yapılır?",
    titleEn: "How Does A Sponsored Visa Application Work?",
    descriptionTr: "Sponsorun kimliği, mali belgesi ve ilişki kanıtı dosyada durur.",
    descriptionEn: "The sponsor’s identity, finances and proof of relationship sit on the file.",
    bodyTr:
      "Sponsor dilekçesi, kimlik ve mali belgeler ile sizin bağlarınız birlikte okunur. Sponsor sizin yerinize başvuran olmaz; dosyayı güçlendirir.",
    bodyEn:
      "A sponsor letter, ID and finances are read with your own ties. The sponsor does not become the applicant; they support the file.",
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
