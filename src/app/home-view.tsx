"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WhatsAppFloat } from "@/components/whatsapp-button";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { VisaQuiz } from "@/components/visa-quiz";
import { DocsFinder } from "@/components/docs-finder";
import { FaqSection } from "@/components/faq-section";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CountryFlag } from "@/components/country-flag";
import { HomeDestGrid } from "@/components/home-dest-grid";
import { CmsImg, useGuides, useHome } from "@/lib/use-site";
import {
  FEE_DISCLAIMER_EN,
  FEE_DISCLAIMER_TR,
  PRICED_SLUGS,
  PROCESS_STEPS,
  WHY_POINTS,
  serviceBySlug,
} from "@/lib/services";
import { DISCLAIMER_EN, DISCLAIMER_TR } from "@/lib/faq";
import { StartApplicationLink } from "@/components/start-application-link";
import { RefusalReviewForm } from "@/components/refusal-review-form";

const PIPELINE_PREVIEW = [
  { tr: "Ödeme alındı", en: "Payment received", state: "done" },
  { tr: "Evrak listesi oluşturuldu", en: "Document list created", state: "done" },
  { tr: "Evraklar yüklendi", en: "Documents uploaded", state: "done" },
  { tr: "Danışman kontrolünde", en: "Advisor review", state: "current" },
  { tr: "Revizyon bekleniyor", en: "Revision needed", state: "todo" },
  { tr: "Başvuruya hazır", en: "Ready to apply", state: "todo" },
];

const REVIEWS = [
  {
    id: "lefkosa-1",
    tr: "Danışman notunu aynı ekrandan okudum. Sürekli “dosyam ne durumda” yazmama gerek kalmadı.",
    en: "I read the advisor note on the same screen. I did not have to keep asking where the file stood.",
    whoTr: "Lefkoşa",
    whoEn: "Nicosia",
  },
  {
    id: "girne-1",
    tr: "Girne’den evrak yükledim; ofise gitmeden liste ve revizyon paneldendi.",
    en: "I uploaded from Kyrenia; the list and revisions were in the portal without visiting an office.",
    whoTr: "Girne",
    whoEn: "Kyrenia",
  },
  {
    id: "magusa-1",
    tr: "Gazimağusa’dan Schengen dosyasında hangi belgenin eksik olduğu işaretli durdu.",
    en: "On a Schengen file from Famagusta, missing documents stayed clearly marked.",
    whoTr: "Gazimağusa",
    whoEn: "Famagusta",
  },
  {
    id: "lefkosa-2",
    tr: "Lefkoşa’dan İngiltere listesi kişiye özel geldi; sponsor maddesi ayrı yazılmıştı.",
    en: "The UK list from Nicosia was personal; the sponsor item was written separately.",
    whoTr: "Lefkoşa",
    whoEn: "Nicosia",
  },
  {
    id: "guzelyurt",
    tr: "Güzelyurt’tan yükledim. WhatsApp’ta kaybolan evrak panelde durduğu için takip kolaydı.",
    en: "I uploaded from Morphou. Papers that used to get lost on WhatsApp stayed in the portal, so tracking was easy.",
    whoTr: "Güzelyurt",
    whoEn: "Morphou",
  },
  {
    id: "iskele",
    tr: "İskele’den başvuru yerinin pasaporta göre değiştiğini baştan anlattılar; tahmin yürütmedim.",
    en: "From Trikomo they explained up front that the filing place follows the passport; I did not have to guess.",
    whoTr: "İskele",
    whoEn: "Trikomo",
  },
  {
    id: "lefke",
    tr: "Lefke’den dijital yürüdü. Eksik ay banka dökümü revizyon olarak net düştü.",
    en: "The file from Lefka ran digitally. A missing bank-statement month came back as a clear revision.",
    whoTr: "Lefke",
    whoEn: "Lefka",
  },
  {
    id: "girne-2",
    tr: "Ücretin danışmanlık olduğunu, konsolosluk harcının ayrı olduğunu Girne görüşmesinde baştan söylediler.",
    en: "In the Kyrenia call they said from the start that consultancy and consulate fees are separate.",
    whoTr: "Girne",
    whoEn: "Kyrenia",
  },
  {
    id: "istanbul",
    tr: "Evrak listesi kişiye özel geldi; eksikler panelde net göründü.",
    en: "The document list was personal; missing items were clear in the portal.",
    whoTr: "İstanbul",
    whoEn: "Istanbul",
  },
  {
    id: "izmir",
    tr: "İzmir’den ABD dosyasında DS-160 ile evrakın aynı hikâyeyi anlatması için not düştüler.",
    en: "On a US file from Izmir they noted that DS-160 and the papers had to tell the same story.",
    whoTr: "İzmir",
    whoEn: "Izmir",
  },
  {
    id: "antalya",
    tr: "Antalya’dan Schengen sigorta ve rezervasyonu listeye işlendi; hangisinin önce gideceği karışmadı.",
    en: "From Antalya, Schengen insurance and bookings were on the list; the order did not get mixed up.",
    whoTr: "Antalya",
    whoEn: "Antalya",
  },
  {
    id: "ankara",
    tr: "Ankara’dan Kanada ziyaretçi listesi panelde açıldı. Onay sözü yoktu; süreç adım adım durdu.",
    en: "A Canada visitor list opened in the portal from Ankara. There was no approval promise; the steps stayed visible.",
    whoTr: "Ankara",
    whoEn: "Ankara",
  },
];

