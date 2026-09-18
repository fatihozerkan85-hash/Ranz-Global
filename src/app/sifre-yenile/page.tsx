"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { setAccountPassword } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

function ResetForm() {
  const { locale } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t(locale, "Bağlantı eksik.", "Link is missing."));
      return;
    }
    void fetch("/api/sifre-sifirla/dogrula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = (await res.json()) as { error?: string };
          setError(json.error || t(locale, "Bağlantı geçersiz.", "Link is invalid."));
          return;
        }
        setReady(true);
      })
      .catch(() => setError(t(locale, "Bağlantı doğrulanamadı.", "Could not verify the link.")));
  }, [token, locale]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t(locale, "Şifreler eşleşmiyor.", "Passwords do not match."));
      return;
    }
    const res = await fetch("/api/sifre-sifirla/dogrula", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const json = (await res.json()) as { email?: string; error?: string };
    if (!res.ok || !json.email) {
      setError(json.error || t(locale, "Bağlantı geçersiz.", "Link is invalid."));
      return;
    }
    const err = setAccountPassword(json.email, password);
    if (err) {
      setError(err);
      return;
    }
    router.push("/giris");
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-5 sm:p-8">
      <h1 className="font-serif text-3xl">{t(locale, "Yeni şifre", "New password")}</h1>
      {error && !ready ? (
        <p className="mt-4 text-sm text-[#8a3b24]">{error}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            {t(locale, "Yeni şifre", "New password")}
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            {t(locale, "Şifre tekrar", "Confirm password")}
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
            />
          </label>
          {error && <p className="text-sm text-[#8a3b24]">{error}</p>}
          <button type="submit" className="btn w-full" disabled={!ready}>
            {t(locale, "Şifreyi kaydet", "Save password")}
          </button>
        </form>
      )}
      <p className="mt-4 text-sm">
        <Link href="/giris" className="text-gold-deep">
          {t(locale, "Girişe dön", "Back to sign in")}
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader solid />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <Suspense>
          <ResetForm />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
