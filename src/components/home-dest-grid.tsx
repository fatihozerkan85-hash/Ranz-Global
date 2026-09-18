"use client";

import { useState } from "react";
import { CountryFlag } from "@/components/country-flag";
import { RegionCountryScroller } from "@/components/region-country-scroller";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { slugToRegion, type RegionId } from "@/lib/region-countries";
import { serviceBySlug } from "@/lib/services";
import type { HomeContent } from "@/lib/types";

export function HomeDestGrid({ cards }: { cards: HomeContent["destCards"] }) {
  const { locale } = useLocale();
  const [openRegion, setOpenRegion] = useState<RegionId | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-4">
        {cards.map((card) => {
          const service = serviceBySlug(card.id);
          const href = service ? `/hizmet/${card.id}` : "/hizmetler";
          const region = slugToRegion(card.id);
          if (region && (card.id === "schengen" || card.id === "asya" || card.id === "afrika")) {
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setOpenRegion((current) => (current === region ? null : region))}
                className={`rounded-2xl border bg-cream p-4 text-left transition hover:border-gold sm:p-5 ${
                  openRegion === region ? "border-gold" : "border-line"
                }`}
              >
                <span className="flex items-center gap-2">
                  {service ? <CountryFlag code={service.flag} title={t(locale, card.titleTr, card.titleEn)} /> : null}
                  <h3 className="font-serif text-lg sm:text-xl">{t(locale, card.titleTr, card.titleEn)}</h3>
                </span>
                <p className="mt-1 text-xs text-muted">{t(locale, card.hintTr, card.hintEn)}</p>
              </button>
            );
          }
          return (
            <a key={card.id} href={href} className="rounded-2xl border border-line bg-cream p-4 transition hover:border-gold sm:p-5">
              <span className="flex items-center gap-2">
                {service ? <CountryFlag code={service.flag} title={t(locale, card.titleTr, card.titleEn)} /> : null}
                <h3 className="font-serif text-lg sm:text-xl">{t(locale, card.titleTr, card.titleEn)}</h3>
              </span>
              <p className="mt-1 text-xs text-muted">{t(locale, card.hintTr, card.hintEn)}</p>
            </a>
          );
        })}
      </div>
      {openRegion && (
        <div className="mt-4 rounded-2xl border border-line bg-cream p-4 sm:p-5">
          <RegionCountryScroller region={openRegion} mode="links" />
        </div>
      )}
    </>
  );
}
