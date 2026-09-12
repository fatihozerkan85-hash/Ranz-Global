"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default function LoginPage() {
  const { locale } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("yonetici@ranz.demo");
  const [password, setPassword] = useState("ranz2026");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { error: err, user: logged } = login(email, password);
    if (err || !logged) {
      setError(err);
      return;
    }
    router.push(logged.role === "admin" ? "/yonetim/erp" : logged.role === "staff" ? "/danisman" : "/panel");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader solid />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-8">
          <h1 className="font-serif text-3xl">{t(locale, "Giriş", "Sign in")}</h1>
          <p className="mt-2 text-sm text-muted">
            {t(locale, "Dosyanıza ve evrak listenize ulaşın.", "Open your file and document list.")}
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
            <label className="block text-sm">
              {t(locale, "Şifre", "Password")}
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
              />
            </label>
            {error && <p className="text-sm text-[#8a3b24]">{error}</p>}
            <button type="submit" className="btn w-full">
              {t(locale, "Devam", "Continue")}
            </button>
          </form>
          <p className="mt-6 text-xs leading-5 text-muted">
            {t(locale, "Demo müşteri:", "Demo client:")} ayse@ranz.demo · {t(locale, "Danışman:", "Advisor:")}{" "}
            danisman@ranz.demo · {t(locale, "Yönetici:", "Admin:")} yonetici@ranz.demo
            <br />
            {t(locale, "Şifre", "Password")}: ranz2026
          </p>
          <p className="mt-4 text-sm">
            <Link href="/kayit" className="text-gold-deep">
              {t(locale, "Hesap oluştur", "Create an account")}
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
