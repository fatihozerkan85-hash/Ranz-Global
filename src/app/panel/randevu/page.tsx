"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplications, subscribeStore } from "@/lib/store";
import type { Application } from "@/lib/types";

export default function AppointmentHub() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = () => setApps(getApplications(user.id));
    load();
    return subscribeStore(load);
  }, [user]);

  const withAppt = apps.filter((a) => a.appointment);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{t(locale, "Randevum", "My appointment")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t(locale, "Randevunuz", "Your appointment")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        {t(
          locale,
          "Tarih, merkez ve yanınızda götürecekleriniz danışmanınız randevuyu kaydettiğinde burada görünür.",
          "Date, centre and what to bring appear here when your advisor saves the appointment.",
        )}
      </p>
      <div className="mt-8 space-y-4">
        {withAppt.map((app) => {
          const appt = app.appointment!;
          const maps = appt.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(`${appt.venueTr} ${appt.cityTr}`)}`;
          return (
            <article key={app.id} className="rounded-2xl border border-line bg-paper p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{t(locale, app.destinationTr, app.destinationEn)}</p>
              <p className="mt-3 text-lg">📅 {appt.date}</p>
              <p className="mt-1 text-lg">🕐 {appt.time}</p>
              <p className="mt-1 text-lg">📍 {t(locale, appt.cityTr, appt.cityEn)}</p>
              <p className="mt-4 font-serif text-2xl">{t(locale, appt.venueTr, appt.venueEn)}</p>
              <p className="mt-4 text-sm leading-6 text-ink-soft">
                <span className="text-xs uppercase tracking-[0.16em] text-gold-deep">
                  {t(locale, "Yanınızda götürmeniz gerekenler", "What to bring")}
                </span>
                <span className="mt-1 block">{t(locale, appt.bringTr, appt.bringEn)}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {appt.docUrl && (
                  <a href={appt.docUrl} target="_blank" rel="noreferrer" className="btn">
                    {t(locale, "Randevu belgesini indir", "Download appointment letter")}
                  </a>
                )}
                <a href={maps} target="_blank" rel="noreferrer" className="btn btn-line">
                  {t(locale, "Yol tarifi", "Directions")}
                </a>
                <Link href={`/panel/basvuru/${app.id}`} className="btn btn-line">
                  {t(locale, "Dosyayı aç", "Open file")}
                </Link>
              </div>
            </article>
          );
        })}
        {withAppt.length === 0 && (
          <p className="text-sm text-muted">
            {t(locale, "Henüz kayıtlı randevu yok.", "No appointment is saved yet.")}
          </p>
        )}
      </div>
    </div>
  );
}
