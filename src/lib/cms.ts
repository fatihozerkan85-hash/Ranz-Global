import type { BlogPost, CmsPage } from "./types";
import { SEO_TARGET_POSTS } from "./seo-target-posts";
import { VISA_GUIDES } from "./visa-guides";
import { COMPANY, COMPANY_CITY_EN, COMPANY_CITY_TR } from "./company";
import { KVKK_BODY_EN, KVKK_DESCRIPTION_EN, KVKK_DESCRIPTION_TR, KVKK_TITLE_EN, KVKK_TITLE_TR, kvkkBodyTr } from "./kvkk";

export const SITE = {
  name: COMPANY.brandShort,
  legalName: COMPANY.legalName,
  taglineTr: "Travel & Visa",
  taglineEn: "Travel & Visa",
  email: COMPANY.email,
  phoneDisplay: "+90 530 925 88 92",
  cityTr: COMPANY_CITY_TR,
  cityEn: COMPANY_CITY_EN,
  address: COMPANY.address,
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
      "Ranz Global, geleneksel vize danışmanlığını dijital altyapı ile birleştiren yeni nesil bir vize yönetim platformudur. Türkiye ve KKTC genelinde dijital altyapımız ve uzman danışmanlarımızla hizmet veriyoruz.\n\nRanz Global – Travel & Visa, BP Grup Turizm Eğitim Danışmanlık Ticaret Limited Şirketi’nin tescilli markasıdır.\n\nKonsolosluk kararı resmi makamlara aittir. Bizim işimiz, dosyanızın eksiksiz, tutarlı ve takip edilebilir olmasını sağlamaktır.",
    bodyEn:
      "Ranz Global is a next-generation visa management platform that combines traditional visa consultancy with digital infrastructure. We serve across Türkiye and the TRNC through our platform and specialist advisors.\n\nRanz Global – Travel & Visa is the registered trademark of BP Grup Turizm Eğitim Danışmanlık Ticaret Limited Şirketi.\n\nConsular decisions belong to official authorities. Our work is to keep your file complete, consistent and trackable.",
    status: "published",
  },
  {
    slug: "hizmetler",
    titleTr: "Hizmetler",
    titleEn: "Services",
    descriptionTr: "Vize danışmanlığı: Schengen, İngiltere, ABD, Kanada ve KKTC’den Schengen dosya hazırlığı.",
    descriptionEn: "Schengen tourist/business and US B1/B2 plus F-1 student visa consultancy.",
    bodyTr:
      "Avrupa vizeleri: Schengen turistik ve ticari dosyalar için güncel evrak listesi, yükleme ve danışman kontrolü. KKTC’den açılan dosyalar için Kuzey Kıbrıs Schengen vize danışmanlığı yazısına bakın.\n\nAmerika vizeleri: B1/B2 ve F-1 öğrenci başvurularında DS-160, mali belgeler ve randevu hazırlığı takibi.\n\nDosya takibi: eksik evrak, revizyon ve onay notları tek panelde. Genel çerçeve vize danışmanlığı yazısındadır.",
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
    titleTr: KVKK_TITLE_TR,
    titleEn: KVKK_TITLE_EN,
    descriptionTr: KVKK_DESCRIPTION_TR,
    descriptionEn: KVKK_DESCRIPTION_EN,
    bodyTr: kvkkBodyTr(),
    bodyEn: KVKK_BODY_EN,
    status: "published",
  },
  {
    slug: "gizlilik",
    titleTr: "Gizlilik politikası",
    titleEn: "Privacy policy",
    descriptionTr: "Ranz Global gizlilik politikası.",
    descriptionEn: "Ranz Global privacy policy.",
    bodyTr: `Dil ve oturum için tarayıcı depolaması kullanılır. İletişim formu kayıtları bu tarayıcıdaki yerel depoda tutulur. Yüklenen evraklar Vercel Blob özel deposunda saklanır. Üçüncü taraf reklam çerezi yok. Analitik bağlanırsa ayrıca bildirilir.

Veri sorumlusu: ${COMPANY.legalName}. ${COMPANY.brandNoteTr}
Adres: ${COMPANY.address}. ${COMPANY.tradeRegistry}. ${COMPANY.taxOffice}, VKN ${COMPANY.taxNo}.
Ayrıntı KVKK aydınlatma metnindedir.`,
    bodyEn: `Browser storage is used for language and session. Contact form records stay in local storage on this browser. Uploaded documents are stored in a private Vercel Blob store. No third-party ad cookies. Analytics, if added, will be disclosed.

Controller: ${COMPANY.legalName}. ${COMPANY.brandNoteEn}
Address: ${COMPANY.address}. ${COMPANY.tradeRegistry}. Tax no ${COMPANY.taxNo}.
Details are in the KVKK notice.`,
    status: "published",
  },
];

export const DEFAULT_GUIDES: CmsPage[] = VISA_GUIDES.map((g) => ({
  slug: g.slug,
  titleTr: g.titleTr,
  titleEn: g.titleEn,
  descriptionTr: g.descriptionTr,
  descriptionEn: g.descriptionEn,
  bodyTr: g.blocks
    .filter((b) => b.type === "p")
    .slice(0, 2)
    .map((b) => ("tr" in b ? b.tr : ""))
    .join("\n\n"),
  bodyEn: g.blocks
    .filter((b) => b.type === "p")
    .slice(0, 2)
    .map((b) => ("en" in b ? b.en : ""))
    .join("\n\n"),
  status: "published" as const,
}));

export const RETIRED_BLOG_SLUGS = new Set([
  "schengen-evragi-nasil-hazirlanir",
  "abd-b1b2-randevu-oncesi",
]);

export const DEFAULT_POSTS: BlogPost[] = SEO_TARGET_POSTS;

export function isListedBlogPost(post: { slug: string; status?: string }) {
  return post.status === "published" && !RETIRED_BLOG_SLUGS.has(post.slug);
}
