import { generateText, Output } from "ai";
import { z } from "zod";
import { ensureMetaDescription } from "./seo-meta";
import { type BlogArticle, isUsableArticle } from "./blog-article";

export const GEMINI_BLOG_MODEL = "google/gemini-3-flash";

const schema = z.object({
  titleTr: z.string(),
  titleEn: z.string(),
  excerptTr: z.string(),
  excerptEn: z.string(),
  bodyTr: z.string(),
  bodyEn: z.string(),
});

function polish(article: BlogArticle): BlogArticle {
  return {
    titleTr: article.titleTr.trim().slice(0, 90),
    titleEn: article.titleEn.trim().slice(0, 90),
    excerptTr: ensureMetaDescription(article.excerptTr),
    excerptEn: ensureMetaDescription(article.excerptEn),
    bodyTr: article.bodyTr.trim(),
    bodyEn: article.bodyEn.trim(),
  };
}

function authorPrompt(topic: string, locale: string) {
  return `Ranz Global için gerçek bir blog yazısı yaz. Şablon doldurma. Konu neyse yazı onun hakkında olsun.

Konu: ${topic}
Panel dili: ${locale}

Kurallar:
- Konu “sonbaharda gezilecek Avrupa rotası” ise şehir, ay, hava, tren, tempo, bütçe, kalabalık yaz. “Bu başlık etrafında vize dosyası kurarız” diye kaçma.
- Konu vize/evrak ise o ülkenin sürecini anlat; yine kişiye özel, somut.
- Her dilde 900–1400 kelime. Markdown: tek # başlık, sonra ## alt başlıklar, paragraflar.
- Somut ol: yer adı, ay, süre, pratik uyarı. Uydurma istatistik ve sahte alıntı yok.
- Vize onayı, ret kalkması veya kesin randevu sözü yok. Karar konsolosluk / yetkili makama aittir.
- Ranz Global en fazla kapanışta kısa geçer (Türkiye ve KKTC’den dosya hazırlığı). Yazının gövdesi danışmanlık reklamı olmasın.
- title/excerpt/body hem Türkçe hem İngilizce, eşit kalitede. Excerpt 1–2 cümle, 70–155 karakter.`;
}

function parseJsonArticle(text: string): BlogArticle | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced?.[1] || text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = schema.parse(JSON.parse(raw.slice(start, end + 1)));
    return polish(parsed);
  } catch {
    return null;
  }
}

async function geminiArticle(topic: string, locale: string): Promise<{ article: BlogArticle | null; error?: string }> {
  const prompt = authorPrompt(topic, locale);
  try {
    const structured = await generateText({
      model: GEMINI_BLOG_MODEL,
      output: Output.object({ schema }),
      prompt,
    });
    if (structured.output) {
      const article = polish(structured.output);
      if (isUsableArticle(article)) return { article };
    }
  } catch (error) {
    console.error("blog_gemini_structured_failed", (error as Error).message);
  }

  try {
    const loose = await generateText({
      model: GEMINI_BLOG_MODEL,
      prompt: `${prompt}

Yalnızca JSON döndür, anahtarlar: titleTr, titleEn, excerptTr, excerptEn, bodyTr, bodyEn.`,
    });
    const article = parseJsonArticle(loose.text);
    if (article && isUsableArticle(article)) return { article };
    return { article: null, error: "Gemini JSON beklenen yazı şemasına uymadı." };
  } catch (error) {
    const message = (error as Error).message || "Gemini yanıt vermedi.";
    console.error("blog_gemini_failed", message);
    return { article: null, error: message.slice(0, 280) };
  }
}

