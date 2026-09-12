"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { HOME_DEST_SLUGS, serviceBySlug, SERVICES, type ServiceSlug } from "@/lib/services";
import { CountryFlag } from "@/components/country-flag";

const PURPOSE = [
  { id: "tourist", tr: "Turistik", en: "Tourism" },
  { id: "family", tr: "Aile ziyareti", en: "Family visit" },
  { id: "business", tr: "Ticari", en: "Business" },
] as const;

const WORK = [
  { id: "employee", tr: "Çalışan", en: "Employed" },
  { id: "owner", tr: "Şirket sahibi", en: "Business owner" },
  { id: "retired", tr: "Emekli", en: "Retired" },
  { id: "student", tr: "Öğrenci", en: "Student" },
  { id: "none", tr: "Çalışmıyor", en: "Not working" },
] as const;

type Answers = {
  country?: ServiceSlug;
  purpose?: string;
  when?: string;
  work?: string;
  refused?: string;
  origin?: string;
};

export function VisaQuiz() {
  const { locale } = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const quizCountries = SERVICES.filter((s) => HOME_DEST_SLUGS.includes(s.slug));
  const service = answers.country ? serviceBySlug(answers.country) : undefined;

  const questions = useMemo(
    () => [
      {
        q: t(locale, "Nereye seyahat edeceksiniz?", "Where will you travel?"),
        options: quizCountries.map((s) => ({
          id: s.slug,
          label: t(locale, s.titleTr.replace(" Vizesi", ""), s.titleEn.replace(" Visa", "")),
          flag: s.flag,
        })),
        key: "country" as const,
      },
      {
        q: t(locale, "Seyahat amacınız?", "What is the purpose of travel?"),
        options: PURPOSE.map((p) => ({ id: p.id, label: t(locale, p.tr, p.en) })),
        key: "purpose" as const,
      },
      {
        q: t(locale, "Ne zaman gitmek istiyorsunuz?", "When do you want to travel?"),
        options: [
          { id: "1m", label: t(locale, "1 ay içinde", "Within 1 month") },
          { id: "3m", label: t(locale, "1–3 ay", "1–3 months") },
          { id: "later", label: t(locale, "3 aydan sonra", "After 3 months") },
        ],
        key: "when" as const,
      },
      {
        q: t(locale, "Çalışma durumunuz?", "Employment status?"),
        options: WORK.map((p) => ({ id: p.id, label: t(locale, p.tr, p.en) })),
        key: "work" as const,
      },
      {
        q: t(locale, "Daha önce vize reddiniz var mı?", "Have you had a visa refusal before?"),
        options: [
          { id: "no", label: t(locale, "Hayır", "No") },
          { id: "yes", label: t(locale, "Evet", "Yes") },
        ],
        key: "refused" as const,
      },
      {
        q: t(locale, "Nereden başvuracaksınız?", "Where will you apply from?"),
        options: [
          { id: "tr", label: t(locale, "Türkiye", "Türkiye") },
          { id: "kktc", label: t(locale, "KKTC", "TRNC") },
        ],
        key: "origin" as const,
      },
    ],
    [locale, quizCountries],
  );

  const current = questions[step];
  const done = step >= questions.length;

  return (
        <section id="on-degerlendirme" className="scroll-mt-24 border-y border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold-deep">
          {t(locale, "60 saniye", "60 seconds")}
        </p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">
          {t(locale, "Hangi vize size uygun?", "Which visa fits you?")}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">
          {t(locale, "60 saniyede ön değerlendirme yapın.", "Get a preliminary read in 60 seconds.")}
        </p>

        {!done && current && (
          <div className="mt-10 max-w-2xl">
            <p className="text-sm text-muted">
              {step + 1}/{questions.length}
            </p>
            <h3 className="mt-2 font-serif text-2xl">{current.q}</h3>
            <div className="mt-6 flex flex-wrap gap-2">
              {current.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="btn btn-line"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, [current.key]: opt.id }));
                    setStep((s) => s + 1);
                  }}
                >
                  {"flag" in opt && opt.flag ? <CountryFlag code={opt.flag} title={opt.label} /> : null}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {done && service && (
          <div className="mt-10 max-w-2xl rounded-2xl border border-line bg-cream p-6 md:p-8">
            <h3 className="font-serif text-2xl leading-snug">
              {t(
                locale,
                `${service.titleTr.replace(" Vizesi", "")} ${service.visaTr} başvurusu sizin için uygun görünüyor.`,
                `${service.visaEn} looks like a fit for your trip.`,
              )}
            </h3>
            <p className="mt-4 text-sm leading-7 text-ink-soft">
              {t(
                locale,
                "Dosyanızın uzmanımız tarafından değerlendirilmesini ister misiniz? Bu bir ön okumadır; kesin uygunluk evrak ve profile bağlıdır.",
                "Would you like an advisor to assess the file? This is a preliminary read; the file and profile decide suitability.",
              )}
            </p>
            {answers.refused === "yes" && (
              <p className="mt-3 text-sm text-ink-soft">
                {t(
                  locale,
                  "Önceki ret, dilekçe ve dosya bütünlüğünü daha dikkatli kurmamızı gerektirir.",
                  "A prior refusal means we will treat letters and file consistency with extra care.",
                )}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/kayit?hizmet=${service.slug}`} className="btn btn-lg">
                {t(locale, "Başvurumu başlat", "Start my application")}
              </Link>
              <Link href={`/hizmet/${service.slug}`} className="btn btn-lg btn-line">
                {t(locale, "Hizmet sayfası", "Service page")}
              </Link>
              <button type="button" className="text-sm text-gold-deep" onClick={() => { setStep(0); setAnswers({}); }}>
                {t(locale, "Yeniden başla", "Start over")}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
