"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WhatsAppFloat } from "@/components/whatsapp-button";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CmsImg, useHome } from "@/lib/use-site";

export default function HomePage() {
  const { locale } = useLocale();
  const home = useHome();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 md:grid-cols-[1.15fr_0.85fr] md:items-end md:pt-16">
          <div>
            <h1 className="max-w-xl font-serif text-5xl leading-[1.05] text-ink md:text-7xl">
              {t(locale, home.heroTitleTr, home.heroTitleEn)}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-ink-soft">
              {t(locale, home.heroLeadTr, home.heroLeadEn)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-cream"
              >
                {t(locale, home.ctaPrimaryTr, home.ctaPrimaryEn)}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#surec"
                className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 text-sm text-ink"
              >
                {t(locale, home.ctaSecondaryTr, home.ctaSecondaryEn)}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_20px_60px_-40px_rgba(12,26,42,0.45)]">
            {home.heroImageId ? (
              <CmsImg id={home.heroImageId} alt="" className="mb-5 h-40 w-full rounded-xl object-cover" />
            ) : null}
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {t(locale, home.destTitleTr, home.destTitleEn)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {home.destCards.map((card) => (
                <Link
                  key={card.id}
                  href="/giris"
                  className="rounded-xl border border-line p-3 transition hover:border-gold"
                >
                  <p className="font-medium">{t(locale, card.titleTr, card.titleEn)}</p>
                  <p className="mt-0.5 text-xs text-muted">{t(locale, card.hintTr, card.hintEn)}</p>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-muted">{t(locale, home.destNoteTr, home.destNoteEn)}</p>
          </div>
        </section>

        {home.galleryIds.length > 0 && (
          <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-8 sm:grid-cols-3">
            {home.galleryIds.map((id) => (
              <CmsImg key={id} id={id} alt="" className="h-48 w-full rounded-2xl object-cover" />
            ))}
          </section>
        )}

        <section id="surec" className="border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl">{t(locale, home.stepsTitleTr, home.stepsTitleEn)}</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {home.steps.map((step) => (
                <div key={step.id}>
                  <p className="text-xs tracking-[0.3em] text-gold-deep">{step.n}</p>
                  <h3 className="mt-3 font-serif text-2xl">{t(locale, step.titleTr, step.titleEn)}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{t(locale, step.bodyTr, step.bodyEn)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="vize" className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
            {t(locale, home.visaEyebrowTr, home.visaEyebrowEn)}
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl md:text-4xl">
            {t(locale, home.visaTitleTr, home.visaTitleEn)}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(locale, home.visaLeadTr, home.visaLeadEn)}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {home.visaCards.map((card) => (
              <article key={card.id} className="rounded-2xl border border-line bg-paper p-7">
                <h3 className="font-serif text-2xl">{t(locale, card.titleTr, card.titleEn)}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{t(locale, card.hintTr, card.hintEn)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="iletisim" className="border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-gold-deep">
                {t(locale, home.contactEyebrowTr, home.contactEyebrowEn)}
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                {t(locale, home.contactTitleTr, home.contactTitleEn)}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-soft">
                {t(locale, home.contactLeadTr, home.contactLeadEn)}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-6 md:p-8">
              <ContactLeadForm source="/" />
            </div>
          </div>
        </section>

        <section id="guven" className="mx-auto max-w-6xl px-5 py-20">
          <div className="rounded-2xl border border-line bg-paper px-6 py-10 md:px-10">
            <h2 className="max-w-3xl font-serif text-3xl leading-snug">
              {t(locale, home.trustTitleTr, home.trustTitleEn)}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft">
              {t(locale, home.trustBodyTr, home.trustBodyEn)}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat locale={locale} />
    </div>
  );
}
