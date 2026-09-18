"use client";

import { FormEvent, useEffect, useState } from "react";
import { MAIL_EVENTS } from "@/lib/mail-catalog";
import { getMailSettings, setMailEventEnabled, subscribeStore } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import type { MailSettings } from "@/lib/mail-catalog";

export default function MailSettingsPage() {
  const { locale } = useLocale();
  const [settings, setSettings] = useState<MailSettings | null>(null);
  const [testTo, setTestTo] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setSettings(getMailSettings());
    load();
    return subscribeStore(load);
  }, []);

  const onTest = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/bildirim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "test", to: [testTo] }),
    });
    const json = (await res.json()) as { error?: string; lastEvent?: string; skipped?: boolean };
    if (!res.ok) {
      setMessage(json.error || t(locale, "Mail gönderilemedi.", "Email could not be sent."));
      return;
    }
    if (json.skipped) {
      setMessage(t(locale, "Alıcı atlandı (demo adres veya geçersiz e-posta).", "Recipient skipped (demo or invalid email)."));
      return;
    }
    setMessage(
      t(
        locale,
        `Resend kabul etti (${json.lastEvent || "sent"}). Konu: “Ranz Global — deneme bildirimi”. Gönderen: onboarding@resend.dev. Gelen kutusu, Promosyonlar ve Spam’e bakın.`,
        `Resend accepted it (${json.lastEvent || "sent"}). Subject: “Ranz Global — deneme bildirimi”. From: onboarding@resend.dev. Check inbox, Promotions, and Spam.`,
      ),
    );
  };

  if (!settings) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{t(locale, "Yönetici", "Admin")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t(locale, "Bildirimler", "Notifications")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        {t(
          locale,
          "Mailler Resend ile gider. Alan doğrulanana kadar gönderen onboarding@resend.dev olur ve deneme yalnızca Resend hesabındaki Gmail adresine düşer. Gelen kutusu ve spam’i kontrol edin.",
          "Emails go through Resend. Until the domain is verified, mail is sent from onboarding@resend.dev and tests can only reach the Gmail on the Resend account. Check inbox and spam.",
        )}
      </p>

      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper">
        {MAIL_EVENTS.map((event) => (
          <li key={event.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium">{t(locale, event.labelTr, event.labelEn)}</p>
              {event.locked && (
                <p className="mt-1 text-xs text-muted">{t(locale, "Zorunlu", "Required")}</p>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings[event.id]}
                disabled={event.locked}
                onChange={(e) => setMailEventEnabled(event.id, e.target.checked)}
              />
              {t(locale, "Açık", "On")}
            </label>
          </li>
        ))}
      </ul>

      <form onSubmit={onTest} className="mt-8 max-w-md rounded-2xl border border-line bg-paper p-5">
        <p className="text-sm font-medium">{t(locale, "Deneme maili", "Test email")}</p>
        <input
          type="email"
          required
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="sizin@eposta.com"
          className="mt-3 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
        />
        <button type="submit" className="btn mt-4">
          {t(locale, "Gönder", "Send")}
        </button>
        {message && <p className="mt-3 text-xs text-muted">{message}</p>}
      </form>
    </div>
  );
}
