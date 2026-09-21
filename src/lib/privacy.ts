import { COMPANY } from "./company";
import type { KvkkBlock } from "./kvkk";

export const PRIVACY_UPDATED_AT = "21 Eylül 2026";
export const PRIVACY_TITLE_TR = "Gizlilik ve Veri Güvenliği Politikası";
export const PRIVACY_TITLE_EN = "Privacy and Data Security Policy";

export const PRIVACY_INTRO: KvkkBlock[] = [
  { type: "p", tr: `Son güncelleme tarihi: ${PRIVACY_UPDATED_AT}` },
  {
    type: "p",
    tr: "Ranz Global – Travel & Visa (“Ranz Global”, “Şirket”, “biz” veya “bizim”), kullanıcılarımızın ve müşterilerimizin kişisel verilerinin gizliliğine ve güvenliğine önem vermektedir.",
  },
  {
    type: "p",
    tr: "Ranz Global; vize ve seyahat danışmanlığı, başvuru ön değerlendirmesi, kişiye özel evrak listesi oluşturulması, belge kontrolü, başvuru dosyası hazırlığı, randevu süreci desteği ve dijital müşteri paneli hizmetleri sunan özel bir danışmanlık platformudur.",
  },
  {
    type: "p",
    tr: "Bu Gizlilik ve Veri Güvenliği Politikası; www.ranzglobal.com internet sitesi, müşteri paneli, elektronik formlar, iletişim kanalları ve Ranz Global tarafından sunulan dijital hizmetler kapsamında kişisel verilerin nasıl toplandığını, kullanıldığını, saklandığını, korunduğunu ve gerekli durumlarda kimlerle paylaşılabileceğini açıklamak amacıyla hazırlanmıştır.",
  },
  {
    type: "p",
    tr: "Ranz Global, konsolosluk, büyükelçilik, göç idaresi veya resmi vize başvuru merkezi değildir. Vize başvurularına ilişkin nihai karar ilgili ülkenin yetkili makamlarına aittir.",
  },
];

