"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addRefusal } from "@/lib/store";
import { trackEngagement } from "@/lib/seo-store";
import { HOME_DEST_SLUGS, SERVICES } from "@/lib/services";
import { RegionCountryScroller } from "@/components/region-country-scroller";
import { REGION_META, regionByCode, slugToRegion } from "@/lib/region-countries";

function refusalYears() {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let year = current; year >= 2000; year -= 1) years.push(year);
  return years;
}

export function RefusalReviewForm({ source }: { source: string }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [region, setRegion] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const years = useMemo(refusalYears, []);
  const countries = SERVICES.filter((s) => HOME_DEST_SLUGS.includes(s.slug));
  const regionId = slugToRegion(region);
  const regionPicked = region === "schengen" || region === "asya" || region === "afrika";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const countryPick = regionId ? regionByCode(regionId, memberCode) : undefined;
    const selectedService = countries.find((s) => s.slug === region);
    const meta = regionId ? REGION_META[regionId] : undefined;
    const country =
      countryPick && meta
        ? `${t(locale, countryPick.tr, countryPick.en)} (${t(locale, meta.labelTr, meta.labelEn)})`
        : selectedService
          ? t(locale, selectedService.titleTr, selectedService.titleEn)
          : "";
    const year = String(form.get("year") || "").trim();
    const article = String(form.get("article") || "").trim();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    if (!country || !year || !article || !name || !email || (regionPicked && !countryPick)) return;
    addRefusal({
      name,
      email,
      country,
      year,
      article,
      locale,
    });
    trackEngagement("form", source);
    setSent(true);
  };

  if (sent) {
    return (
      <p className="mt-6 max-w-xl rounded-2xl border border-line bg-paper p-6 text-sm leading-6 text-ink-soft">
        {t(
          locale,
          "Dosyanız değerlendirmeye başarıyla gönderilmiştir. Temsilcimiz sizinle en kısa sürede irtibata geçecektir.",
          "Your file has been sent for review. Our representative will contact you as soon as possible.",
        )}
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className="btn mt-6" onClick={() => setOpen(true)}>
        {t(locale, "Ret Dosyamı Değerlendir", "Review My Refusal File")}
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <label className="block text-sm">
        {t(locale, "Hangi ülkeden ret aldınız?", "Which country refused your visa?")}
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
        {t(locale, "Hangi yıl ret aldınız?", "In which year were you refused?")}
        <select
          name="year"
          required
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        >
          <option value="">{t(locale, "Seçin", "Select")}</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        {t(locale, "Hangi maddeden ret aldınız?", "Under which ground / article were you refused?")}
        <textarea
          name="article"
          required
          rows={3}
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
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
        {t(locale, "Değerlendirmeye Gönder", "Send For Review")}
      </button>
    </form>
  );
}
