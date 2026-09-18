"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CountryFlag } from "@/components/country-flag";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import {
  REGION_META,
  countriesForRegion,
  regionServiceHref,
  type RegionId,
} from "@/lib/region-countries";

export function RegionCountryScroller({
  region,
  value,
  onChange,
  mode = "select",
}: {
  region: RegionId;
  value?: string;
  onChange?: (code: string) => void;
  mode?: "select" | "links";
}) {
  const { locale } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  const [scroll, setScroll] = useState(0);
  const meta = REGION_META[region];
  const countries = countriesForRegion(region);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    setOverflow(max);
    setScroll(Math.min(el.scrollLeft, max));
  }, []);

  useEffect(() => {
    measure();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, region]);

  const jump = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const showSlider = overflow > 8;

  return (
    <div className="min-w-0 w-full">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
        {t(locale, meta.headingTr, meta.headingEn)}
      </p>
      <p className="mt-1 text-sm text-ink-soft">{t(locale, meta.hintTr, meta.hintEn)}</p>
      <div className="mt-3 flex min-w-0 items-center gap-2">
        {showSlider ? (
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-navy text-cream hover:bg-navy-hover sm:h-9 sm:w-9"
            aria-label={t(locale, meta.prevTr, meta.prevEn)}
            onClick={() => jump(-220)}
          >
            ‹
          </button>
        ) : null}
        <div
          ref={scrollerRef}
          onScroll={() => {
            const el = scrollerRef.current;
            if (!el) return;
            setScroll(el.scrollLeft);
            setOverflow(Math.max(0, el.scrollWidth - el.clientWidth));
          }}
          className="schengen-chips min-w-0 flex-1 overflow-x-auto overscroll-x-contain pb-1 [touch-action:pan-x]"
        >
          <div className="flex w-max gap-2">
            {countries.map((country) => {
              const label = t(locale, country.tr, country.en);
              const active = value === country.code;
              const className = `inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm whitespace-nowrap ${
                active ? "border-navy bg-navy text-cream" : "border-line bg-paper hover:border-gold"
              }`;
              if (mode === "links") {
                return (
                  <Link key={country.code} href={regionServiceHref(region, country.code)} className={className}>
                    <CountryFlag code={country.code} title={label} />
                    {label}
                  </Link>
                );
              }
              return (
                <button key={country.code} type="button" className={className} onClick={() => onChange?.(country.code)}>
                  <CountryFlag code={country.code} title={label} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        {showSlider ? (
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-navy text-cream hover:bg-navy-hover sm:h-9 sm:w-9"
            aria-label={t(locale, meta.nextTr, meta.nextEn)}
            onClick={() => jump(220)}
          >
            ›
          </button>
        ) : null}
      </div>
      {showSlider ? (
        <input
          type="range"
          min={0}
          max={overflow}
          value={Math.min(scroll, overflow)}
          onChange={(e) => {
            const next = Number(e.target.value);
            setScroll(next);
            if (scrollerRef.current) scrollerRef.current.scrollLeft = next;
          }}
          className="schengen-slider mt-3 w-full"
          aria-label={t(locale, meta.sliderTr, meta.sliderEn)}
        />
      ) : null}
    </div>
  );
}