export default function HomePage() {
  const { locale } = useLocale();
  const home = useHome();
  const guides = useGuides().filter((g) => g.status === "published").slice(0, 6);
  const leads = t(locale, home.heroLeadTr, home.heroLeadEn).split("\n\n");
  const priced = PRICED_SLUGS.map((slug) => serviceBySlug(slug)!).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-24 sm:pb-0">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/40" />
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:pt-20">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">
              {t(locale, "Dijital Vize Yönetim Platformu + Uzman Danışmanlık", "Digital Visa Platform + Specialist Consultancy")}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-[1.85rem] leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-6xl">
              {t(locale, home.heroTitleTr, home.heroTitleEn)}
            </h1>
            {leads.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">
                {p}
              </p>
            ))}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <StartApplicationLink className="btn btn-lg">
                {t(locale, home.ctaPrimaryTr, home.ctaPrimaryEn)}
              </StartApplicationLink>
              <Link href="/giris" className="btn btn-lg btn-line">
                {t(locale, home.ctaSecondaryTr, home.ctaSecondaryEn)}
              </Link>
            </div>
          </div>
        </section>

        <section id="ulkeler" className="scroll-mt-24 border-t border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl md:text-4xl">
              {t(locale, home.destTitleTr, home.destTitleEn)}
            </h2>
            {home.heroImageId ? (
              <CmsImg id={home.heroImageId} alt="" className="mt-8 h-40 w-full rounded-xl object-cover" />
            ) : null}
            <HomeDestGrid cards={home.destCards} />
          </div>
        </section>

        <VisaQuiz />

        <section id="surec-detay" className="border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl md:text-4xl">
              {t(locale, "Ranz Global Sizin İçin Ne Yapıyor?", "What Ranz Global Does For You")}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {PROCESS_STEPS.map((step) => (
                <div key={step.n} className="border-b border-line pb-6">
                  <p className="text-xs tracking-[0.2em] text-gold-deep">{step.n}</p>
                  <h3 className="mt-2 font-serif text-2xl">{t(locale, step.titleTr, step.titleEn)}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{t(locale, step.bodyTr, step.bodyEn)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ucret" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Vize Hizmetleri Ve Ücretler", "Visa Services And Fees")}</h2>
          <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper">
            {priced.map((s) => (
              <Link key={s.slug} href={`/hizmet/${s.slug}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 hover:bg-cream sm:px-5">
                <span className="flex min-w-0 items-center gap-2">
                  <CountryFlag code={s.flag} title={t(locale, s.titleTr, s.titleEn)} />
                  <span className="min-w-0 break-words">{t(locale, s.titleTr.replace(" Vizesi", ""), s.titleEn.replace(" Visa", ""))}</span>
                </span>
                <strong className="shrink-0">{s.fee}</strong>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm">
            {t(locale, "Diğer Ülkeler İçin:", "For Other Countries:")}{" "}
            <Link href="#iletisim" className="text-gold-deep">
              {t(locale, "Fiyat Al", "Request A Fee")}
            </Link>
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-muted">{t(locale, FEE_DISCLAIMER_TR, FEE_DISCLAIMER_EN)}</p>
        </section>

        <section id="nasil" className="scroll-mt-24 border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl">{t(locale, home.stepsTitleTr, home.stepsTitleEn)}</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {home.steps.map((step) => (
                <div key={step.id}>
                  <p className="grid h-9 w-9 place-items-center rounded-sm bg-navy font-serif text-sm text-gold">{step.n}</p>
                  <h3 className="mt-4 font-serif text-2xl">{t(locale, step.titleTr, step.titleEn)}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{t(locale, step.bodyTr, step.bodyEn)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="neden" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Neden Ranz Global?", "Why Ranz Global?")}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {WHY_POINTS.map((item) => (
              <div key={item.titleTr}>
                <p className="text-gold-deep">✓</p>
                <h3 className="mt-2 font-serif text-2xl">{t(locale, item.titleTr, item.titleEn)}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{t(locale, item.bodyTr, item.bodyEn)}</p>
              </div>
            ))}
          </div>
        </section>

        <DocsFinder />

        <section id="panel" className="border-y border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">
                {t(locale, "Dosyanızı Panelden Takip Edin", "Track Your File In The Portal")}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink-soft">
                {t(
                  locale,
                  "Türkiye ve KKTC genelinde dijital altyapımız ve uzman danışmanlarımızla hizmet veriyoruz.",
                  "We serve across Türkiye and the TRNC through our digital platform and specialist advisors.",
                )}
              </p>
              <Link href="/giris" className="btn mt-6">
                {t(locale, "Müşteri Paneli", "Client Portal")}
              </Link>
            </div>
            <ol className="rounded-2xl border border-line bg-cream p-6">
              {PIPELINE_PREVIEW.map((row) => (
                <li key={row.tr} className="flex items-center gap-3 py-2 text-sm">
                  <span
                    className={
                      row.state === "done"
                        ? "h-2.5 w-2.5 rounded-full bg-[#2f7d4a]"
                        : row.state === "current"
                          ? "h-2.5 w-2.5 rounded-full bg-[#c4a056]"
                          : "h-2.5 w-2.5 rounded-full bg-line"
                    }
                  />
                  {t(locale, row.tr, row.en)}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="ret" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Vize Reddi Mi Aldınız?", "Was Your Visa Refused?")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "Ret gerekçesini inceler, önceki dosyadaki zayıf noktaları işaretler ve yeniden başvuru için hazırlık yaparız. Onay yine resmi makama aittir.",
              "We read the refusal grounds, mark weak points in the old file and prepare a new one. Approval still belongs to the authority.",
            )}
          </p>
          <RefusalReviewForm source="/" />
        </section>

        <section className="border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Danışan Yorumları", "Client Notes")}</h2>
            <p className="mt-2 text-xs text-muted">
              {t(locale, "Süreç üzerine; vize sonucu vaadi yoktur.", "About the process; not a promise of a visa result.")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((r) => (
                <article key={r.id} className="rounded-2xl border border-line bg-cream p-6">
                  <p className="text-sm leading-7 text-ink-soft">{t(locale, r.tr, r.en)}</p>
                  <p className="mt-4 text-xs text-muted">{t(locale, r.whoTr, r.whoEn)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <FaqSection />

        <section id="rehber" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Ranz Global Vize Rehberi", "Ranz Global Visa Guide")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {guides.map((g) => (
              <Link key={g.slug} href={`/vize-rehberi/${g.slug}`} className="rounded-2xl border border-line bg-paper p-6 hover:border-gold">
                <h3 className="font-serif text-2xl">{t(locale, g.titleTr, g.titleEn)}</h3>
                <p className="mt-2 text-sm text-ink-soft">{t(locale, g.descriptionTr, g.descriptionEn)}</p>
              </Link>
            ))}
          </div>
          <Link href="/vize-rehberi" className="mt-6 inline-block text-sm text-gold-deep">
            {t(locale, "Tüm Rehberi Aç", "Open The Full Guide")}
          </Link>
        </section>

        <section id="iletisim" className="scroll-mt-24 border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">
                {t(locale, home.contactTitleTr, home.contactTitleEn)}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-soft">
                {t(locale, home.contactLeadTr, home.contactLeadEn)}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl border border-line bg-cream p-6 md:p-8">
              <ContactLeadForm source="/" />
            </div>
          </div>
        </section>

        <section id="hakkimizda" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Ranz Global Hakkında", "About Ranz Global")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "Dijital altyapımız sayesinde Türkiye ve KKTC genelinde vize danışmanlığı sağlıyoruz.",
              "We advise across Türkiye and the TRNC through a digital setup.",
            )}{" "}
            <Link href="/blog/vize-danismanligi" className="text-gold-deep">
              {t(locale, "Vize danışmanlığı", "Visa consultancy")}
            </Link>
            {" · "}
            <Link href="/blog/kuzey-kibris-schengen-vize-danismanligi" className="text-gold-deep">
              {t(locale, "Kuzey Kıbrıs Schengen vize danışmanlığı", "Northern Cyprus Schengen visa consultancy")}
            </Link>
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-line bg-paper p-6">
              <p className="font-serif text-2xl">Berat</p>
              <p className="mt-2 text-sm text-ink-soft">{t(locale, "Müşteri İlişkileri", "Client Relations")}</p>
            </article>
            <article className="rounded-2xl border border-line bg-paper p-6">
              <p className="font-serif text-2xl">{t(locale, "Uzman Kadro", "Specialist Desk")}</p>
              <p className="mt-2 text-sm text-ink-soft">{t(locale, "İngiltere & Kanada Vize Uzmanı", "UK & Canada Visa Specialist")}</p>
            </article>
            <article className="rounded-2xl border border-line bg-paper p-6">
              <p className="font-serif text-2xl">{t(locale, "Uzman Kadro", "Specialist Desk")}</p>
              <p className="mt-2 text-sm text-ink-soft">{t(locale, "Schengen Vize Uzmanı", "Schengen Visa Specialist")}</p>
            </article>
          </div>
          <Link href="/hakkimizda" className="mt-6 inline-block text-sm text-gold-deep">
            {t(locale, "Hakkımızda Sayfası", "About Page")}
          </Link>
          <p className="mt-8 max-w-2xl text-xs leading-5 text-muted">{t(locale, DISCLAIMER_TR, DISCLAIMER_EN)}</p>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat locale={locale} />
    </div>
  );
}
