"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addAppointment } from "@/lib/store";
import { trackEngagement } from "@/lib/seo-store";
import { HOME_DEST_SLUGS, SERVICES } from "@/lib/services";

export function ContactLeadForm({ source }: { source: string }) {
  const { locale } = useLocale();
  const [sent, setSent] = useState(false);
  const countries = SERVICES.filter((s) => HOME_DEST_SLUGS.includes(s.slug));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const country = String(form.get("country") || "").trim();
    const origin = String(form.get("origin") || "").trim();
    const travelDate = String(form.get("travelDate") || "").trim();
    addAppointment({
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      country,
      origin,
      travelDate,
      message: [country && `Ülke: ${country}`, origin && `Başvuru yeri: ${origin}`, travelDate && `Seyahat: ${travelDate}`]
        .filter(Boolean)
        .join(" · "),
      locale,
    });
    trackEngagement("form", source);
    setSent(true);
  };

  if (sent) {
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm leading-6 text-ink-soft">
        {t(
          locale,
          "Talebiniz alındı. Uzmanımız sizi arayacak.",
          "We received your request. An advisor will call you.",
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
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        >
          <option value="">{t(locale, "Seçin", "Select")}</option>
          {countries.map((s) => (
            <option key={s.slug} value={t(locale, s.titleTr, s.titleEn)}>
              {s.flag} {t(locale, s.titleTr, s.titleEn)}
            </option>
          ))}
        </select>
      </label>
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
      <label className="block text-sm">
        {t(locale, "Seyahat tarihi", "Travel date")}
        <input
          name="travelDate"
          type="month"
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
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>
      <button type="submit" className="btn w-full">
        {t(locale, "Uzmanımız beni arasın", "Have an advisor call me")}
      </button>
    </form>
  );
}
