"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addAppointment } from "@/lib/store";
import { logPublicEngagement } from "@/components/engagement-tracker";
import { HOME_DEST_SLUGS, SERVICES } from "@/lib/services";
import { RegionCountryScroller } from "@/components/region-country-scroller";
import { REGION_META, regionByCode, slugToRegion } from "@/lib/region-countries";
import { clampTravelDate, travelDateBounds } from "@/lib/travel-date";

export function ContactLeadForm({ source }: { source: string }) {
  const { locale } = useLocale();
  const [sent, setSent] = useState(false);
  const [region, setRegion] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [dateBounds, setDateBounds] = useState({ min: "", max: "" });

  useEffect(() => {
    setDateBounds(travelDateBounds());
    const applyQuizLead = () => {
      try {
        const raw = sessionStorage.getItem("ranz-quiz-lead");
        if (!raw) return;
        sessionStorage.removeItem("ranz-quiz-lead");
        const saved = JSON.parse(raw) as { region?: string; memberCode?: string; schengenCode?: string };
        if (saved.region && HOME_DEST_SLUGS.includes(saved.region as (typeof HOME_DEST_SLUGS)[number])) {
          setRegion(saved.region);
        }
        const code = saved.memberCode || saved.schengenCode;
        const pickedRegion = slugToRegion(saved.region) ?? (code ? slugToRegion("schengen") : undefined);
        if (code && pickedRegion && regionByCode(pickedRegion, code)) {
          setRegion(pickedRegion === "schengen" ? "schengen" : pickedRegion);
          setMemberCode(code);
        }
      } catch {
        /* ignore */
      }
    };
    applyQuizLead();
    window.addEventListener("ranz-quiz-lead", applyQuizLead);
    return () => window.removeEventListener("ranz-quiz-lead", applyQuizLead);
  }, []);
  const countries = SERVICES.filter((s) => HOME_DEST_SLUGS.includes(s.slug));
  const regionId = slugToRegion(region);
  const regionPicked = region === "schengen" || region === "asya" || region === "afrika";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const countryPick = regionId ? regionByCode(regionId, memberCode) : undefined;
    const selectedService = countries.find((s) => s.slug === region);
    const meta = regionId ? REGION_META[regionId] : undefined;
    const country = countryPick && meta
      ? `${t(locale, countryPick.tr, countryPick.en)} (${t(locale, meta.labelTr, meta.labelEn)})`
      : selectedService
        ? t(locale, selectedService.titleTr, selectedService.titleEn)
        : "";
    if (!country || (regionPicked && !countryPick)) return;
    const origin = String(form.get("origin") || "").trim();
    const nextTravel = clampTravelDate(travelDate, dateBounds.min, dateBounds.max);
    if (travelDate && nextTravel !== travelDate) {
      setTravelDate(nextTravel);
      return;
    }
    addAppointment({
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      country,
      origin,
      travelDate: nextTravel || undefined,
      message: [country && `Ülke: ${country}`, origin && `Başvuru yeri: ${origin}`, nextTravel && `Seyahat: ${nextTravel}`]
        .filter(Boolean)
        .join(" · "),
      locale,
    });
    logPublicEngagement("form", source);
    setSent(true);
  };

  if (sent) {
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm leading-6 text-ink-soft">
        {t(
          locale,
          "Talebiniz alındı. Uzman Müşteri Temsilcimiz sizinle en kısa sürede irtibata geçecektir. Aynı metni e-posta adresinize de gönderdik.",
          "We received your request. Our expert customer representative will contact you as soon as possible. We also sent this to your email.",
        )}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        {t(locale, "Hangi ülke?", "Which country?")}
        <select
          name="country"
          required
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setMemberCode("");
          }}
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        >
          <option value="">{t(locale, "Seçin", "Select")}</option>
          {countries.map((s) => (
            <option key={s.slug} value={s.slug}>
              {t(locale, s.titleTr, s.titleEn)}
            </option>
          ))}
        </select>
      </label>
      {regionPicked && regionId && (
        <RegionCountryScroller region={regionId} value={memberCode} onChange={setMemberCode} />
      )}
      <label className="block text-sm">
        {t(locale, "Nereden başvuracaksınız?", "Where will you apply from?")}
        <select
          name="origin"
          required
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        >
          <option value="Türkiye">Türkiye</option>
          <option value="KKTC">KKTC</option>
        </select>
      </label>
      <label className="block min-w-0 text-sm">
        {t(locale, "Seyahat tarihi", "Travel date")}
        <input
          name="travelDate"
          type="date"
          value={travelDate}
          min={dateBounds.min}
          max={dateBounds.max}
          onInput={(e) => {
            const next = clampTravelDate(e.currentTarget.value, dateBounds.min, dateBounds.max);
            setTravelDate(next);
            e.currentTarget.value = next;
          }}
          onChange={(e) => {
            const next = clampTravelDate(e.target.value, dateBounds.min, dateBounds.max);
            setTravelDate(next);
          }}
          onBlur={(e) => {
            const next = clampTravelDate(e.target.value, dateBounds.min, dateBounds.max);
            setTravelDate(next);
          }}
          className="travel-date mt-1 w-full min-w-0 rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
        <span className="mt-1 block text-xs text-muted">
          {t(locale, "En erken yarın seçilebilir.", "The earliest date is tomorrow.")}
        </span>
      </label>
      <label className="block text-sm">
        {t(locale, "Ad soyad", "Full name")}
        <input
          name="name"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>
      <label className="block text-sm">
        {t(locale, "Telefon / WhatsApp", "Phone / WhatsApp")}
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>
      <label className="block text-sm">
        {t(locale, "E-posta", "Email")}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>
      <button type="submit" className="btn w-full" disabled={regionPicked && !memberCode}>
        {t(locale, "Uzmanınız Beni Arasın", "Have an advisor call me")}
      </button>
    </form>
  );
}
