"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { isDeliverableEmail } from "@/lib/mail-catalog";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const value = email.trim().toLowerCase();
    if (isDeliverableEmail(value)) {
      setSending(true);
      try {
        const res = await fetch("/api/sifre-sifirla", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });
        if (!res.ok) {
          const json = (await res.json()) as { error?: string };
          setError(json.error || t(locale, "Mail gönderilemedi.", "Email could not be sent."));
          setSending(false);
          return;
        }
      } catch {
        setError(t(locale, "Mail gönderilemedi. Biraz sonra tekrar deneyin.", "Email could not be sent. Try again shortly."));
        setSending(false);
        return;
      }
      setSending(false);
    }
    setMessage(
      t(
        locale,
        "Sıfırlama bağlantısı gönderildi. Gelen kutusu, Promosyonlar ve Spam klasörüne bakın. Linki hesabın açıldığı tarayıcıda açın.",
        "A reset link was sent. Check inbox, Promotions, and Spam. Open it in the browser where the account was created.",
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader solid />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-5 sm:p-8">
          <h1 className="font-serif text-3xl">{t(locale, "Şifremi unuttum", "Forgot password")}</h1>
          <p className="mt-2 text-sm text-muted">
            {t(
              locale,
              "Kayıtlı e-postanıza 2 saatlik bir bağlantı gider. Yeni şifre, hesabın açıldığı tarayıcıda kaydedilir.",
              "A 2-hour link is sent to your registered email. The new password is saved in the browser where the account was created.",
            )}
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block text-sm">
              {t(locale, "E-posta", "Email")}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
              />
            </label>
            {error && <p className="text-sm text-[#8a3b24]">{error}</p>}
            {message && <p className="text-sm text-ink-soft">{message}</p>}
            <button type="submit" className="btn w-full" disabled={sending}>
              {t(locale, "Bağlantı gönder", "Send link")}
            </button>
          </form>
          <p className="mt-4 text-sm">
            <Link href="/giris" className="text-gold-deep">
              {t(locale, "Girişe dön", "Back to sign in")}
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
