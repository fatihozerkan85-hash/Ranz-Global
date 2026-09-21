export type GuideFaq = { qTr: string; qEn: string; aTr: string; aEn: string };

export type GuideBlock =
  | { type: "p"; tr: string; en: string }
  | { type: "h2"; tr: string; en: string }
  | { type: "h3"; tr: string; en: string }
  | { type: "ul"; items: { tr: string; en: string }[] };

export type VisaGuide = {
  slug: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  metaTitleTr: string;
  metaDescriptionTr: string;
  serviceHref?: string;
  serviceRegion?: string;
  related: string[];
  faq: GuideFaq[];
  blocks: GuideBlock[];
};

const p = (tr: string, en: string): GuideBlock => ({ type: "p", tr, en });
const h2 = (tr: string, en: string): GuideBlock => ({ type: "h2", tr, en });
const h3 = (tr: string, en: string): GuideBlock => ({ type: "h3", tr, en });
const ul = (items: [string, string][]): GuideBlock => ({
  type: "ul",
  items: items.map(([tr, en]) => ({ tr, en })),
});

export const VISA_GUIDES: VisaGuide[] = [
  {
    slug: "schengen",
    titleTr: "Schengen Vize Rehberi",
    titleEn: "Schengen Visa Guide",
    descriptionTr: "Schengen vizesi, başvuru ülkesi, temel evraklar ve dosya tutarlılığı.",
    descriptionEn: "Schengen visas, where to apply, core documents and a consistent file.",
    metaTitleTr: "Schengen Vize Rehberi",
    metaDescriptionTr:
      "Schengen vizesi evrakları, hangi ülkeye başvurulacağı ve dosya tutarlılığı. Kişiye özel liste; karar konsolosluğa aittir.",
    serviceHref: "/hizmet/schengen",
    serviceRegion: "schengen",
    related: ["schengen-banka-hesabi", "kuzey-kibris-blog", "abd", "2026-ingiltere-vizesi-evraklar"],
    faq: [
      {
        qTr: "Schengen vizesi için hangi ülkeye başvurmalıyım?",
        qEn: "Which country should I apply to for a Schengen visa?",
        aTr: "Başvuru ülkesi yalnızca ilk girişe göre belirlenmez. Genel olarak seyahatin ana destinasyonu ve en uzun konaklama ülke dikkate alınır. Birden fazla ülkede konaklama süreleri ve plan birbiriyle uyumlu olmalıdır.",
        aEn: "You do not apply only by first entry. The main destination and the longest stay usually decide. For multi-country trips, stays and the itinerary should match.",
      },
      {
        qTr: "Schengen vizesi için temel evraklar nelerdir?",
        qEn: "What documents are usually needed for a Schengen visa?",
        aTr: "Pasaport, biyometrik fotoğraf, seyahat sağlık sigortası, uçuş ve konaklama, banka hareketleri, gelir ve meslek belgeleri, seyahat amacını gösteren belgeler; gerektiğinde dilekçe ve ek belgeler. Çalışan, şirket sahibi, emekli, öğrenci veya sponsorlu listeler farklıdır.",
        aEn: "Passport, photo, travel insurance, flights and stay, bank activity, income and work papers, purpose documents, and extra papers if needed. Employees, owners, retirees, students and sponsored applicants need different extras.",
      },
    ],
    blocks: [
      p(
        "Schengen vizesi; Almanya, Fransa, İtalya, İspanya, Hollanda, Danimarka, İsviçre ve diğer Schengen ülkelerine kısa süreli seyahatlerde kullanılan vize türüdür.",
        "A Schengen visa is used for short trips to Germany, France, Italy, Spain, the Netherlands, Denmark, Switzerland and other Schengen countries.",
      ),
      p(
        "Turistik, ticari, aile veya arkadaş ziyareti gibi seyahat amaçlarına göre hazırlanması gereken belgeler değişebilir.",
        "The papers you need can change for tourism, business, or a family or friend visit.",
      ),
      h2("Schengen vizesi için hangi ülkeye başvurmalıyım?", "Which country should I apply to?"),
      p(
        "Başvuru yapılacak ülke yalnızca ilk giriş yapılacak ülkeye göre belirlenmez. Genel olarak seyahatin ana destinasyonu ve en uzun konaklama yapılacak ülke dikkate alınır.",
        "The country you apply to is not only the first one you enter. The main destination and the longest stay usually count.",
      ),
      p(
        "Birden fazla Schengen ülkesini kapsayan seyahatlerde konaklama sürelerinin ve seyahat planının birbiriyle uyumlu olması önemlidir.",
        "If you visit more than one Schengen country, the nights you stay and the travel plan should line up.",
      ),
      h2("Schengen vizesi için temel evraklar nelerdir?", "What documents are usually needed?"),
      p(
        "Başvuru sahibinin mesleki ve mali durumuna göre değişmekle birlikte genellikle şu belgeler dosyada yer alır:",
        "The list depends on work and finances. These papers are often in the file:",
      ),
      ul([
        ["Geçerli pasaport", "Valid passport"],
        ["Biyometrik fotoğraf", "Biometric photo"],
        ["Seyahat sağlık sigortası", "Travel health insurance"],
        ["Uçuş ve konaklama bilgileri", "Flight and accommodation details"],
        ["Banka hesap hareketleri", "Bank account activity"],
        ["Gelir ve meslek belgeleri", "Income and occupation papers"],
        ["Seyahat amacını açıklayan belgeler", "Papers that explain the purpose of travel"],
        ["Gerektiğinde dilekçe ve ek destekleyici belgeler", "A letter and extra supporting papers if needed"],
      ]),
      p(
        "Çalışan, şirket sahibi, emekli, öğrenci veya sponsorlu başvuru sahiplerinin hazırlaması gereken ek belgeler birbirinden farklıdır.",
        "Extra papers for employees, company owners, retirees, students or sponsored applicants are not the same.",
      ),
      h2("Schengen başvurusunda nelere dikkat edilir?", "What do officers look at?"),
      p(
        "Başvuruda yalnızca evrakların bulunması yeterli değildir. Seyahat planı, gelir durumu, banka hareketleri, mesleki durum ve Türkiye’ye veya KKTC’ye dönüş bağlarının birbiriyle tutarlı olması önem taşır.",
        "Having papers on the table is not enough. The itinerary, income, bank activity, work situation and ties back to Türkiye or the TRNC should tell the same story.",
      ),
      p(
        "Ranz Global, başvuru sahibinin profilini değerlendirerek kişiye özel evrak listesini oluşturur, belgeleri kontrol eder ve dosyayı başvuruya hazır hale getirir. [Schengen vize danışmanlığı](/hizmet/schengen) sayfasında ücret ve kapsam durur. KKTC’den açılan dosyalar için [Kuzey Kıbrıs Schengen vize danışmanlığı](/blog/kuzey-kibris-schengen-vize-danismanligi) yazısına bakın. Banka bakiyesi için [Schengen vizesi banka hesabı](/vize-rehberi/schengen-banka-hesabi) rehberini okuyun.",
        "Ranz Global reviews your profile, builds a personal list, checks the papers and gets the file ready to apply. Fees and scope sit on [Schengen visa consultancy](/hizmet/schengen). For TRNC files see [Northern Cyprus Schengen visa consultancy](/blog/kuzey-kibris-schengen-vize-danismanligi). For balances see the [Schengen bank account](/vize-rehberi/schengen-banka-hesabi) guide.",
      ),
      p(
        "Nihai vize kararı ilgili konsolosluk veya yetkili makam tarafından verilir.",
        "The final visa decision belongs to the consulate or competent authority.",
      ),
    ],
  },
  {
    slug: "abd",
    titleTr: "ABD Vize Rehberi",
    titleEn: "USA Visa Guide",
    descriptionTr: "ABD B1/B2 vizesi, DS-160, belgeler ve mülakat öncesi dosya.",
    descriptionEn: "US B1/B2 visas, DS-160, documents and interview prep on the file.",
    metaTitleTr: "ABD Vize Rehberi",
    metaDescriptionTr:
      "ABD B1/B2 vizesi, DS-160, belgeler ve mülakat. Ranz Global dosyayı hazırlar; karar ABD makamlarına aittir.",
    serviceHref: "/hizmet/abd",
    serviceRegion: "abd",
    related: ["abd-vizesi-mulakat", "schengen", "2026-ingiltere-vizesi-evraklar"],
    faq: [
      {
        qTr: "ABD B1/B2 vizesi nedir?",
        qEn: "What is a US B1/B2 visa?",
        aTr: "B1 belirli kısa süreli iş ve ticari faaliyetler, B2 turistik seyahat, aile/arkadaş ziyareti ve uygun diğer ziyaret amaçları için kullanılabilir. DS-160’ın doğru ve tutarlı hazırlanması önemlidir.",
        aEn: "B1 covers certain short business activity. B2 covers tourism, family or friend visits and other suitable visits. DS-160 must be accurate and consistent.",
      },
      {
        qTr: "ABD vizesinde mülakat önemli mi?",
        qEn: "Does the US visa interview matter?",
        aTr: "Evet. Görevli seyahat amacı, meslek, gelir, seyahat geçmişi veya ABD planı hakkında soru sorabilir. DS-160 ile mülakat cevapları tutarlı olmalıdır.",
        aEn: "Yes. An officer may ask about purpose, work, income, travel history or US plans. Answers should match DS-160.",
      },
    ],
    blocks: [
      p(
        "ABD vize başvurularında başvurulacak vize türü seyahat amacına göre belirlenir. Turistik ve kısa süreli iş seyahatlerinde çoğunlukla B1/B2 vizesi, eğitim amacıyla yapılacak başvurularda ise uygun öğrenci vizesi kategorileri kullanılır.",
        "The US visa type follows the purpose of travel. Tourism and short business trips often use B1/B2. Study uses the matching student category.",
      ),
      h2("ABD B1/B2 vizesi nedir?", "What is a US B1/B2 visa?"),
      p(
        "B1 kategorisi belirli kısa süreli iş ve ticari faaliyetler, B2 kategorisi ise turistik seyahatler, aile/arkadaş ziyaretleri ve uygun diğer ziyaret amaçları için kullanılabilir.",
        "B1 is for certain short business activity. B2 is for tourism, family or friend visits and other suitable visits.",
      ),
      p(
        "Başvurunun en önemli aşamalarından biri DS-160 formunun doğru ve tutarlı şekilde hazırlanmasıdır.",
        "One of the most important steps is completing DS-160 correctly and consistently.",
      ),
      h2("ABD vizesi için hangi belgeler hazırlanır?", "Which documents are prepared?"),
      p("Başvurunun niteliğine göre şu belgeler hazırlanabilir:", "Depending on the case, these papers may be prepared:"),
      ul([
        ["Geçerli pasaport", "Valid passport"],
        ["DS-160 onay sayfası", "DS-160 confirmation page"],
        ["Randevu teyidi", "Appointment confirmation"],
        ["Uygun fotoğraf", "A suitable photo"],
        ["Seyahat planına ilişkin bilgiler", "Travel-plan details"],
        ["Mali durumu gösteren belgeler", "Papers that show finances"],
        ["Çalışma veya şirket belgeleri", "Work or company papers"],
        ["Gerektiğinde davetiye ve diğer destekleyici belgeler", "An invitation and other supporting papers if needed"],
      ]),
      p(
        "Her başvuru sahibinin profili farklı olduğu için tek bir standart evrak listesi bütün başvurular için yeterli olmayabilir.",
        "Profiles differ, so one standard list may not cover every application.",
      ),
      h2("ABD vizesinde mülakat önemli mi?", "Does the interview matter?"),
      p(
        "Evet. Konsolosluk görevlisi başvuru sahibine seyahat amacı, mesleği, gelir durumu, seyahat geçmişi veya ABD seyahatinin detayları hakkında sorular yöneltebilir.",
        "Yes. An officer may ask about purpose, work, income, travel history or details of the US trip.",
      ),
      p(
        "DS-160 formunda verilen bilgiler ile mülakatta verilen cevapların birbiriyle tutarlı olması önemlidir. Sık sorulan başlıklar için [ABD vizesi mülakatında ne sorulur?](/vize-rehberi/abd-vizesi-mulakat) rehberine bakın.",
        "What you wrote on DS-160 and what you say at the interview should match. See [what is asked at a US visa interview](/vize-rehberi/abd-vizesi-mulakat).",
      ),
      p(
        "Ranz Global; DS-160 hazırlığı, dosya kontrolü ve mülakat öncesi hazırlık konusunda danışmanlık sağlar. Kapsam [ABD vize danışmanlığı](/hizmet/abd) sayfasındadır. Vize kararı yalnızca ABD’nin yetkili makamlarına aittir.",
        "Ranz Global advises on DS-160, file review and interview prep. Scope sits on [US visa consultancy](/hizmet/abd). The decision belongs only to US authorities.",
      ),
    ],
  },
  {
    slug: "2026-ingiltere-vizesi-evraklar",
    titleTr: "2026 İngiltere Vizesi İçin Gerekli Evraklar",
    titleEn: "Documents For A 2026 UK Visa",
    descriptionTr: "İngiltere Standard Visitor evrakları, banka hareketleri ve kişiye özel liste.",
    descriptionEn: "UK Standard Visitor papers, bank activity and a personal list.",
    metaTitleTr: "2026 İngiltere Vizesi İçin Gerekli Evraklar",
    metaDescriptionTr:
      "2026 İngiltere Standard Visitor evrakları, banka hareketleri ve bağlar. Tek şablon yoktur; karar UKVI’ya aittir.",
    serviceHref: "/hizmet/ingiltere",
    serviceRegion: "ingiltere",
    related: ["sirket-sahipleri-ingiltere", "sponsorlu-vize", "calismayan-vize"],
    faq: [
      {
        qTr: "Banka hesabı neden önemlidir?",
        qEn: "Why does the bank account matter?",
        aTr: "Yalnızca son bakiyeye bakmak doğru değildir. Geçmiş hareketler, düzenli gelir, seyahat masrafları ve formdaki bilgilerle mali durumun uyumu önemlidir. Açıklanamayan yüksek girişler ek açıklama gerektirebilir.",
        aEn: "The last balance alone is not enough. Past activity, regular income, trip costs and the form should match. Unexplained large deposits may need an explanation.",
      },
    ],
    blocks: [
      p(
        "İngiltere Standard Visitor vizesi başvurusunda hazırlanacak belgeler kişinin çalışma durumu, gelir kaynakları, seyahat amacı ve seyahat masraflarını kimin karşılayacağına göre değişir.",
        "Papers for a UK Standard Visitor visa change with work, income, purpose and who pays for the trip.",
      ),
      p(
        "Bu nedenle İngiltere vize başvurularında herkese uygulanabilecek tek bir standart evrak listesi bulunmaz.",
        "There is no one list that fits every UK visa application.",
      ),
      h2("Temel İngiltere vizesi belgeleri", "Core UK visa documents"),
      p("Başvuru profiline göre aşağıdaki belgeler kullanılabilir:", "Depending on the profile, these papers may be used:"),
      ul([
        ["Geçerli pasaport", "Valid passport"],
        ["Seyahat amacı ve planını destekleyen bilgiler", "Details that support purpose and itinerary"],
        ["Konaklama bilgileri", "Accommodation details"],
        ["Banka hesap hareketleri", "Bank account activity"],
        ["Gelir belgeleri", "Income papers"],
        ["Çalışma veya şirket belgeleri", "Work or company papers"],
        ["Türkiye’deki veya KKTC’deki ekonomik ve sosyal bağları destekleyen belgeler", "Papers that support economic and social ties in Türkiye or the TRNC"],
        ["Sponsor bulunuyorsa sponsora ait mali belgeler ve ilişki kanıtları", "If there is a sponsor: their finances and proof of the relationship"],
        ["Gerektiğinde açıklayıcı dilekçe ve ek belgeler", "An explanatory letter and extra papers if needed"],
      ]),
      h2("Banka hesabı neden önemlidir?", "Why does the bank account matter?"),
      p(
        "İngiltere vize başvurusunda yalnızca hesabın son bakiyesine bakılması doğru değildir.",
        "Looking only at the last balance on a UK file is not the right approach.",
      ),
      p(
        "Hesabın geçmiş hareketleri, düzenli gelir kaynakları, seyahat masrafları ve başvuruda belirtilen bilgilerle mali durumun uyumlu olması önem taşır.",
        "Past activity, regular income, trip costs and what you wrote on the application should match the money picture.",
      ),
      p(
        "Açıklanamayan yüksek tutarlı para girişleri veya başvuru formu ile mali belgeler arasındaki uyumsuzluklar ayrıca açıklama gerektirebilir.",
        "Unexplained large deposits, or a mismatch between the form and the money papers, may need an extra explanation.",
      ),
      p(
        "Ranz Global, başvuru sahibinin profilini değerlendirerek kişiye özel evrak listesini oluşturur ve başvuru öncesinde dosyanın bütünlüğünü kontrol eder. Ücret ve kapsam [İngiltere vize danışmanlığı](/hizmet/ingiltere) sayfasındadır. Şirket sahipleri için [İngiltere vizesi evrakları](/vize-rehberi/sirket-sahipleri-ingiltere) rehberine bakın.",
        "Ranz Global reviews your profile, builds a personal list and checks the file before you apply. Fees sit on [UK visa consultancy](/hizmet/ingiltere). Company owners should read [UK visa documents for owners](/vize-rehberi/sirket-sahipleri-ingiltere).",
      ),
    ],
  },
  {
    slug: "abd-vizesi-mulakat",
    titleTr: "ABD Vizesi Mülakatında Ne Sorulur?",
    titleEn: "What Is Asked At A US Visa Interview?",
    descriptionTr: "ABD mülakatında sık konular, tutarlı cevap ve DS-160 uyumu.",
    descriptionEn: "Common US interview topics, direct answers and DS-160 consistency.",
    metaTitleTr: "ABD Vizesi Mülakatında Ne Sorulur?",
    metaDescriptionTr:
      "ABD vize mülakatında sık sorulan konular ve tutarlı cevap. DS-160 ile çelişmeyin; karar konsolosluğa aittir.",
    serviceHref: "/hizmet/abd",
    serviceRegion: "abd",
    related: ["abd", "sponsorlu-vize", "calismayan-vize"],
    faq: [
      {
        qTr: "ABD vizesi mülakatında ne sorulur?",
        qEn: "What is asked at a US visa interview?",
        aTr: "Herkese aynı sorular sorulmaz. Sık başlıklar: neden ABD, hangi şehirler, süre, masrafları kim karşılayacak, iş, çalışma süresi, yurt dışı geçmişi, ABD’de akraba, neden geri döneceğiniz.",
        aEn: "Not everyone gets the same questions. Common topics: why the US, which cities, how long, who pays, work, how long you have worked, travel history, relatives in the US, why you will return.",
      },
      {
        qTr: "Mülakatta nasıl cevap verilmelidir?",
        qEn: "How should you answer?",
        aTr: "Açık, doğru ve formdaki bilgilerle tutarlı cevap verin. Gereğinden uzun veya ezberlenmiş cevap yerine sorulan soruya doğrudan cevap verin.",
        aEn: "Answer clearly, truthfully and in line with the form. Prefer a direct answer over a long memorised speech.",
      },
    ],
    blocks: [
      p(
        "ABD vize mülakatında herkese aynı sorular sorulmaz. Konsolosluk görevlisinin soruları başvuru sahibinin profiline, seyahat amacına ve DS-160 formundaki bilgilere göre değişebilir.",
        "Not everyone is asked the same questions. The officer follows your profile, purpose and DS-160.",
      ),
      h2("Sık karşılaşılan konu başlıkları", "Topics that come up often"),
      ul([
        ["ABD’ye neden gitmek istiyorsunuz?", "Why do you want to go to the US?"],
        ["Hangi şehirlere gideceksiniz?", "Which cities will you visit?"],
        ["Ne kadar süre kalacaksınız?", "How long will you stay?"],
        ["Seyahat masraflarınızı kim karşılayacak?", "Who will pay for the trip?"],
        ["Ne iş yapıyorsunuz?", "What do you do for work?"],
        ["Ne kadar süredir çalışıyorsunuz?", "How long have you been in that job?"],
        ["Daha önce yurt dışına çıktınız mı?", "Have you travelled abroad before?"],
        ["ABD’de akrabanız veya tanıdığınız var mı?", "Do you have family or friends in the US?"],
        ["Seyahat sonrasında neden geri döneceksiniz?", "Why will you return after the trip?"],
      ]),
      h2("Mülakatta nasıl cevap verilmelidir?", "How should you answer?"),
      p(
        "Sorulara açık, doğru ve başvuru formunda verilen bilgilerle tutarlı cevaplar verilmelidir.",
        "Answers should be clear, true and consistent with the application form.",
      ),
      p(
        "Gereğinden uzun veya ezberlenmiş cevaplar yerine sorulan soruya doğrudan cevap verilmesi daha doğru bir yaklaşımdır.",
        "A direct answer to the question asked is better than a long, memorised speech.",
      ),
      p(
        "Ranz Global, başvuru öncesinde DS-160 formu ile başvuru sahibinin seyahat ve mali bilgilerinin tutarlılığını kontrol eder ve mülakat hazırlığı konusunda danışmanlık sağlar. Genel çerçeve [ABD vize rehberi](/vize-rehberi/abd) ve [ABD vize danışmanlığı](/hizmet/abd) sayfalarındadır. Ranz Global mülakatı sizin yerinize yapmaz.",
        "Before you apply, Ranz Global checks that DS-160 matches your travel and money papers and advises on interview prep. See the [US visa guide](/vize-rehberi/abd) and [US visa consultancy](/hizmet/abd). Ranz Global does not attend the interview in your place.",
      ),
    ],
  },
  {
    slug: "schengen-banka-hesabi",
    titleTr: "Schengen Vizesi Banka Hesabında Ne Kadar Para Olmalı?",
    titleEn: "How Much Money For A Schengen Visa Bank Account?",
    descriptionTr: "Schengen’de tek bakiye yoktur; hareket, kaynak ve seyahat süresi birlikte bakılır.",
    descriptionEn: "There is no single Schengen balance; activity, source and trip length are read together.",
    metaTitleTr: "Schengen Vizesi Banka Hesabında Ne Kadar Para Olmalı?",
    metaDescriptionTr:
      "Schengen’de herkese aynı bakiye yoktur. Hareket, paranın kaynağı ve seyahat süresi birlikte bakılır. Karar konsolosluğa aittir.",
    serviceHref: "/hizmet/schengen",
    serviceRegion: "schengen",
    related: ["schengen", "sponsorlu-vize", "calismayan-vize"],
    faq: [
      {
        qTr: "Schengen vizesi banka hesabında ne kadar para olmalı?",
        qEn: "How much money should be in a Schengen visa bank account?",
        aTr: "Herkes için geçerli tek bir bakiye yoktur. Gidilecek ülke, seyahat süresi, konaklama ve ulaşım giderleri ile masrafları kimin karşıladığı değişir.",
        aEn: "There is no one balance for everyone. The country, trip length, stay and travel costs, and who pays, all change the picture.",
      },
      {
        qTr: "Sadece hesap bakiyesi yeterli mi?",
        qEn: "Is the balance on the day enough?",
        aTr: "Hayır. Başvuru günündeki bakiye kadar geçmiş hareketler ve paranın kaynağının açıklanabilir olması da önemlidir. Kaynağı belgesiz yüksek yatırımlar ek değerlendirmeye yol açabilir.",
        aEn: "No. Past activity and a clear source of funds matter as much as the balance on the day. Unexplained large deposits can trigger extra review.",
      },
    ],
    blocks: [
      p(
        "Schengen vizesi için herkes için geçerli tek bir banka bakiyesi bulunmaz.",
        "There is no single bank balance that works for every Schengen visa.",
      ),
      p(
        "Gerekli mali yeterlilik; gidilecek ülkeye, seyahat süresine, konaklama ve ulaşım giderlerine ve seyahat masraflarını kimin karşılayacağına göre değişebilir.",
        "What looks sufficient can change with the country, trip length, stay and travel costs, and who pays.",
      ),
      h2("Sadece hesap bakiyesi yeterli mi?", "Is the balance alone enough?"),
      p("Hayır.", "No."),
      p(
        "Konsolosluk açısından yalnızca başvuru günündeki bakiye değil, hesabın geçmiş hareketleri ve paranın kaynağının açıklanabilir olması da önemlidir.",
        "Officers look beyond the balance on the day. Past activity and a clear source of funds matter too.",
      ),
      p(
        "Örneğin başvurudan hemen önce hesaba kaynağı açıklanmayan yüksek miktarda para yatırılması ek değerlendirmeye neden olabilir.",
        "A large, unexplained deposit just before applying can lead to extra questions.",
      ),
      p(
        "Düzenli maaş, şirket geliri, kira geliri veya diğer belgelenebilir gelir kaynaklarının banka hareketleriyle uyumlu olması dosyanın mali bütünlüğü açısından önemlidir.",
        "Regular salary, company income, rent or other documented income should match the bank activity.",
      ),
      p(
        "Ranz Global, seyahat süresi ve başvuru sahibinin mali profiline göre banka belgelerini dosya bütünlüğü açısından değerlendirir. Genel çerçeve [Schengen vize rehberi](/vize-rehberi/schengen) ve [Schengen vize danışmanlığı](/hizmet/schengen) sayfalarındadır. Kesin bir euro rakamı vaat etmeyiz.",
        "Ranz Global reviews bank papers against trip length and your money profile. See the [Schengen visa guide](/vize-rehberi/schengen) and [Schengen visa consultancy](/hizmet/schengen). We do not promise a euro figure.",
      ),
    ],
  },
  {
    slug: "vize-reddi-sonrasi",
    titleTr: "Vize Reddinden Sonra Tekrar Başvuru Yapılabilir Mi?",
    titleEn: "Can You Apply Again After A Visa Refusal?",
    descriptionTr: "Ret sonrası yeniden başvuru mümkündür; aynı dosyayı tekrar sunmak doğru değildir.",
    descriptionEn: "A new application after a refusal is often possible; repeating the same file is not.",
    metaTitleTr: "Vize Reddinden Sonra Tekrar Başvuru Yapılabilir Mi?",
    metaDescriptionTr:
      "Ret sonrası yeniden başvuru çoğu ülkede mümkündür. Gerekçeyi okuyun, dosyayı yenileyin. Onay garantisi yoktur.",
    serviceHref: "/vize-reddi",
    related: ["sponsorlu-vize", "schengen", "abd"],
    faq: [
      {
        qTr: "Vize reddinden sonra tekrar başvuru yapılabilir mi?",
        qEn: "Can you apply again after a visa refusal?",
        aTr: "Birçok vize türünde mümkündür. Aynı dosyayı tekrar sunmak doğru değildir. Ret gerekçesi okunmalı, zayıf noktalar belirlenmeli ve yeni dosya buna göre hazırlanmalıdır.",
        aEn: "Often yes. Repeating the same file is not the right approach. Read the grounds, mark weak points and build the new file around them.",
      },
      {
        qTr: "Yeniden başvuruda ne yapılmalı?",
        qEn: "What should you do on a new application?",
        aTr: "Önceki ret incelenmeli, eksik veya zayıf noktalar belirlenmeli, durum değiştiyse belgelerle desteklenmelidir. Yeni başvuru onay anlamına gelmez.",
        aEn: "Review the refusal, fix gaps, and document any change in your situation. A new application is not an approval.",
      },
    ],
    blocks: [
      p(
        "Birçok vize türünde ret sonrasında yeniden başvuru yapılması mümkündür. Ancak yeni başvurunun önceki dosyanın aynısı olarak tekrar sunulması doğru bir yaklaşım değildir.",
        "For many visa types you can apply again after a refusal. Submitting the same file again is not the right approach.",
      ),
      p(
        "Öncelikle ret kararının gerekçesi dikkatle değerlendirilmelidir.",
        "First, read the refusal grounds carefully.",
      ),
      p(
        "Ret nedenleri arasında mali durumun yeterince açıklanamaması, seyahat amacının net olmaması, belgeler arasında tutarsızlık veya başvuru sahibinin geri dönüş bağlarının yeterince ortaya konulamaması gibi farklı konular bulunabilir.",
        "Grounds can include finances that are not explained, an unclear purpose, papers that do not match, or ties home that are not shown well enough.",
      ),
      h2("Yeniden başvuruda ne yapılmalı?", "What should you do next?"),
      p(
        "Önceki ret kararı incelenmeli, dosyadaki eksik veya zayıf noktalar belirlenmeli ve yeni başvuru buna göre hazırlanmalıdır.",
        "Review the refusal, mark gaps or weak points, and prepare the new application around them.",
      ),
      p(
        "Başvuru sahibinin durumunda değişiklik meydana geldiyse bu değişiklikler de uygun belgelerle desteklenmelidir.",
        "If your situation has changed, that change should be backed with suitable papers.",
      ),
      p(
        "Ranz Global, ret kararını ve önceki başvuru dosyasını inceleyerek yeniden başvuru için dosyanın hazırlanmasına destek sağlar. Talebi [vize reddi](/vize-reddi) sayfasından bırakabilirsiniz.",
        "Ranz Global reviews the refusal and the old file and helps prepare a new one. You can send the request on the [visa refusal](/vize-reddi) page.",
      ),
      p(
        "Yeni başvuru yapılması vizenin onaylanacağı anlamına gelmez. Nihai karar ilgili ülkenin yetkili makamına aittir.",
        "A new application does not mean the visa will be approved. The decision belongs to the competent authority.",
      ),
    ],
  },
  {
    slug: "sirket-sahipleri-ingiltere",
    titleTr: "Şirket Sahipleri İçin İngiltere Vizesi Evrakları",
    titleEn: "UK Visa Documents For Company Owners",
    descriptionTr: "Şirket ve kişisel belgeler, hesap hareketi ve seyahat masrafının kaynağı.",
    descriptionEn: "Company and personal papers, account activity and who pays for the trip.",
    metaTitleTr: "Şirket Sahipleri İçin İngiltere Vizesi Evrakları",
    metaDescriptionTr:
      "Şirket sahipleri için İngiltere vizesi: vergi, sicil, şirket ve kişisel hesap. Masrafın kaynağı açık olmalı.",
    serviceHref: "/hizmet/ingiltere",
    serviceRegion: "ingiltere",
    related: ["2026-ingiltere-vizesi-evraklar", "sponsorlu-vize", "calismayan-vize"],
    faq: [
      {
        qTr: "Şirket sahipleri İngiltere vizesinde hangi evrakları hazırlar?",
        qEn: "What UK visa papers do company owners prepare?",
        aTr: "Vergi levhası, faaliyet belgesi, ticaret sicil, imza sirküleri, şirket ve kişisel hesap hareketleri, ortaklık belgesi, gelir, seyahat amacı ve konaklama eklenebilir. Şirket hesabı ile kişisel gelir ayrı okunur.",
        aEn: "Tax plate, activity paper, trade registry, signature circular, company and personal statements, ownership papers, income, purpose and stay may be added. Company cash and personal income are read separately.",
      },
    ],
    blocks: [
      p(
        "Şirket sahiplerinin İngiltere vize başvurularında hem kişisel mali durumlarının hem de şirketle olan ekonomik bağlarının doğru şekilde gösterilmesi önemlidir.",
        "For company owners on a UK visa file, both personal finances and the economic tie to the company should be shown clearly.",
      ),
      p("Başvuru profiline göre şu belgeler dosyaya eklenebilir:", "Depending on the profile, these papers may go on the file:"),
      ul([
        ["Vergi levhası", "Tax plate"],
        ["Faaliyet belgesi", "Certificate of activity"],
        ["Ticaret sicil belgeleri", "Trade registry papers"],
        ["İmza sirküleri", "Signature circular"],
        ["Şirket banka hesap hareketleri", "Company bank activity"],
        ["Kişisel banka hesap hareketleri", "Personal bank activity"],
        ["Şirket sahipliğini veya ortaklığını gösteren belgeler", "Papers that show ownership or partnership"],
        ["Gelir durumunu destekleyen belgeler", "Papers that support income"],
        ["Seyahat amacı ve konaklama bilgileri", "Purpose of travel and accommodation"],
      ]),
      p(
        "Şirket hesabındaki para ile kişisel gelir birbirinden farklı değerlendirilmelidir. Başvuru sahibinin seyahat masraflarını hangi kaynaktan karşılayacağı açık şekilde gösterilmelidir.",
        "Money in the company account and personal income are not the same thing. It should be clear which source pays for the trip.",
      ),
      p(
        "Ranz Global, şirket sahibi başvuru sahipleri için şirket ve kişisel belgeleri birlikte değerlendirerek kişiye özel dosya hazırlığı sağlar. Genel İngiltere listesi [2026 İngiltere vizesi evrakları](/vize-rehberi/2026-ingiltere-vizesi-evraklar) rehberinde, ücret [İngiltere vize danışmanlığı](/hizmet/ingiltere) sayfasındadır.",
        "Ranz Global reads company and personal papers together and prepares a personal file. The general UK list is in [2026 UK visa documents](/vize-rehberi/2026-ingiltere-vizesi-evraklar). Fees sit on [UK visa consultancy](/hizmet/ingiltere).",
      ),
    ],
  },
  {
    slug: "calismayan-vize",
    titleTr: "Çalışmayan Biri Vize Alabilir Mi?",
    titleEn: "Can Someone Who Is Not Working Get A Visa?",
    descriptionTr: "Çalışmamak ret demek değildir; mali kaynak, sponsor ve bağlar belgelenir.",
    descriptionEn: "Not working is not an automatic no; funds, a sponsor and ties still need papers.",
    metaTitleTr: "Çalışmayan Biri Vize Alabilir Mi?",
    metaDescriptionTr:
      "Çalışmamak vize alınamayacağı anlamına gelmez. Sponsor, gelir kaynağı ve bağlar belgelenir. Onay garantisi yoktur.",
    serviceHref: "/hizmetler",
    related: ["sponsorlu-vize", "2026-ingiltere-vizesi-evraklar", "schengen"],
    faq: [
      {
        qTr: "Çalışmayan biri vize alabilir mi?",
        qEn: "Can someone who is not working get a visa?",
        aTr: "Evet. Öğrenciler, ev hanımları veya düzenli maaşı olmayanlar da uygun mali kaynak ve belgelerle başvurabilir. Çalışmamak tek başına ret demek değildir.",
        aEn: "Yes. Students, homemakers or people without a regular salary can still apply with suitable funds and papers. Not working is not an automatic refusal.",
      },
      {
        qTr: "Masrafları başkası karşılayabilir mi?",
        qEn: "Can someone else pay the costs?",
        aTr: "Eş, anne, baba veya uygun durumlarda başka biri karşılayabilir. Sponsorun mali yeterliliği ve ilişki belgelenmelidir. Başvuru sahibinin kendi bağları da dosyada durur.",
        aEn: "A spouse, parent or, in suitable cases, another person can pay. The sponsor’s finances and the relationship should be documented. Your own ties still sit on the file.",
      },
    ],
    blocks: [
      p(
        "Evet. Çalışmıyor olmak tek başına vize alınamayacağı anlamına gelmez.",
        "Yes. Not working does not by itself mean you cannot apply for a visa.",
      ),
      p(
        "Öğrenciler, ev hanımları, çalışmayan kişiler veya düzenli maaşı bulunmayan başvuru sahipleri de uygun mali kaynak ve belgelerle vize başvurusu yapabilir.",
        "Students, homemakers, people who are not working or who do not have a regular salary can still apply with suitable funds and papers.",
      ),
      h2("Masrafları başkası karşılayabilir mi?", "Can someone else pay?"),
      p(
        "Başvuru sahibinin seyahat masraflarını eşi, anne veya babası ya da uygun durumlarda başka bir kişi karşılayabilir.",
        "A spouse, a parent or, in suitable cases, another person can cover the trip.",
      ),
      p(
        "Bu durumda sponsorun mali yeterliliğinin ve başvuru sahibiyle ilişkisinin belgelenmesi gerekebilir.",
        "Then the sponsor’s finances and the relationship to you may need to be documented.",
      ),
      p(
        "Bunun yanında başvuru sahibinin kendi sosyal, ailevi, eğitim veya ekonomik bağlarının da dosyada doğru şekilde gösterilmesi önemlidir.",
        "Your own social, family, study or economic ties should still be shown clearly on the file.",
      ),
      p(
        "Ranz Global, çalışmayan veya sponsorlu başvuracak kişilerin durumunu değerlendirerek uygun evrak listesini oluşturur. Sponsor belgeleri için [sponsorlu vize başvurusu](/vize-rehberi/sponsorlu-vize) rehberine bakın. Ülke seçimi [hizmetler](/hizmetler) sayfasındadır.",
        "Ranz Global reviews the situation and builds a suitable list. See [sponsored visa applications](/vize-rehberi/sponsorlu-vize). Pick a country on [services](/hizmetler).",
      ),
    ],
  },
  {
    slug: "sponsorlu-vize",
    titleTr: "Sponsorlu Vize Başvurusu Nasıl Yapılır?",
    titleEn: "How Does A Sponsored Visa Application Work?",
    descriptionTr: "Sponsor dilekçesi, mali belgeler, ilişki kanıtı ve sizin bağlarınız.",
    descriptionEn: "Sponsor letter, finances, proof of relationship and your own ties.",
    metaTitleTr: "Sponsorlu Vize Başvurusu Nasıl Yapılır?",
    metaDescriptionTr:
      "Sponsorlu vize: dilekçe, kimlik, banka ve ilişki belgesi. Yüksek bakiye yetmez; sizin belgeleriniz de durur.",
    serviceHref: "/hizmetler",
    related: ["calismayan-vize", "2026-ingiltere-vizesi-evraklar", "schengen"],
    faq: [
      {
        qTr: "Sponsorlu vize başvurusu nasıl yapılır?",
        qEn: "How does a sponsored visa application work?",
        aTr: "Masrafların tamamını veya bir kısmını başka biri karşılıyorsa sponsorlu başvuru yapılabilir. Sponsor dilekçe, kimlik, banka, gelir ve ilişki belgesi verebilir. Sizin belgeleriniz yine dosyada durur.",
        aEn: "If someone else pays all or part of the costs, you can apply with a sponsor. They may give a letter, ID, bank and income papers and proof of the relationship. Your own papers still sit on the file.",
      },
      {
        qTr: "Sponsordan hangi belgeler istenebilir?",
        qEn: "What papers can be asked from a sponsor?",
        aTr: "Ülkeye göre dilekçe, kimlik veya pasaport, banka hareketleri, maaş veya gelir, çalışma/şirket belgeleri ve ilişkiyi gösteren belgeler talep edilebilir. Yüksek bakiye tek başına yetmez.",
        aEn: "Depending on the country: a letter, ID or passport, bank activity, salary or income, work or company papers, and proof of the relationship. A high balance alone is not enough.",
      },
    ],
    blocks: [
      p(
        "Seyahat masraflarını kendisi karşılayamayan veya masrafları başka biri tarafından karşılanacak kişiler sponsorlu vize başvurusu yapabilir.",
        "If you cannot pay the trip yourself, or someone else will pay, you can apply with a sponsor.",
      ),
      p(
        "Sponsor; başvuru sahibinin seyahat, konaklama veya diğer masraflarının tamamını ya da bir bölümünü karşılayabilir.",
        "A sponsor can cover all or part of travel, stay or other costs.",
      ),
      h2("Sponsordan hangi belgeler istenebilir?", "What papers can be asked from a sponsor?"),
      p(
        "Başvurulan ülkeye ve sponsorun durumuna göre şu belgeler talep edilebilir:",
        "Depending on the country and the sponsor, these papers may be asked for:",
      ),
      ul([
        ["Sponsor dilekçesi", "Sponsor letter"],
        ["Kimlik veya pasaport", "ID or passport"],
        ["Banka hesap hareketleri", "Bank account activity"],
        ["Maaş veya gelir belgeleri", "Salary or income papers"],
        ["Çalışma veya şirket belgeleri", "Work or company papers"],
        ["Başvuru sahibi ile ilişkiyi gösteren belgeler", "Papers that show the relationship to the applicant"],
      ]),
      p(
        "Sponsorun yüksek banka bakiyesine sahip olması tek başına yeterli değildir. Sponsorun gelirinin açıklanabilir olması ve başvuru sahibiyle ilişkisinin dosyada anlaşılır şekilde gösterilmesi önemlidir.",
        "A high bank balance is not enough on its own. The sponsor’s income should be explainable, and the relationship should be clear on the file.",
      ),
      p(
        "Ayrıca sponsor bulunması, başvuru sahibinin kendi durumuna ilişkin belgelerin sunulmasına gerek olmadığı anlamına gelmez. Çalışmayan profiller için [çalışmayan biri vize alabilir mi?](/vize-rehberi/calismayan-vize) rehberine bakın. Ülkeyi [hizmetler](/hizmetler) üzerinden seçin.",
        "A sponsor does not mean you can skip your own papers. See [can someone who is not working get a visa?](/vize-rehberi/calismayan-vize). Choose a country on [services](/hizmetler).",
      ),
    ],
  },
];

