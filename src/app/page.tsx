"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WhatsAppFloat } from "@/components/whatsapp-button";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { VisaQuiz } from "@/components/visa-quiz";
import { DocsFinder } from "@/components/docs-finder";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CountryFlag } from "@/components/country-flag";
import { CmsImg, useHome } from "@/lib/use-site";
import {
  FEE_DISCLAIMER_EN,
  FEE_DISCLAIMER_TR,
  PRICED_SLUGS,
  PROCESS_STEPS,
  WHY_POINTS,
  serviceBySlug,
} from "@/lib/services";

export default function HomePage() {
  const { locale } = useLocale();
  const home = useHome();
  const leads = t(locale, home.heroLeadTr, home.heroLeadEn).split("\n\n");
  const priced = PRICED_SLUGS.map((slug) => serviceBySlug(slug)!).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/40" />
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:pt-20">
            <div className="mb-6 h-px w-16 bg-gold" />
            <h1 className="max-w-4xl font-serif text-4xl leading-[1.08] tracking-tight text-ink md:text-6xl">
              {t(locale, home.heroTitleTr, home.heroTitleEn)}
            </h1>
            {leads.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">
                {p}
              </p>
            ))}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="#on-degerlendirme" className="btn btn-lg">
                {t(locale, home.ctaPrimaryTr, home.ctaPrimaryEn)}
              </Link>
              <Link href="/giris" className="btn btn-lg btn-line">
                {t(locale, home.ctaSecondaryTr, home.ctaSecondaryEn)}
              </Link>
            </div>
          </div>
        </section>

        <section id="ulkeler" className="scroll-mt-24 border-t border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl md:text-4xl">{t(locale, home.destTitleTr, home.destTitleEn)}</h2>
            {home.heroImageId ? (
              <CmsImg id={home.heroImageId} alt="" className="mt-8 h-40 w-full rounded-xl object-cover" />
            ) : null}
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {home.destCards.map((card) => {
                const href = serviceBySlug(card.id) ? `/hizmet/${card.id}` : "/hizmetler";
                return (
                  <Link key={card.id} href={href} className="rounded-2xl border border-line bg-cream p-5 transition hover:border-gold">
                    <span className="flex items-center gap-2">
                      {serviceBySlug(card.id) ? (
                        <CountryFlag code={serviceBySlug(card.id)!.flag} title={t(locale, card.titleTr, card.titleEn)} />
                      ) : null}
                      <h3 className="font-serif text-xl">{t(locale, card.titleTr, card.titleEn)}</h3>
                    </span>
                    <p className="mt-1 text-xs text-muted">{t(locale, card.hintTr, card.hintEn)}</p>
                  </Link>
                );
              })}
            </div>
            <p className="mt-5 text-xs leading-5 text-muted">{t(locale, home.destNoteTr, home.destNoteEn)}</p>
          </div>
        </section>

        {home.galleryIds.length > 0 && (
          <section className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:grid-cols-3">
            {home.galleryIds.map((id) => (
              <CmsImg key={id} id={id} alt="" className="h-48 w-full rounded-2xl object-cover" />
            ))}
          </section>
        )}

        <VisaQuiz />

        <section id="surec" className="mx-auto max-w-6xl px-5 py-16">
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
        </section>

        <section id="surec-detay" className="border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl md:text-4xl">
              {t(locale, "Ranz Global ile vize süreciniz", "Your visa process with Ranz Global")}
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

        <DocsFinder />

        <section id="ucret" className="scroll-mt-24 border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Danışmanlık ücretleri", "Consultancy fees")}</h2>
            <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-cream">
              {priced.map((s) => (
                <Link key={s.slug} href={`/hizmet/${s.slug}`} className="flex items-center justify-between px-5 py-4 hover:bg-paper">
                  <span className="flex items-center gap-2">
                    <CountryFlag code={s.flag} title={t(locale, s.titleTr, s.titleEn)} />
                    {t(locale, s.titleTr.replace(" Vizesi", ""), s.titleEn.replace(" Visa", ""))}
                  </span>
                  <strong>{s.fee}</strong>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm">
              {t(locale, "Diğer ülkeler için:", "For other countries:")}{" "}
              <Link href="#iletisim" className="text-gold-deep">
                {t(locale, "Fiyat al", "Request a fee")}
              </Link>
            </p>
            <p className="mt-4 max-w-2xl text-xs leading-5 text-muted">{t(locale, FEE_DISCLAIMER_TR, FEE_DISCLAIMER_EN)}</p>
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

        <section id="iletisim" className="scroll-mt-24 border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-gold-deep">
                {t(locale, "İletişim", "Contact")}
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                {t(locale, "Vize uzmanına sor", "Ask a visa advisor")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-soft">
                {t(
                  locale,
                  "Ülke ve başvuru yerini seçin; uzmanımız sizi aramadan önce dosyanızı tanısın.",
                  "Choose country and where you will apply so the advisor already knows the case before calling.",
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-6 md:p-8">
              <ContactLeadForm source="/" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat locale={locale} />
    </div>
  );
}
