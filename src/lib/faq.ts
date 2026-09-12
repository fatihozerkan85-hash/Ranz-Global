export type FaqExtra = { uk?: string; usa?: string; schengen?: string };

export type FaqItem = {
  qTr: string;
  qEn: string;
  aTr: string;
  aEn: string;
  extra?: { ukTr?: string; ukEn?: string; usaTr?: string; usaEn?: string; schengenTr?: string; schengenEn?: string };
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    qTr: "Vizeyi kesin alabilir miyim?",
    qEn: "Can you guarantee I will get the visa?",
    aTr: "Hayır. Vize kararı ilgili konsolosluk veya yetkili makam tarafından verilir. Ranz Global herhangi bir vize onay garantisi vermez. İşimiz, dosyanızı tutarlı ve eksiksiz hazırlamaktır.",
    aEn: "No. The decision belongs to the consulate or competent authority. Ranz Global does not guarantee a visa. We prepare a consistent, complete file.",
  },
  {
    qTr: "Ranz Global benim yerime başvuru yapıyor mu?",
    qEn: "Does Ranz Global apply instead of me?",
    aTr: "Hayır. Başvuru sahibi sizsiniz. Formların hazırlanması, evrak kontrolü ve dosya düzeninde destek veririz. İmza, biyometri ve resmi sistemdeki gönderim size aittir.",
    aEn: "No. You remain the applicant. We help with forms, document review and file order. Signature, biometrics and official submission stay yours.",
    extra: {
      ukTr: "İngiltere’de başvuru UKVI sisteminde sizin hesabınız üzerinden yürür; biz özet ve evrak bütünlüğünü hazırlarız.",
      ukEn: "For the UK, the application runs in your UKVI account; we prepare the summary and document set.",
      usaTr: "ABD’de DS-160 ve randevu resmi sistemlerdedir; biz bilgilerin tutarlı olmasını hedefleriz.",
      usaEn: "For the US, DS-160 and appointments sit on official systems; we keep the information consistent.",
      schengenTr: "Schengen’de başvuru genelde VFS veya konsolosluk kanalındadır. AB’nin resmi bilgilendirmesine göre aracı kullanmak vize alma şansını artırmaz; biz dosya kalitesine odaklanırız.",
      schengenEn: "Schengen filings usually go through a VAC or consulate. EU guidance states using an intermediary does not increase the chance of a visa; we focus on file quality.",
    },
  },
  {
    qTr: "Hangi evrakları hazırlamam gerekiyor?",
    qEn: "Which documents do I need?",
    aTr: "Liste ülkeye, seyahat amacına ve çalışma durumunuza göre değişir. Sitedeki evrak bölümünden profilinizi seçin; danışman panelde size özel listeyi netleştirir.",
    aEn: "The list depends on country, purpose and your work situation. Use the document section on this site; an advisor then confirms your personal list in the portal.",
  },
  {
    qTr: "Banka hesabımda ne kadar para bulunmalı?",
    qEn: "How much money should be in my bank account?",
    aTr: "Tek bir sihirli tutar yoktur. Makamlar bakiyenin seyahat planı, gelir ve bağlarınızla tutarlı olup olmadığına bakar. Eksik ay, ani yüklü para veya belgesiz kaynak sık sorundur.",
    aEn: "There is no magic figure. Authorities look at whether the balance matches your trip, income and ties. Missing months, sudden large deposits or unexplained funds are common issues.",
    extra: {
      ukTr: "İngiltere ziyaretçi dosyasında genelde birkaç aylık döküm ve paranın kaynağı birlikte okunur.",
      ukEn: "UK visitor files usually read several months of statements together with the source of funds.",
      schengenTr: "Schengen’de günlük harcama varsayımı ülkeye göre değişir; rezervasyon ve sigorta ile birlikte değerlendirilir.",
      schengenEn: "Schengen daily-cost assumptions vary by country and are read with bookings and insurance.",
    },
  },
  {
    qTr: "Daha önce ret aldım, yeniden başvurabilir miyim?",
    qEn: "I was refused before. Can I apply again?",
    aTr: "Çoğu ülkede yeniden başvuru mümkündür. Önceki ret gerekçesi dosyada durur; aynı zayıf noktayı tekrar etmek risklidir. Ret yazınızı inceleyip yeni dosyayı ona göre kurarız. Onay yine garanti değildir.",
    aEn: "A new application is usually possible. The previous refusal stays on record; repeating the same weakness is risky. We review the refusal letter and build the new file around it. Approval is still not guaranteed.",
  },
  {
    qTr: "Çalışmıyorum, vize alabilir miyim?",
    qEn: "I am not working. Can I still get a visa?",
    aTr: "Çalışmamak tek başına ret nedeni olmak zorunda değildir. Gelir kaynağı, sponsor, bağlar ve dönüş planı net olmalıdır. Profilinize göre liste kurulur; sonuç yine resmi makama aittir.",
    aEn: "Not working is not automatically a refusal. Source of funds, a sponsor, ties and return plans must be clear. We set the list to your profile; the decision remains official.",
  },
  {
    qTr: "Sponsorla başvurabilir miyim?",
    qEn: "Can I apply with a sponsor?",
    aTr: "Evet, birçok ziyaretçi dosyasında sponsor mümkündür. Sponsorun kimliği, gelir/mali belgesi ve sizinle ilişkisi dosyada açık durmalıdır. Sizin bağlarınız da ayrıca gösterilir.",
    aEn: "Yes, many visitor files allow a sponsor. Their identity, finances and relationship to you must be clear, alongside your own ties.",
  },
  {
    qTr: "Randevuyu siz mi alıyorsunuz?",
    qEn: "Do you book the appointment?",
    aTr: "Randevu resmi sistemdedir. Uygun olan başvurularda ne zaman ve nasıl alınacağı konusunda yönlendiririz; kontenjan ve sistem bize ait değildir.",
    aEn: "Appointments sit on official systems. Where relevant we guide how and when to book; slots and the system are not ours.",
  },
  {
    qTr: "Vize kaç günde çıkar?",
    qEn: "How many days does a visa take?",
    aTr: "Süre ülkeye, mevsim ve eksik evraka göre değişir. Resmi işlem süresi konsolosluk / başvuru merkezine aittir. Biz dosyanızı teslime hazır hale getirmenin süresini yönetiriz.",
    aEn: "Times vary by country, season and missing papers. Official processing belongs to the consulate or VAC. We manage the time it takes to make the file ready to submit.",
  },
  {
    qTr: "Konsolosluk ücretleri danışmanlık ücretine dahil mi?",
    qEn: "Are consulate fees included in the consultancy fee?",
    aTr: "Hayır. Danışmanlık ücreti Ranz Global hizmetinedir. Konsolosluk, VFS/VAC, biyometri, kurye ve çeviri ayrıdır. Başvuru öncesi bunları açık yazarız.",
    aEn: "No. The consultancy fee is for Ranz Global’s work. Consulate, VAC, biometrics, courier and translation are separate. We list them before you apply.",
  },
  {
    qTr: "Vizem reddedilirse ne olur?",
    qEn: "What if my visa is refused?",
    aTr: "Karar resmi yazı ile size aittir. İsterseniz ret gerekçesini birlikte okuruz; yeni bir dosya hazırlığı ayrı bir hizmet olarak açılabilir. Vize onayı ve resmi harçların iadesi Ranz Global’in elinde değildir.",
    aEn: "The written decision is yours. If you wish, we read the refusal grounds together; a new file can be opened as a separate service. Visa approval and official fee refunds are not in our hands.",
  },
  {
    qTr: "KKTC’de yaşayanlar hangi ülkelere başvurabilir?",
    qEn: "Which countries can TRNC residents apply for?",
    aTr: "KKTC’de yaşayan başvurular, vatandaşlık ve ikamet belgelerine göre yürür. İngiltere, ABD, Kanada ve Schengen için başvuru yeri ve merkez ülkeye göre değişir. Ön değerlendirmede bunu netleştiririz; her ülke her ikamet durumunu aynı kabul etmez.",
    aEn: "Applications from the TRNC follow citizenship and residence papers. For the UK, US, Canada and Schengen, the filing location depends on the destination. We clarify this in the preliminary assessment; not every country treats every residence status the same.",
  },
];

export const DISCLAIMER_TR =
  "Ranz Global, konsolosluklar ve resmi vize başvuru merkezlerinden bağımsız özel bir danışmanlık şirketidir. Nihai vize kararı ilgili ülkenin yetkili makamlarına aittir. Ranz Global vize onayı garantisi vermez.";

export const DISCLAIMER_EN =
  "Ranz Global is a private consultancy, independent of consulates and official visa application centres. The final visa decision belongs to the competent authorities of the destination country. Ranz Global does not guarantee visa approval.";

export const UPLOAD_NOTICE_TR =
  "Belgeleriniz vize danışmanlık sürecini yürütmek için işlenir. Dosya HTTPS ile Vercel Blob deposuna (özel erişim) yüklenir; panelde ad, durum ve dosya yolu tarayıcı deposunda kalır. Giriş çerezi olmadığı için indirme adresi rastgele sonek ile korunur; şifreleme iddiası kullanmıyoruz.";

export const UPLOAD_NOTICE_EN =
  "Your documents are processed to run the visa consultancy. Files are uploaded over HTTPS to a private Vercel Blob store; the portal keeps the name, status and file path in browser storage. There is no login cookie, so downloads rely on a random filename suffix. We do not claim encryption.";
