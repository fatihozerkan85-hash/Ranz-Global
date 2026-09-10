"use client";

import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function AppointmentView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Randevu", "Meeting")}
        title={t(locale, "Görüşme talebi", "Request a meeting")}
        lead={t(locale, "Ad, telefon ve mesaj yeter. Talebiniz yönetim paneline düşer.", "Name, phone and a message are enough. Your request lands in the admin panel.")}
      />
      <section className="mx-auto max-w-xl px-5 py-14">
        <div className="rounded-2xl border border-line bg-paper p-8">
          <ContactLeadForm source="/randevu" />
        </div>
      </section>
    </MarketingShell>
  );
}
