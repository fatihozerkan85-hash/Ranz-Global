"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { portalPath, useAuth } from "@/lib/auth";
import { isPublicSessionUser } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { findRegionCountry, regionByCode, slugToRegion } from "@/lib/region-countries";

function nextFilePath(params: { get: (key: string) => string | null }) {
  const ulke = params.get("ulke");
  const region = slugToRegion(params.get("hizmet")) ?? findRegionCountry(ulke)?.region;
  if (region && ulke && regionByCode(region, ulke)) {
    return `/panel/yeni?hizmet=${region}&ulke=${ulke}`;
  }
  return null;
}

function RegisterForm() {
  const { locale } = useLocale();
  const { register, user, ready } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !isPublicSessionUser(user) || !user) return;
    if (user.role !== "client") {
      router.replace(portalPath(user));
      return;
    }
    const next = nextFilePath(params);
    if (next) {
      router.replace(next);
      return;
    }
    router.replace("/panel");
  }, [ready, user, router, params]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = register(name, email, password, phone);
    if (err) {
      setError(err);
      return;
    }
    const next = nextFilePath(params) || "/panel";
    router.replace(next);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-5 sm:p-8">
      <h1 className="font-serif text-3xl">{t(locale, "Hesap açın", "Create account")}</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          {t(locale, "Ad soyad", "Full name")}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
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
          {t(locale, "Telefon (WhatsApp bildirimleri)", "Phone (WhatsApp alerts)")}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="90555…"
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
          {t(locale, "Kayıt ol", "Register")}
        </button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/giris" className="text-gold-deep">
          {t(locale, "Zaten hesabım var", "I already have an account")}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader solid />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
