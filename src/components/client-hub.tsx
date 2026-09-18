"use client";

import { CalendarDays, FileStack, FileText, MessageCircle } from "lucide-react";
import { AppLink } from "@/components/panel-shell";
import type { Application, Locale, User } from "@/lib/types";
import { t } from "@/lib/i18n";
import { whatsappHref } from "@/lib/contact";
import { advisorTitle, fileReadiness, firstNameOf, formatReviewedAt, hubChecklist } from "@/lib/file-hub";

export function FileScore({ app, locale }: { app: Application; locale: Locale }) {
  const score = fileReadiness(app);
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">
        {t(locale, "Dosya hazırlık durumu", "File readiness")}
      </p>
      <p className="mt-2 font-serif text-4xl">{score.overall}%</p>
      <p className="mt-1 text-xs text-muted">
        {t(locale, "Bu oran vize sonucu değildir; yalnızca dosya tamamlanma düzeyidir.", "This is file completeness, not a visa outcome.")}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-gold" style={{ width: `${score.overall}%` }} />
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
        <li>
          {t(locale, "Evraklar", "Documents")}: {score.docs}%
        </li>
        <li>
          {t(locale, "Form", "Form")}: {score.form}%
        </li>
        <li>
          {t(locale, "Rezervasyonlar", "Bookings")}: {score.bookings}%
        </li>
        <li>
          {t(locale, "Danışman kontrolü", "Advisor review")}:{" "}
          {score.reviewWaiting
            ? t(locale, "Bekliyor", "Pending")
            : score.review === 100
              ? t(locale, "Tamamlandı", "Complete")
              : `${score.review}%`}
        </li>
      </ul>
    </div>
  );
}

export function AdvisorCard({
  app,
  advisor,
  locale,
}: {
  app: Application;
  advisor?: User;
  locale: Locale;
}) {
  const name = advisor?.name || app.advisorName || t(locale, "Atanacak", "To be assigned");
  const extra = t(
    locale,
    `Dosya: ${app.id} · ${app.destinationTr}`,
    `File: ${app.id} · ${app.destinationEn}`,
  );
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-gold-deep">{t(locale, "Vize uzmanınız", "Your visa specialist")}</p>
      <p className="mt-2 font-serif text-3xl">{name}</p>
      <p className="mt-1 text-sm text-ink-soft">{advisorTitle(advisor, locale)}</p>
      <p className="mt-4 text-sm text-ink-soft">{formatReviewedAt(app.reviewedAt, locale)}</p>
      <a href={whatsappHref(locale, extra)} target="_blank" rel="noreferrer" className="btn mt-5">
        {t(locale, "Danışmanıma mesaj gönder", "Message my advisor")}
      </a>
    </div>
  );
}

export function ClientHub({
  userName,
  app,
  advisor,
  locale,
}: {
  userName: string;
  app: Application;
  advisor?: User;
  locale: Locale;
}) {
  const score = fileReadiness(app);
  const steps = hubChecklist(app, locale);
  const greeting = firstNameOf(userName).toLocaleUpperCase(locale === "en" ? "en-GB" : "tr-TR");
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">
        {t(locale, "Ranz Global müşteri paneli", "Ranz Global client portal")}
      </p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">
        {t(locale, `Merhaba ${greeting}`, `Hello ${greeting}`)}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        {t(locale, "Başvurunuzu yönetin ve sürecinizi takip edin.", "Manage your application and follow the process.")}
      </p>
      <p className="mt-6 font-serif text-3xl">{t(locale, `${app.destinationTr} başvurunuz`, `Your ${app.destinationEn} application`)}</p>
      <p className="mt-3 text-lg">
        {t(locale, `Dosyanız %${score.overall} hazır`, `Your file is ${score.overall}% ready`)}
      </p>
      <ol className="mt-6 space-y-2.5">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-3 text-sm">
            <span
              className={
                step.state === "done"
                  ? "text-[#2f7d4a]"
                  : step.state === "warn"
                    ? "text-[#c45c2a]"
                    : step.state === "current"
                      ? "text-gold-deep"
                      : "text-muted"
              }
            >
              {step.state === "done" ? "✓" : step.state === "warn" ? "!" : step.state === "current" ? "●" : "○"}
            </span>
            <span className={step.state === "todo" ? "text-muted" : "text-ink"}>{step.label}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AppLink href={`/panel/basvuru/${app.id}`} className="btn btn-lg justify-center">
          <FileStack size={16} />
          {t(locale, "Evraklarım", "My documents")}
        </AppLink>
        <a href={whatsappHref(locale, `${app.id} · ${app.destinationTr}`)} target="_blank" rel="noreferrer" className="btn btn-lg justify-center">
          <MessageCircle size={16} />
          {t(locale, "Danışmanıma sor", "Ask my advisor")}
        </a>
        <AppLink href="/panel/randevu" className="btn btn-lg justify-center">
          <CalendarDays size={16} />
          {t(locale, "Randevum", "My appointment")}
        </AppLink>
        <AppLink href="/panel/formlar" className="btn btn-lg justify-center">
          <FileText size={16} />
          {t(locale, "Formlarım", "My forms")}
        </AppLink>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <AdvisorCard app={app} advisor={advisor} locale={locale} />
        <FileScore app={app} locale={locale} />
      </div>
    </div>
  );
}
