"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addAppointment } from "@/lib/store";
import { trackEngagement } from "@/lib/seo-store";

export function ContactLeadForm({ source }: { source: string }) {
  const { locale } = useLocale();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    addAppointment({
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      message: String(form.get("message") || "").trim(),
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
          "Mesajınız alındı. Danışmanımız telefonunuzdan sizinle iletişime geçecek.",
          "Your message was received. An advisor will contact you by phone.",
        )}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        {t(locale, "Telefon", "Phone")}
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>
      <label className="block text-sm">
        {t(locale, "Mesajınız", "Message")}
        <textarea
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
      </label>
      <button type="submit" className="w-full rounded-full bg-ink py-3 text-sm text-cream">
        {t(locale, "Gönder", "Send")}
      </button>
    </form>
  );
}
