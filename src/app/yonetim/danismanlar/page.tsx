"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addStaffAdvisor, getStaffUsers, setStaffPassword, subscribeStore } from "@/lib/store";
import type { User } from "@/lib/types";

export default function AdvisorsAdminPage() {
  const { locale } = useLocale();
  const [staff, setStaff] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ name: string; email: string; password: string } | null>(null);
  const [resetId, setResetId] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setStaff(getStaffUsers());
    load();
    return subscribeStore(load);
  }, []);

  const onCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "");
    const lastName = String(data.get("lastName") || "");
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    const result = addStaffAdvisor({ firstName, lastName, email, password });
    if (result.error) {
      setError(result.error);
      setCreated(null);
      return;
    }
    setCreated({ name: result.user.name, email: result.user.email, password });
    form.reset();
  };

  const onResetPassword = (e: FormEvent<HTMLFormElement>, userId: string) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const err = setStaffPassword(userId, password);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setResetId(null);
    e.currentTarget.reset();
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{t(locale, "Yönetici", "Admin")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t(locale, "Danışmanlar", "Advisors")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        {t(
          locale,
          "Sınırsız danışman ekleyin. Ad, soyad ve şifre ekleme anında belirlenir. Giriş e-postası boş bırakılırsa addan üretilir.",
          "Add unlimited advisors. First name, last name and password are set immediately. If login email is empty, it is generated from the name.",
        )}
      </p>

      <form onSubmit={onCreate} className="mt-8 grid gap-4 rounded-2xl border border-line bg-paper p-6 md:grid-cols-2">
        <label className="block text-sm">
          {t(locale, "Ad", "First name")}
          <input
            name="firstName"
            required
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          {t(locale, "Soyad", "Last name")}
          <input
            name="lastName"
            required
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          {t(locale, "Şifre", "Password")}
          <input
            name="password"
            type="text"
            required
            minLength={6}
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          {t(locale, "Giriş e-postası (isteğe bağlı)", "Login email (optional)")}
          <input
            name="email"
            type="email"
            autoComplete="off"
            placeholder="ad.soyad@ranz.staff"
            className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        {error && <p className="text-sm text-[#8a3b24] md:col-span-2">{error}</p>}
        <div className="md:col-span-2">
          <button type="submit" className="rounded-full bg-ink px-6 py-3 text-sm text-cream">
            {t(locale, "Danışman ekle", "Add advisor")}
          </button>
        </div>
      </form>

      {created && (
        <div className="mt-6 rounded-2xl border border-gold bg-paper p-5 text-sm">
          <p className="font-medium">{t(locale, "Danışman eklendi", "Advisor added")}</p>
          <p className="mt-2 text-ink-soft">
            {created.name}
            <br />
            {t(locale, "Giriş", "Sign in")}: {created.email}
            <br />
            {t(locale, "Şifre", "Password")}: {created.password}
          </p>
          <p className="mt-2 text-xs text-muted">{t(locale, "Bu kişi /giris üzerinden danışman paneline girer.", "This person signs in at /giris to the advisor panel.")}</p>
        </div>
      )}

      <h2 className="mt-10 font-serif text-2xl">
        {t(locale, "Kayıtlı danışmanlar", "Registered advisors")}
        <span className="ml-2 text-base text-muted">({staff.length})</span>
      </h2>
      <div className="mt-4 space-y-3">
        {staff.map((person) => (
          <article key={person.id} className="rounded-xl border border-line bg-paper px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="mt-1 text-xs text-muted">{person.email}</p>
              </div>
              <button
                type="button"
                className="text-xs text-gold-deep"
                onClick={() => setResetId((id) => (id === person.id ? null : person.id))}
              >
                {t(locale, "Şifreyi değiştir", "Change password")}
              </button>
            </div>
            {resetId === person.id && (
              <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => onResetPassword(e, person.id)}>
                <input
                  name="password"
                  type="text"
                  required
                  minLength={6}
                  placeholder={t(locale, "Yeni şifre", "New password")}
                  className="min-w-[12rem] flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <button type="submit" className="rounded-full bg-ink px-4 py-2 text-xs text-cream">
                  {t(locale, "Kaydet", "Save")}
                </button>
              </form>
            )}
          </article>
        ))}
        {staff.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Henüz danışman yok.", "No advisors yet.")}</p>
        )}
      </div>
    </div>
  );
}
