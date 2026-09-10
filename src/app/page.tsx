"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WhatsAppFloat } from "@/components/whatsapp-button";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function HomePage() {
  const { locale } = useLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 md:grid-cols-[1.15fr_0.85fr] md:items-end md:pt-16">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <Image src="/logo.jpg" alt="Ranz Global" width={72} height={72} className="h-[72px] w-[72px] rounded-md object-cover shadow-[0_12px_30px_-12px_rgba(12,26,42,0.55)]" priority />
              <div>
                <p className="font-serif text-xl tracking-[0.14em] text-ink">RANZ GLOBAL</p>
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold-deep">Travel & Visa</p>
              </div>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-gold-deep">
              {t(locale, "Vize danışmanlığı", "Visa consultancy")}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.08] text-ink md:text-6xl">
              {t(
                locale,
                "Vize süreci hiç bu kadar konforlu ve kolay olmamıştı",
                "The visa process has never been this comfortable and easy",
              )}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-ink-soft">
              {t(
                locale,
                "Tüm vize başvurularınız için gerekli olan evrakları tek panelden yükleyin ve süreci takip edin.",
                "Upload the documents required for all your visa applications from a single portal and track the process.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-cream"
              >
                {t(locale, "Dosyama gir", "Open my file")}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#surec"
                className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 text-sm text-ink"
              >
                {t(locale, "Nasıl işler", "How it works")}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_20px_60px_-40px_rgba(12,26,42,0.45)]">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {t(locale, "Nereye gidiyorsunuz?", "Where are you going?")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                [t(locale, "Schengen", "Schengen"), t(locale, "Avrupa", "Europe")],
                [t(locale, "ABD", "USA"), t(locale, "B1/B2", "B1/B2")],
                [t(locale, "BAE", "UAE"), t(locale, "Dubai / Abu Dabi", "Dubai / Abu Dhabi")],
                [t(locale, "Çin", "China"), t(locale, "Turistik", "Tourism")],
                [t(locale, "Rusya", "Russia"), t(locale, "Davetiye", "Invitation")],
                [t(locale, "İngiltere", "United Kingdom"), t(locale, "Ziyaretçi", "Visitor")],
                [t(locale, "Kanada", "Canada"), t(locale, "Ziyaretçi", "Visitor")],
              ].map(([title, hint]) => (
                <Link
                  key={title}
                  href="/giris"
                  className="rounded-xl border border-line p-3 transition hover:border-gold"
                >
                  <p className="font-medium">{title}</p>
                  <p className="mt-0.5 text-xs text-muted">{hint}</p>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-muted">
              {t(
                locale,
                "Giriş yaptıktan sonra ülkeyi seçin; evrak listesi o ülkeye göre gelir.",
                "After you sign in, choose the country; the document list follows it.",
              )}
            </p>
          </div>
        </section>

        <section id="surec" className="border-y border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-serif text-3xl">{t(locale, "Üç adım. Fazlası yok.", "Three steps. Nothing extra.")}</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                {
                  n: "01",
                  tr: ["Ülkeyi seçin", "Schengen, ABD, BAE, Çin, Rusya, İngiltere veya Kanada. Evrak listesi o ülkeye göre açılır."],
                  en: ["Choose the country", "Schengen, USA, UAE, China, Russia, UK or Canada. The checklist follows that country."],
                },
                {
                  n: "02",
                  tr: ["Evrakları yükleyin", "Pasaport, rezervasyon, mali belgeler. Eksik olanlar net işaretlenir."],
                  en: ["Upload documents", "Passport, bookings, finances. Missing items are clearly marked."],
                },
                {
                  n: "03",
                  tr: ["Danışman inceler", "Onay, revizyon veya not. Durumu panelden ve bildirimle görürsünüz."],
                  en: ["Advisor reviews", "Approve, revise or comment. You see status in the portal."],
                },
              ].map((step) => (
                <div key={step.n}>
                  <p className="text-xs tracking-[0.3em] text-gold-deep">{step.n}</p>
                  <h3 className="mt-3 font-serif text-2xl">{t(locale, step.tr[0], step.en[0])}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{t(locale, step.tr[1], step.en[1])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="vize" className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
            {t(locale, "Ranz Global", "Ranz Global")}
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl md:text-4xl">
            {t(locale, "Vize danışmanlığı", "Visa consultancy")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "Schengen, ABD, Birleşik Arap Emirlikleri, Çin, Rusya, İngiltere ve Kanada başvurularınızı tek yerden yönetin. Ülkeyi seçin; evrak listesi ona göre açılır.",
              "Manage Schengen, USA, UAE, China, Russia, UK and Canada files in one place. Choose the country; the document list follows it.",
            )}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [t(locale, "Schengen", "Schengen"), t(locale, "Avrupa kısa konaklama evrakları", "European short-stay documents")],
              [t(locale, "ABD", "USA"), t(locale, "DS-160 ve mali belgeler", "DS-160 and financial evidence")],
              [t(locale, "BAE", "UAE"), t(locale, "Pasaport, otel ve iş belgesi", "Passport, hotel and employment")],
              [t(locale, "Çin", "China"), t(locale, "Form, davet ve program", "Form, invitation and itinerary")],
              [t(locale, "Rusya", "Russia"), t(locale, "Davetiye ve sigorta", "Invitation and insurance")],
              [t(locale, "İngiltere & Kanada", "UK & Canada"), t(locale, "Banka, iş ve bağ belgesi", "Bank, work and ties")],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-line bg-paper p-7">
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="iletisim" className="border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-gold-deep">
                {t(locale, "İletişim", "Contact")}
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                {t(locale, "Bize yazın", "Get in touch")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-soft">
                {t(
                  locale,
                  "Yalnızca ad soyad, telefon ve mesajınız. Danışmanımız sizi arar.",
                  "Just your name, phone and message. An advisor will call you.",
                )}
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
              {t(
                locale,
                "Vize formlarını doldurma karmaşasından ve yanlış evrak derleme risklerinden arının. Ranz Global vize başvuru sürecinizin her adımında yanınızda.",
                "Leave behind the chaos of visa forms and the risk of compiling the wrong documents. Ranz Global is with you at every step of your application.",
              )}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft">
              {t(
                locale,
                "Kayıt olup giriş yapın ve size belirtilen evrakları yükleyin. Alanında uzman danışmanlarımız evrakları kontrol etsin; kontrol sürecinin her adımını siz sadece takip edin.",
                "Register, sign in and upload the documents listed for you. Our specialist advisors review the file; you simply follow every step of the review.",
              )}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat locale={locale} />
    </div>
  );
}