export const PRIVACY_SECTIONS: { title: string; blocks: KvkkBlock[] }[] = [
  {
    title: "1. Veri sorumlusu",
    blocks: [
      {
        type: "p",
        tr: "Kişisel verileriniz, yürürlükteki kişisel verilerin korunmasına ilişkin mevzuat kapsamında veri sorumlusu sıfatıyla:",
      },
      {
        type: "ul",
        items: [
          COMPANY.legalNameCaps,
          `Ticari marka: ${COMPANY.brand}`,
          COMPANY.brandNoteTr,
          `Adres: ${COMPANY.address}`,
          `Ankara Ticaret Sicil No: 550795`,
          `Vergi dairesi: ${COMPANY.taxOffice}`,
          `Vergi kimlik no: ${COMPANY.taxNo}`,
          `E-posta: ${COMPANY.email}`,
          `Web sitesi: ${COMPANY.web}`,
        ],
      },
      { type: "p", tr: "tarafından işlenmektedir." },
    ],
  },
  {
    title: "2. Hangi verileri topluyoruz?",
    blocks: [
      {
        type: "p",
        tr: "Ranz Global tarafından sunulan hizmetin niteliğine ve kullanıcının gerçekleştirdiği işlemlere bağlı olarak aşağıdaki veri kategorileri işlenebilir:",
      },
      { type: "h3", tr: "Kimlik bilgileri" },
      {
        type: "p",
        tr: "Ad, soyad, doğum tarihi, doğum yeri, uyruk, medeni durum ve başvuru için gerekli olabilecek diğer kimlik bilgileri.",
      },
      { type: "h3", tr: "Pasaport ve seyahat belgesi bilgileri" },
      {
        type: "p",
        tr: "Pasaport numarası, pasaport düzenlenme ve geçerlilik tarihleri, pasaport görüntüleri, eski pasaportlar, mevcut veya geçmiş vizeler, giriş-çıkış kayıtları ve seyahat geçmişine ilişkin bilgiler.",
      },
      { type: "h3", tr: "İletişim bilgileri" },
      {
        type: "p",
        tr: "Telefon numarası, e-posta adresi, adres bilgileri ve hizmetin yürütülmesi amacıyla kullanılan diğer iletişim bilgileri.",
      },
      { type: "h3", tr: "Mesleki bilgiler" },
      {
        type: "p",
        tr: "Meslek, çalışılan kurum veya şirket, görev/unvan, işe giriş tarihi, SGK bilgileri, şirket ortaklığı ve başvurunun gerektirdiği diğer mesleki bilgiler.",
      },
      { type: "h3", tr: "Finansal bilgiler" },
      {
        type: "p",
        tr: "Banka hesap bilgileri ve hesap hareketleri, gelir bilgileri, maaş bordroları, sponsor bilgileri, şirket mali belgeleri ve vize başvurusunun mali yeterliliğinin değerlendirilmesi için kullanıcı tarafından sağlanan diğer finansal belgeler.",
      },
      {
        type: "p",
        tr: "Ranz Global hiçbir koşulda internet bankacılığı şifresi, banka kartı/kredi kartı PIN kodu veya benzeri güvenlik bilgilerini talep etmez.",
      },
      { type: "h3", tr: "Seyahat bilgileri" },
      {
        type: "p",
        tr: "Seyahat amacı, seyahat tarihleri, destinasyon, uçuş bilgileri, otel ve konaklama bilgileri, davetiyeler, sponsor bilgileri ve seyahat geçmişi.",
      },
      { type: "h3", tr: "Eğitim bilgileri" },
      {
        type: "p",
        tr: "Öğrencilik durumu, okul bilgileri, diploma, transkript ve ilgili başvurunun gerektirdiği diğer eğitim bilgileri.",
      },
      { type: "h3", tr: "Aile ve yakınlık bilgileri" },
      {
        type: "p",
        tr: "Eş, çocuk, anne, baba, sponsor, davet eden kişi veya başvurunun niteliği nedeniyle gerekli olabilecek diğer aile ve yakınlık bilgileri.",
      },
      { type: "h3", tr: "Görsel ve belge verileri" },
      {
        type: "p",
        tr: "Biyometrik fotoğraf, pasaport ve kimlik görüntüleri ile kullanıcı tarafından hizmet kapsamında yüklenen diğer belgeler ve görseller.",
      },
      { type: "h3", tr: "Teknik ve işlem güvenliği bilgileri" },
      {
        type: "p",
        tr: "IP adresi, kullanıcı hesabı bilgileri, oturum kayıtları, giriş-çıkış tarih ve saatleri, cihaz ve tarayıcı bilgileri ve sistem güvenliğinin sağlanması amacıyla oluşturulan teknik kayıtlar.",
      },
    ],
  },
];

function blockToText(block: KvkkBlock) {
  if (block.type === "p" || block.type === "h3") return block.tr;
  return block.items.map((item) => `• ${item}`).join("\n");
}

export function privacyBodyTr() {
  return [
    ...PRIVACY_INTRO.map(blockToText),
    ...PRIVACY_SECTIONS.flatMap((section) => [section.title, ...section.blocks.map(blockToText)]),
  ].join("\n\n");
}

export const PRIVACY_BODY_EN = `This page is the official privacy and data-security policy. The Turkish text prevails.

Last updated: 21 September 2026.

Controller: ${COMPANY.legalName}. ${COMPANY.brandNoteEn}
Address: ${COMPANY.address}. Trade registry no 550795. ${COMPANY.taxOffice}, tax no ${COMPANY.taxNo}.
Email: ${COMPANY.email}.

We collect identity, passport, contact, work, finance, travel, education, family, document and technical data only as needed to run visa consultancy. We never ask for internet-banking passwords or card PIN codes. Visa decisions belong to official authorities.

See also the KVKK notice at /kvkk.`;

export const PRIVACY_DESCRIPTION_TR =
  "Ranz Global gizlilik ve veri güvenliği politikası: veri sorumlusu, toplanan veriler ve güvenlik. 21 Eylül 2026.";
export const PRIVACY_DESCRIPTION_EN =
  "Ranz Global privacy and data-security policy. Controller, data we collect and security. Turkish text prevails.";
