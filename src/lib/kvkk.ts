import { COMPANY } from "./company";

export const KVKK_UPDATED_AT = "21 Eylül 2026";

export const KVKK_TITLE_TR = "Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metni";
export const KVKK_TITLE_EN = "Notice on the Protection and Processing of Personal Data";

export const KVKK_CONTROLLER = {
  name: COMPANY.legalName,
  brand: COMPANY.brand,
  address: COMPANY.address,
  email: COMPANY.email,
  web: COMPANY.web,
};

export type KvkkBlock =
  | { type: "p"; tr: string }
  | { type: "h3"; tr: string }
  | { type: "ul"; items: string[] };

export type KvkkSection = {
  title: string;
  blocks: KvkkBlock[];
};

const intro: KvkkBlock[] = [
  { type: "p", tr: `Son güncelleme: ${KVKK_UPDATED_AT}` },
  {
    type: "p",
    tr: `${COMPANY.brandNoteTr} ${COMPANY.legalName} olarak kişisel verilerinizin gizliliğine ve güvenliğine önem veriyoruz.`,
  },
  {
    type: "p",
    tr: "İşbu Aydınlatma Metni; 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) başta olmak üzere ilgili mevzuat kapsamında, Ranz Global tarafından sunulan vize danışmanlığı, seyahat danışmanlığı, dijital başvuru, müşteri iletişimi ve bunlarla bağlantılı hizmetler kapsamında kişisel verilerin işlenmesine ilişkin olarak ilgili kişilerin bilgilendirilmesi amacıyla hazırlanmıştır.",
  },
];

