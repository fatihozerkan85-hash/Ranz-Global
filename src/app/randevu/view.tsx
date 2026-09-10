"use client";

import { FormEvent, useState } from "react";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addAppointment } from "@/lib/store";
import { trackEngagement } from "@/lib/seo-store";

export default function AppointmentView() {
  const { locale } = useLocale();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    addAppointment({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      topic: String(form.get("topic") || ""),
      locale,
    });
    trackEngagement("form", "/randevu");
    setSent(true);
  };

  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Randevu", "Meeting")}
        title={t(locale, "Görüşme talebi", "Request a meeting")}
        lead={t(locale, "Takvim entegrasyonu sonraki fazdadır; talebiniz yönetim paneline düşer.", "Calendar sync is a later phase; your request lands in the admin panel.")}
      />
      <section className="mx-auto max-w-xl px-5 py-14">
        {sent ? (
          <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-ink-soft">
            {t(locale, "Talebiniz alındı. Danışmanımız sizinle iletişime geçecek.", "Request received. An advisor will contact you.")}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-paper p-8">
            <label className="block text-sm">
              {t(locale, "Ad soyad", "Full name")}
              <input name="name" required className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              {t(locale, "E-posta", "Email")}
              <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              {t(locale, "Telefon", "Phone")}
              <input name="phone" required className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              {t(locale, "Konu", "Topic")}
              <select name="topic" className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5">
                <option value="schengen">{t(locale, "Schengen", "Schengen")}</option>
                <option value="usa">{t(locale, "Amerika vizeleri", "US visas")}</option>
                <option value="other">{t(locale, "Diğer", "Other")}</option>
              </select>
            </label>
            <button type="submit" className="w-full rounded-full bg-ink py-3 text-sm text-cream">
              {t(locale, "Gönder", "Send")}
            </button>
          </form>
        )}
      </section>
    </MarketingShell>
  );
}