function fallbackArticle(topic: string): BlogArticle {
  const title = topic.replace(/\s+/g, " ").trim();
  const travelEurope = /avrupa|europe|schengen|sonbahar|autumn|rota|route|gezi|seyahat|travel|prag|viyana|paris|italya/i.test(title);

  const bodyTr = travelEurope
    ? [
        `# ${title}`,
        ``,
        `${title} başlığı çoğu kişiye hazır bir paket gibi gelir; oysa iyi bir yazı, gidilecek yerin ritmini, mevsimini ve sizin takviminizi aynı masaya koyar. Aşağıdaki metin Ranz Global’in vize şablonu değil; bu konunun kendisine yazılmış bir güzergâh ve hazırlık yazısıdır.`,
        ``,
        `## Bu rota kime göre`,
        `İlk kez Avrupa’ya çıkacaklar ile ikinci kez gidenler aynı hızı istemez. İlk seyahatte üç başkent üst üste yormaz; ikinci seyahatte bir bölgede yavaşlamak daha çok şey bırakır. Konu sonbahar ise Eylül sonu–Kasım başını düşünün: bağ bozumu, daha kısa gün, daha yumuşak fiyat, yaz kuyruğunun dağılması.`,
        `Yanınıza alan kişi, bütçe ve izin günü sayısını baştan sabitleyin. 8 gün ile 14 gün aynı rota değildir. Sekiz günde Viyana–Prag–Budapeşte yürür; on dört günde araya Münih veya Kuzey İtalya girebilir. Daha kısa izin varsa iki durak seçin, üçüncüyü “olursa” diye eklemeyin.`,
        ``,
        `## Somut bir sonbahar hattı`,
        `Klasik ve işe yarayan çizgi: Viyana ile başlayıp Prag’a geçmek, ardından Budapeşte’de bitirmek. Trenler kısa, şehirler yürünebilir, sonbaharda kahverengi parklar ve erken akşam ışığı kalır. Viyana’da bir tam gün müze ve kahvehane, bir tam gün çevre (Klosterneuburg veya Wachau, hava izin verirse) yeter.`,
        `Prag’da Charles Köprüsü’nü şafakta görün; öğleden sonra kalabalık başkadır. Budapeşte’de Tuna’nın iki yakasını ayrı günlere yayın. Termal bir akşam, müze bir sabah. Bu üçlü Schengen içinde kaldığı için ülke değiştirmek vize türünü değiştirmez; konaklama ve bilet tarihleri yine pasaport hikâyesiyle çelişmesin.`,
        `Deniz ve bağ isterseniz hattı kaydırın: Münih – Innsbruck – Verona – Floransa. Ekim’de Alp geçitleri erken kar yapabilir; tren veya kısa uçuş otobüsten az sürprizlidir. Akdeniz’e inmek isterseniz Barselona–Valensiya veya Lizbon–Porto sonbaharda yürünebilir, yazdan serin olur.`,
        ``,
        `## Tempo, bavul ve para`,
        `Her şehirde en az bir boş yarım gün bırakın. Sonbahar yağmuru müze gününe çevrilir. Ayakkabı su geçirmez olsun, katmanlı giyinin.`,
        `Konaklamada gürültülü cadde yerine ara sokak, sabah pazarını yürüyerek çözer. “Ucuz Avrupa” masalıyla bütçe kurmayın: müze, tren ve kahve toplanır. Kart ekstresi ile nakit aynı hikâyeyi anlatsın; vize dosyasında da bu okunur.`,
        ``,
        `## Ulaşım`,
        `Gece otobüsü tasarruf eder, ertesi günü yer. Gündüz treni istasyon ve manzara verir. Aynı gün check-out, uzun transfer ve akşam rezervasyonu sıkışır. Biletleri isimle alın.`,
        ``,
        `## Sık yapılan hatalar`,
        `Beş ülkeyi on günde bitirmek kuyruk ve yorgunluk bırakır. Sadece fotoğraf durakları mahalle kahvaltısını kaçırır. “Vize çıkar” diye uçak+otel almak, ret veya ek evrakta parayı yakar. Resmi karar gelmeden iade kuralını okuyun.`,
        ``,
        `## Vize notu (Türkiye ve KKTC)`,
        `Bu rotanın çoğu durağında kısa konaklama Schengen turistik/ticari çerçeveye girer. Pasaport süresi, seyahat sağlık sigortası, tutarlı güzergâh, konaklama ve gelir/hesap dökümü birlikte okunur. İngiltere veya Schengen dışı ek durak ayrı kuraldır.`,
        `Ranz Global vize onayı vermez, mülakata sizin yerinize girmez. İşimiz evrakı ve hikâyeyi çelişkisiz tutmaktır. Karar konsolosluk veya yetkili merkeze aittir.`,
        ``,
        `## Bitirmeden`,
        `${title} ancak izin gününüze ve bütçenize oturursa gerçek seyahat olur. Rota taslağını kaydedin, tarihleri netleştirin, sonra evrak listesine bakın. Dosya panelden açılır; sorular WhatsApp veya iletişim formundan gider, sonuç sözü olmadan.`,
      ].join("\n")
    : [
        `# ${title}`,
        ``,
        `${title} üzerine yazarken konuyu slogan gibi tekrarlamak yetmez. Okuyan kişi somut adım, sıra ve uyarı ister. Bu metin başlığı vize kalıbına yapıştırmadan açar.`,
        ``,
        `## Konunun çerçevesi`,
        `${title} kimin için geçerli, hangi sürede, hangi belgeler veya duraklarla ilerler — bunları baştan yazın. Genel “herkese aynı paket” hem okuyucuyu hem dosyayı zayıflatır.`,
        `Türkiye ve KKTC’den bakınca resmi süreç, rezervasyon ve mali tablo çoğu dosyada yan yana durur. Çelişen tarihler, eksik ay dökümü veya amaç ile biletin uyuşmaması sık revizyon üretir.`,
        ``,
        `## Adım adım`,
        `Konuyu tek cümleyle sabitleyin: nereye, ne kadar, kiminle. Takvim ve bütçeyi yazın; evrak veya güzergâh listesini ona bağlayın. Yüklenen PDF’ler formdaki cevaplarla aynı hikâyeyi anlatsın. Danışman notunu okumadan randevu sistemine girmeyin.`,
        `Hazır internet listesini olduğu gibi kopyalamak mesleğinizi veya sponsorunuzu yok sayar. Onay çıkar diye uçak kesmek, resmi karar gelmeden riski size bırakır.`,
        ``,
        `## Dikkat edilecekler`,
        `Kimlik, amaç ve para birbirini tutmalıdır. Sponsor varsa kendi bağlarınız durur; sponsor sizin yerinize başvuran olmaz. Çeviri, kurye ve başvuru merkezi ücretleri danışmanlıktan ayrıdır.`,
        ``,
        `## Resmi karar`,
        `Vize, ret veya ek evrak kararı konsolosluk ya da yetkili merkeze aittir. Ranz Global sonuç garantisi vermez, mülakata sizin yerinize girmez. İşimiz dosyayı okunur ve tutarlı tutmaktır.`,
        ``,
        `## Sonraki adım`,
        `${title} için somut listenizi kaydedin. Panelden dosya açılabilir; sorular iletişim formu veya WhatsApp ile gider.`,
      ].join("\n");

  const bodyEn = travelEurope
    ? [
        `# ${title}`,
        ``,
        `A heading such as “${title}” looks like a package. A useful article puts place, season and your calendar on the same table. This is not a visa template with the title pasted in.`,
        ``,
        `## Who this pace is for`,
        `First-time visitors and return travellers do not want the same speed. Three capitals in a row exhaust a first trip; a second trip often wants one region, slower. For autumn, think late September to early November: harvest, shorter days, softer prices, thinner summer queues.`,
        `Fix companions, budget and leave days first. Eight days is not fourteen. Eight days will carry Vienna–Prague–Budapest. Fourteen can add Munich or northern Italy. With a short leave, pick two stops.`,
        ``,
        `## A concrete autumn line`,
        `Start in Vienna, continue to Prague, finish in Budapest. Trains are short, centres are walkable, and autumn parks hold the light. Give Vienna a museum-and-café day and, weather allowing, a day toward Klosterneuburg or the Wachau.`,
        `In Prague, see Charles Bridge at dawn. In Budapest, split Buda and Pest across days. One evening in the baths, one morning in a museum. These cities sit inside Schengen, so changing country does not change the visa class — hotel and ticket dates still have to match the file.`,
        `For mountains and vines: Munich – Innsbruck – Verona – Florence. Alpine passes can see early snow in October. For a milder sea, Barcelona–Valencia or Lisbon–Porto stay walkable and cooler than summer.`,
        ``,
        `## Pace, bag and money`,
        `Leave a free half-day in every city. Autumn rain becomes a museum day. Waterproof shoes, layers, a real umbrella.`,
        `Sleep on a side street near the centre. Museums, regional trains and coffee add up. Card statements and cash should tell one story — officers read that too.`,
        ``,
        `## Getting between cities`,
        `Overnight coaches save money and spend the next day. Day trains give stations and a view. Checkout, a long transfer and dinner on the same afternoon will snarl. Buy named tickets.`,
        ``,
        `## Common mistakes`,
        `Five countries in ten days leave queues and fatigue. Listing only photo spots skips neighbourhood breakfasts. Buying flights because a visa “will come” burns money after a refusal. Read refund rules before the authority has decided.`,
        ``,
        `## Visa note (Türkiye and TRNC)`,
        `Most of this circuit is short-stay Schengen. Passport validity, travel insurance, a coherent itinerary, lodging and income or bank evidence are read together. A UK or other non-Schengen add-on is a separate rule set.`,
        `Ranz Global does not grant visas and does not sit your interview. We keep papers and story aligned. The decision belongs to the consulate or competent authority.`,
        ``,
        `## Before you go`,
        `${title} becomes a trip only when it fits your leave and budget. Save the draft route, lock dates, then open the document list. Files start in the client portal. Questions can go through WhatsApp or the contact form, without a promised outcome.`,
      ].join("\n")
    : [
        `# ${title}`,
        ``,
        `Repeating “${title}” as a slogan is not an article. Readers want steps, order and warnings. This piece opens the topic instead of pasting it onto a visa template.`,
        ``,
        `## Frame`,
        `Who is this for, over what period, with which papers or stops? Write that first. A one-size pack weakens both the reader and the file.`,
        `From Türkiye and the TRNC, official process, bookings and finances usually sit together. Clashing dates, missing bank months or a purpose that does not match tickets trigger revisions.`,
        ``,
        `## Steps`,
        `One sentence: where, how long, with whom. Then calendar and budget, then the document or route list. PDFs must match form answers. Do not enter appointment systems before advisor notes.`,
        `Copying a generic internet checklist ignores your job or sponsor. Buying flights because “the visa will come” leaves the risk with you.`,
        ``,
        `## Watch-outs`,
        `Identity, purpose and money have to agree. A sponsor supports the file; they do not become the applicant. Translation, courier and visa-centre fees sit outside consultancy.`,
        ``,
        `## Official decision`,
        `Visa, refusal or extra documents belong to the consulate or competent authority. Ranz Global does not guarantee outcomes and does not sit your interview. Our work is a readable, consistent file.`,
        ``,
        `## Next`,
        `Save a concrete list for ${title}. Open a file in the portal; questions go through the contact form or WhatsApp.`,
      ].join("\n");

  return polish({
    titleTr: title,
    titleEn: title,
    excerptTr: travelEurope
      ? `${title}: mevsim, tempo ve şehir sırası. Vize kararı resmi makamlara aittir.`
      : `${title} için somut sıra ve uyarılar. Vize kararı resmi makamlara aittir.`,
    excerptEn: travelEurope
      ? `${title}: season, pace and city order. Visa decisions belong to official authorities.`
      : `${title}: practical steps and warnings. Visa decisions belong to official authorities.`,
    bodyTr,
    bodyEn,
  });
}

export async function writeBlogArticle(
  topic: string,
  locale: string,
): Promise<{ article: BlogArticle; source: "gemini" | "fallback"; warning?: string; model: string }> {
  const clean = topic.replace(/\s+/g, " ").trim();
  if (!clean) throw new Error("Konu gerekli.");
  const gemini = await geminiArticle(clean, locale);
  if (gemini.article) return { article: gemini.article, source: "gemini", model: GEMINI_BLOG_MODEL };
  return {
    article: fallbackArticle(clean),
    source: "fallback",
    model: GEMINI_BLOG_MODEL,
    warning: gemini.error || "Gemini yazmadı. Vercel AI Gateway’i açın veya AI_GATEWAY_API_KEY ekleyin.",
  };
}