export const KVKK_SECTIONS: KvkkSection[] = [
  {
    title: "1. Veri sorumlusu",
    blocks: [
      { type: "p", tr: "KVKK kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla;" },
      {
        type: "ul",
        items: [
          COMPANY.legalNameCaps,
          COMPANY.brandNoteTr,
          `Adres: ${COMPANY.address}`,
          `Ticaret sicili: ${COMPANY.tradeRegistry}`,
          `Vergi dairesi: ${COMPANY.taxOffice}`,
          `Vergi kimlik no: ${COMPANY.taxNo}`,
          `E-posta: ${COMPANY.email}`,
        ],
      },
      { type: "p", tr: "tarafından işlenebilmektedir." },
    ],
  },
  {
    title: "2. İşlenebilecek kişisel veriler",
    blocks: [
      {
        type: "p",
        tr: "Ranz Global tarafından sunulan hizmetin niteliğine ve ilgili kişinin gerçekleştirdiği işlemlere bağlı olarak aşağıdaki kişisel veri kategorileri işlenebilir:",
      },
      { type: "h3", tr: "Kimlik bilgileri" },
      {
        type: "p",
        tr: "Ad, soyad, doğum tarihi ve yeri, T.C. kimlik numarası, yabancı kimlik numarası, uyruk, medeni durum, cinsiyet, anne/baba bilgileri ve başvuru için gerekli olabilecek diğer kimlik bilgileri.",
      },
      { type: "h3", tr: "Pasaport ve seyahat belgesi bilgileri" },
      {
        type: "p",
        tr: "Pasaport numarası, düzenlenme ve geçerlilik tarihleri, pasaport görüntüleri, eski pasaportlar, vizeler, giriş-çıkış kayıtları ve seyahat geçmişine ilişkin bilgiler.",
      },
      { type: "h3", tr: "İletişim bilgileri" },
      {
        type: "p",
        tr: "Telefon numarası, e-posta adresi, ikamet adresi ve hizmetin yürütülmesi amacıyla kullanılan diğer iletişim bilgileri.",
      },
      { type: "h3", tr: "Mesleki ve çalışma bilgileri" },
      {
        type: "p",
        tr: "Meslek, çalışılan kurum veya şirket, görev/unvan, işe giriş tarihi, SGK kayıtları, şirket ortaklık bilgileri, ticaret sicili bilgileri ve başvurunun niteliğine göre gerekli diğer mesleki bilgiler.",
      },
      { type: "h3", tr: "Finansal bilgiler" },
      {
        type: "p",
        tr: "Banka hesap bilgileri ve hareketleri, gelir bilgileri, maaş bordroları, sponsor bilgileri, şirket mali belgeleri ve vize başvurusunun mali yeterlilik yönünden hazırlanabilmesi için kullanıcı tarafından sağlanan diğer finansal belgeler.",
      },
      {
        type: "p",
        tr: "Ranz Global, kullanıcıların internet bankacılığı şifrelerini, kredi/banka kartı PIN kodlarını veya benzeri güvenlik bilgilerini talep etmez.",
      },
      { type: "h3", tr: "Seyahat bilgileri" },
      {
        type: "p",
        tr: "Uçuş, otel, konaklama, seyahat tarihleri, destinasyon, davetiye, sponsor, seyahat amacı ve geçmiş seyahatlere ilişkin bilgiler.",
      },
      { type: "h3", tr: "Eğitim bilgileri" },
      {
        type: "p",
        tr: "Öğrencilik durumu, okul, diploma, transkript ve ilgili başvurunun gerektirdiği diğer eğitim bilgileri.",
      },
      { type: "h3", tr: "Aile ve yakınlık bilgileri" },
      {
        type: "p",
        tr: "Eş, çocuk, anne, baba, sponsor, davet eden kişi veya başvurunun niteliği nedeniyle gerekli olabilecek aile/yakınlık bilgileri.",
      },
      { type: "h3", tr: "Görsel veriler" },
      {
        type: "p",
        tr: "Biyometrik fotoğraf, pasaport ve kimlik görüntüleri ile kullanıcının hizmet kapsamında Ranz Global’e ilettiği diğer görseller.",
      },
      { type: "h3", tr: "İşlem güvenliği ve dijital kullanım bilgileri" },
      {
        type: "p",
        tr: "IP adresi, oturum ve güvenlik kayıtları, tarih-saat bilgileri, kullanıcı hesabı hareketleri ve sistem güvenliğinin sağlanması amacıyla oluşturulan teknik kayıtlar.",
      },
      { type: "h3", tr: "Hukuki işlem ve müşteri işlem bilgileri" },
      {
        type: "p",
        tr: "Başvuru kayıtları, hizmet talepleri, sözleşmeler, ödeme ve fatura kayıtları, müşteri destek talepleri, şikâyet ve uyuşmazlık kayıtları ile gerektiğinde hukuki süreçlere ilişkin bilgiler.",
      },
      { type: "h3", tr: "Özel nitelikli kişisel veriler" },
      {
        type: "p",
        tr: "Vize veya seyahat işleminin niteliği gerektirdiğinde ve hukuken gerekli şartların bulunması halinde sağlık bilgileri, biyometrik nitelikteki belgeler veya kullanıcının kendisinin sunduğu belgelerde bulunan diğer özel nitelikli kişisel veriler işlenebilir.",
      },
      {
        type: "p",
        tr: "Ranz Global, hizmet için gerekli olmayan özel nitelikli kişisel verilerin gönderilmemesini tavsiye eder.",
      },
    ],
  },
  {
    title: "3. Kişisel verilerin işlenme amaçları",
    blocks: [
      { type: "p", tr: "Kişisel verileriniz, gerçekleştirilen işlem ve hizmetin niteliğine göre;" },
      {
        type: "ul",
        items: [
          "vize ve seyahat danışmanlığı hizmetlerinin sunulması",
          "başvuru sahibinin profilinin değerlendirilmesi",
          "başvuru için gerekli evrakların belirlenmesi",
          "vize başvuru formlarının hazırlanmasına destek olunması",
          "başvuru belgelerinin kontrol edilmesi",
          "randevu ve başvuru süreçlerinin yönetilmesi",
          "başvuru sahibinin talebi doğrultusunda ilgili işlemlerin gerçekleştirilmesi",
          "danışmanlık hizmetinin yürütülmesi",
          "müşteri hesabı ve dijital panelin işletilmesi",
          "kullanıcı kimliğinin ve işlem güvenliğinin doğrulanması",
          "müşteri ile iletişim kurulması",
          "talep, soru ve şikâyetlerin sonuçlandırılması",
          "ödeme, muhasebe ve faturalandırma işlemlerinin yürütülmesi",
          "sözleşmelerin kurulması ve ifasının sağlanması",
          "bilgi ve sistem güvenliğinin sağlanması",
          "yetkisiz erişim ve kötüye kullanım girişimlerinin önlenmesi",
          "hukuki uyuşmazlıklarda hakların tesisi, kullanılması veya korunması",
          "yetkili kamu kurum ve kuruluşlarının hukuka uygun taleplerinin yerine getirilmesi",
          "mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi",
        ],
      },
      { type: "p", tr: "amaçlarıyla işlenebilir." },
      {
        type: "p",
        tr: "Ticari elektronik ileti veya pazarlama faaliyetleri, uygulanabilir mevzuat kapsamında gerekli olduğu durumlarda ayrıca alınan onay ve tercihlere göre yürütülür.",
      },
    ],
  },
  {
    title: "4. Kişisel verilerin işlenmesinin hukuki sebepleri",
    blocks: [
      {
        type: "p",
        tr: "Kişisel veriler, somut işleme faaliyetine göre KVKK’nın 5. ve özel nitelikli kişisel veriler bakımından 6. maddesinde öngörülen şartlardan uygun olanına dayanılarak işlenir.",
      },
      { type: "p", tr: "Bu kapsamda özellikle;" },
      {
        type: "ul",
        items: [
          "kanunlarda açıkça öngörülmesi",
          "bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması",
          "veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması",
          "bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması",
          "ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri için veri işlemenin zorunlu olması",
        ],
      },
      { type: "p", tr: "hukuki sebeplerine dayanılabilir." },
      {
        type: "p",
        tr: "Kanunen açık rıza gerektiren belirli işlemler bakımından ayrıca açık rıza alınır.",
      },
      {
        type: "p",
        tr: "Açık rıza, hizmetin ifası için hukuken zorunlu olmayan veri işleme faaliyetleri bakımından hizmet almanın ön koşulu haline getirilmez.",
      },
    ],
  },
  {
    title: "5. Kişisel verilerin toplanma yöntemi",
    blocks: [
      { type: "p", tr: "Kişisel veriler;" },
      {
        type: "ul",
        items: [
          "www.ranzglobal.com internet sitesi",
          "kullanıcı hesabı ve müşteri paneli",
          "elektronik formlar",
          "e-posta",
          "telefon",
          "mesajlaşma kanalları",
          "kullanıcı tarafından yüklenen belgeler",
          "sözleşmeler",
          "ödeme işlemleri",
          "destek talepleri",
          "başvuru süreçleri",
        ],
      },
      { type: "p", tr: "üzerinden elektronik veya fiziki yollarla elde edilebilir." },
      {
        type: "p",
        tr: "Kullanıcının kendi iradesiyle Ranz Global’e gönderdiği belgelerde bulunan kişisel veriler de hizmetin gerektirdiği ölçüde işlenebilir.",
      },
    ],
  },
  {
    title: "6. Üçüncü kişilere ait veriler",
    blocks: [
      {
        type: "p",
        tr: "Kullanıcı; sponsor, eş, çocuk, aile üyesi, davet eden kişi, çalışan veya diğer üçüncü kişilere ait kişisel verileri Ranz Global’e iletmesi halinde, bu verileri Ranz Global’e iletme konusunda hukuken gerekli koşulların bulunduğundan emin olmakla sorumludur.",
      },
      {
        type: "p",
        tr: "Ranz Global, üçüncü kişilere ilişkin verileri yalnızca hizmetin yürütülmesi ve hukuki yükümlülüklerin yerine getirilmesi için gerekli olduğu ölçüde işler.",
      },
    ],
  },
  {
    title: "7. Kişisel verilerin aktarılması",
    blocks: [
      {
        type: "p",
        tr: "Kişisel verileriniz, ilgili hizmetin yürütülmesi ve mevzuata uygunluğun sağlanması amacıyla, gerekli olduğu ölçüde;",
      },
      {
        type: "ul",
        items: [
          "yetkili kamu kurum ve kuruluşlarına",
          "konsolosluk, büyükelçilik veya diğer yetkili yabancı ülke makamlarına",
          "yetkili vize başvuru merkezlerine",
          "başvuru ve randevu hizmet sağlayıcılarına",
          "seyahat hizmeti sağlayıcılarına",
          "ödeme ve finans kuruluşlarına",
          "muhasebe, hukuk ve benzeri profesyonel hizmet sağlayıcılarına",
          "bilgi teknolojileri, barındırma, siber güvenlik, iletişim ve teknik altyapı hizmet sağlayıcılarına",
        ],
      },
      { type: "p", tr: "mevzuatta öngörülen şartların bulunması halinde aktarılabilir." },
      { type: "p", tr: "Aktarım, hizmet için gerekli olan veri ve amaçla sınırlı tutulur." },
    ],
  },
  {
    title: "8. Yurt dışına kişisel veri aktarımı",
    blocks: [
      {
        type: "p",
        tr: "Vize ve uluslararası seyahat hizmetlerinin doğası gereği bazı kişisel verilerin yurt dışında bulunan kurum veya hizmet sağlayıcılara aktarılması gerekebilir.",
      },
      {
        type: "p",
        tr: "Ayrıca kullanılan bilişim, barındırma, iletişim veya diğer teknolojik altyapıların yurt dışında bulunması durumunda yurt dışına veri aktarımı söz konusu olabilir.",
      },
      {
        type: "p",
        tr: "Bu tür aktarımlar KVKK’nın 9. maddesi ve ilgili ikincil mevzuatta öngörülen aktarım şartlarından uygun olanına dayanılarak gerçekleştirilir.",
      },
      {
        type: "p",
        tr: "Gerekli durumlarda yeterlilik kararı, uygun güvenceler, standart sözleşmeler veya mevzuatta öngörülen diğer hukuki aktarım mekanizmaları kullanılır.",
      },
      {
        type: "p",
        tr: "Ranz Global, yurt dışı aktarım faaliyetlerini ilgili mevzuatta öngörülen şartlar çerçevesinde yürütür.",
      },
    ],
  },
  {
    title: "9. Verilerin saklanması ve imhası",
    blocks: [
      {
        type: "p",
        tr: "Kişisel veriler, işlendikleri amaç için gerekli olan süre boyunca ve ilgili mevzuatta öngörülen zorunlu saklama süreleri kapsamında muhafaza edilir.",
      },
      {
        type: "p",
        tr: "Hizmet ilişkisinin sona ermesi kişisel verilerin tamamının derhal silineceği anlamına gelmez.",
      },
      { type: "p", tr: "Ranz Global’in;" },
      {
        type: "ul",
        items: [
          "yasal saklama yükümlülüklerinin yerine getirilmesi",
          "olası hukuki uyuşmazlıklarda hakların korunması",
          "resmi makam taleplerinin karşılanması",
          "muhasebe ve vergi yükümlülüklerinin yerine getirilmesi",
        ],
      },
      {
        type: "p",
        tr: "gibi hukuki nedenlerle saklaması gereken veriler, ilgili sürelerin sonuna kadar muhafaza edilebilir.",
      },
      {
        type: "p",
        tr: "İşleme sebebinin ve zorunlu saklama süresinin sona ermesi halinde kişisel veriler ilgili mevzuata uygun şekilde silinir, yok edilir veya anonim hale getirilir.",
      },
    ],
  },
  {
    title: "10. Veri güvenliği",
    blocks: [
      { type: "p", tr: "Ranz Global, kişisel verilerin;" },
      {
        type: "ul",
        items: [
          "hukuka aykırı olarak işlenmesini önlemek",
          "hukuka aykırı erişimi önlemek",
          "güvenli şekilde muhafazasını sağlamak",
        ],
      },
      {
        type: "p",
        tr: "amacıyla uygun teknik ve idari tedbirlerin alınmasına yönelik çalışmalar yürütür.",
      },
      {
        type: "p",
        tr: "Yetkilendirme, erişim kontrolü, kullanıcı doğrulama, kayıt tutma, güvenlik güncellemeleri, yedekleme ve benzeri güvenlik mekanizmaları risk ve sistemin niteliğine göre uygulanabilir.",
      },
      {
        type: "p",
        tr: "Bununla birlikte internet üzerinden gerçekleştirilen hiçbir veri iletim veya depolama sisteminin mutlak biçimde risksiz olduğu garanti edilemez.",
      },
      {
        type: "p",
        tr: "Bu hüküm, Ranz Global’in KVKK ve diğer mevzuattan doğan veri güvenliği yükümlülüklerini ortadan kaldırmaz veya sınırlandırmaz.",
      },
    ],
  },
  {
    title: "11. Kullanıcı hesabı ve belge güvenliği",
    blocks: [
      {
        type: "p",
        tr: "Kullanıcı, kendisine tahsis edilen hesap bilgilerinin gizliliğini korumalı ve hesabını üçüncü kişilerle paylaşmamalıdır.",
      },
      {
        type: "p",
        tr: "Kullanıcının kendi cihazı, e-posta hesabı veya kullanıcı hesabına üçüncü kişilerin eriştiğini düşünmesi halinde Ranz Global’i gecikmeksizin bilgilendirmesi önerilir.",
      },
      {
        type: "p",
        tr: "Kullanıcının kendi cihazından, e-posta hesabından veya kendi kontrolündeki iletişim kanallarından kaynaklanan güvenlik olayları ayrıca olayın özelliklerine göre değerlendirilir.",
      },
    ],
  },
  {
    title: "12. Vize başvuru sürecine ilişkin önemli açıklama",
    blocks: [
      {
        type: "p",
        tr: "Ranz Global özel bir vize ve seyahat danışmanlık hizmeti sağlayıcısıdır.",
      },
      {
        type: "p",
        tr: "Konsolosluk, büyükelçilik, göç idaresi veya resmi vize başvuru merkezi değildir ve bunların adına karar vermez.",
      },
      {
        type: "p",
        tr: "Vize başvurularının kabulü, reddi, vize süresi, giriş hakkı veya diğer göçmenlik kararları tamamen ilgili ülkenin yetkili makamlarının takdir ve yetkisindedir.",
      },
      {
        type: "p",
        tr: "Ranz Global tarafından sunulan danışmanlık hizmeti herhangi bir vizenin onaylanacağına ilişkin garanti oluşturmaz.",
      },
      {
        type: "p",
        tr: "Kullanıcı, başvuru kapsamında verdiği bilgi ve belgelerin doğru, güncel ve gerçeğe uygun olmasından sorumludur.",
      },
      {
        type: "p",
        tr: "Ranz Global, kendisine sunulan bilgi ve belgeleri hizmetin gerektirdiği ölçüde kontrol edebilir; ancak kullanıcı tarafından sunulan her belgenin gerçekliğini bağımsız olarak doğrulamakla yükümlü değildir.",
      },
    ],
  },
  {
    title: "13. İlgili kişinin KVKK kapsamındaki hakları",
    blocks: [
      {
        type: "p",
        tr: "KVKK’nın 11. maddesi kapsamında ilgili kişiler, kanunda belirtilen şartlarla;",
      },
      {
        type: "ul",
        items: [
          "kişisel verilerinin işlenip işlenmediğini öğrenme",
          "işlenmişse buna ilişkin bilgi talep etme",
          "işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
          "eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme",
          "kanuni şartların oluşması halinde kişisel verilerin silinmesini veya yok edilmesini isteme",
          "yapılan düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
          "kanunda belirtilen koşullarda münhasıran otomatik sistemlerle analiz sonucunda kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme",
          "kişisel verilerin kanuna aykırı işlenmesi nedeniyle zarara uğraması halinde zararın giderilmesini talep etme",
        ],
      },
      { type: "p", tr: "haklarına sahiptir." },
    ],
  },
  {
    title: "14. KVKK başvuruları",
    blocks: [
      { type: "p", tr: "KVKK kapsamındaki taleplerinizi;" },
      {
        type: "ul",
        items: [
          COMPANY.legalNameCaps,
          COMPANY.brandNoteTr,
          `Adres: ${COMPANY.address}`,
          `Ticaret sicili: ${COMPANY.tradeRegistry}`,
          `Vergi dairesi: ${COMPANY.taxOffice}`,
          `Vergi kimlik no: ${COMPANY.taxNo}`,
          `E-posta: ${COMPANY.email}`,
        ],
      },
      { type: "p", tr: "üzerinden, ilgili mevzuatta öngörülen usullere uygun şekilde iletebilirsiniz." },
      {
        type: "p",
        tr: "Başvurunun değerlendirilmesi için kimliğin doğrulanmasına yönelik ek bilgi talep edilebilir.",
      },
      {
        type: "p",
        tr: "Başvurular, niteliğine göre mevzuatta öngörülen süre içerisinde sonuçlandırılır.",
      },
    ],
  },
  {
    title: "15. Metinde yapılabilecek değişiklikler",
    blocks: [
      {
        type: "p",
        tr: "Ranz Global; mevzuat değişiklikleri, hizmetlerin kapsamı, kullanılan teknolojiler veya kişisel veri işleme süreçlerindeki değişiklikler doğrultusunda işbu Aydınlatma Metni’ni güncelleyebilir.",
      },
      {
        type: "p",
        tr: "Güncel metin internet sitesinde yayımlandığı tarihten itibaren uygulanır.",
      },
      {
        type: "p",
        tr: "Yapılan değişikliğin ayrıca açık rıza alınmasını gerektirdiği hallerde ilgili mevzuata uygun yöntem izlenir.",
      },
    ],
  },
  {
    title: "16. İletişim",
    blocks: [
      { type: "p", tr: "Kişisel verilerinizin korunmasına ilişkin soru ve talepleriniz için:" },
      {
        type: "ul",
        items: [
          COMPANY.legalName,
          COMPANY.brand,
          COMPANY.brandNoteTr,
          `E-posta: ${COMPANY.email}`,
          `Web: ${COMPANY.web}`,
        ],
      },
    ],
  },
  {
    title: "Önemli",
    blocks: [
      {
        type: "p",
        tr: "İşbu metin kişisel verilerin işlenmesine ilişkin aydınlatma amacı taşımaktadır.",
      },
      {
        type: "p",
        tr: "Açık rızaya tabi veri işleme faaliyetleri bulunması halinde, gerekli açık rıza metinleri bu aydınlatma metninden ayrı olarak sunulur.",
      },
    ],
  },
];