const RELATED_BLOG: Record<string, { href: string; titleTr: string; titleEn: string }> = {
  "kuzey-kibris-blog": {
    href: "/blog/kuzey-kibris-schengen-vize-danismanligi",
    titleTr: "Kuzey Kıbrıs Schengen Vize Danışmanlığı",
    titleEn: "Northern Cyprus Schengen Visa Consultancy",
  },
};

export function getVisaGuide(slug: string) {
  return VISA_GUIDES.find((g) => g.slug === slug);
}

export function relatedGuides(guide: VisaGuide) {
  const rows: { href: string; titleTr: string; titleEn: string }[] = [];
  for (const id of guide.related) {
    const blog = RELATED_BLOG[id];
    if (blog) {
      rows.push(blog);
      continue;
    }
    const g = getVisaGuide(id);
    if (g) rows.push({ href: `/vize-rehberi/${g.slug}`, titleTr: g.titleTr, titleEn: g.titleEn });
  }
  return rows;
}

export const GUIDE_CTA = {
  titleTr: "Başvurunuzu Ranz Global ile hazırlayın",
  titleEn: "Prepare your application with Ranz Global",
  leadTr:
    "Her vize başvurusu kişiye özeldir. Mesleğiniz, gelir durumunuz, seyahat geçmişiniz ve seyahat amacınız hazırlanması gereken dosyayı değiştirebilir.",
  leadEn:
    "Every visa application is personal. Your work, income, travel history and purpose change the file that should be prepared.",
  pointsTr: [
    "Başvuru profiliniz değerlendirilir",
    "Kişiye özel evrak listeniz oluşturulur",
    "Başvuru formlarınızın hazırlanmasında destek sağlanır",
    "Belgeleriniz uzman danışman tarafından kontrol edilir",
    "Eksik veya revize edilmesi gereken belgeler belirlenir",
    "Gerekli dilekçelerin hazırlanmasında destek sağlanır",
    "Dosyanız başvuru öncesinde son kez kontrol edilir",
    "Sürecinizi Ranz Global panelinizden takip edebilirsiniz",
  ],
  pointsEn: [
    "Your profile is reviewed",
    "A personal document list is built",
    "Support is given on application forms",
    "An advisor checks your papers",
    "Missing or revised items are marked",
    "Support is given on letters where needed",
    "The file is checked again before you apply",
    "You can follow the process in your Ranz Global portal",
  ],
  buttonTr: "Başvurunuzu Başlat",
  buttonEn: "Start Your Application",
};
