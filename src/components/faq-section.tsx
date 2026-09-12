"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { FAQ_ITEMS } from "@/lib/faq";

type Tab = "all" | "uk" | "usa" | "schengen";

export function FaqSection() {
  const { locale } = useLocale();
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="sss" className="scroll-mt-24 border-y border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-3xl md:text-4xl">{t(locale, "Sık Sorulan Sorular", "Frequently Asked Questions")}</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "Tümü", "All"],
              ["uk", "İngiltere", "UK"],
              ["usa", "ABD", "USA"],
              ["schengen", "Schengen", "Schengen"],
            ] as const
          ).map(([id, tr, en]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full border px-4 py-2 text-sm ${tab === id ? "border-navy bg-navy text-cream" : "border-line bg-cream"}`}
            >
              {t(locale, tr, en)}
            </button>
          ))}
        </div>
        <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-cream">
          {FAQ_ITEMS.map((item, i) => {
            const extra =
              tab === "uk"
                ? t(locale, item.extra?.ukTr ?? "", item.extra?.ukEn ?? "")
                : tab === "usa"
                  ? t(locale, item.extra?.usaTr ?? "", item.extra?.usaEn ?? "")
                  : tab === "schengen"
                    ? t(locale, item.extra?.schengenTr ?? "", item.extra?.schengenEn ?? "")
                    : "";
            return (
              <div key={item.qTr} className="px-5 py-4">
                <button type="button" className="w-full text-left" onClick={() => setOpen(open === i ? null : i)}>
                  <h3 className="font-serif text-xl">{t(locale, item.qTr, item.qEn)}</h3>
                </button>
                {open === i && (
                  <div className="mt-3 space-y-3 text-sm leading-7 text-ink-soft">
                    <p>{t(locale, item.aTr, item.aEn)}</p>
                    {extra ? <p>{extra}</p> : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