export const KVKK_INTRO = intro;

function blockToText(block: KvkkBlock) {
  if (block.type === "p") return block.tr;
  if (block.type === "h3") return block.tr;
  return block.items.map((item) => `• ${item}`).join("\n");
}

export function kvkkBodyTr() {
  const parts = [
    ...intro.map(blockToText),
    ...KVKK_SECTIONS.flatMap((section) => [section.title, ...section.blocks.map(blockToText)]),
  ];
  return parts.join("\n\n");
}

export const KVKK_BODY_EN = `This page is the official KVKK disclosure. The Turkish text prevails.

Last updated: 21 September 2026.

Controller: ${COMPANY.legalName}. ${COMPANY.brandNoteEn}
Address: ${COMPANY.address}. Trade registry: ${COMPANY.tradeRegistry}. Tax office: ${COMPANY.taxOffice}. Tax no: ${COMPANY.taxNo}.
Email: ${COMPANY.email}. Website: ${COMPANY.web}.

We process personal data to provide visa and travel consultancy, run the client portal, communicate with you, handle payments and meet legal duties. We do not ask for internet-banking passwords or card PIN codes. Visa decisions belong to official authorities. Approval is not guaranteed.

To exercise KVKK rights, write to ${COMPANY.email}.`;

export const KVKK_DESCRIPTION_TR =
  "Ranz Global KVKK aydınlatma metni: veri sorumlusu, işleme amaçları, aktarım, saklama ve ilgili kişi hakları.";
export const KVKK_DESCRIPTION_EN =
  "Ranz Global KVKK notice: controller, purposes, transfers, retention and data-subject rights. Turkish text prevails.";
