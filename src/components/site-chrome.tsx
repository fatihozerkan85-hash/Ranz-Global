"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { WhatsAppHeaderButton } from "@/components/whatsapp-button";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";

export { BrandMark };

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const pathname = usePathname();
  const inApp =
    pathname.startsWith("/panel") || pathname.startsWith("/danisman") || pathname.startsWith("/yonetim");

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        solid ? "border-line bg-paper/95 backdrop-blur" : "border-transparent bg-cream/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <BrandMark />
        {!inApp && (
          <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
            <Link href="/hizmetler">{t(locale, "Hizmetler", "Services")}</Link>
            <Link href="/vize-rehberi">{t(locale, "Vize rehberi", "Visa guides")}</Link>
            <Link href="/blog">{t(locale, "Blog", "Blog")}</Link>
            <Link href="/hakkimizda">{t(locale, "Hakkımızda", "About")}</Link>
            <Link href="/#iletisim">{t(locale, "İletişim", "Contact")}</Link>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <WhatsAppHeaderButton locale={locale} />
          <LanguageSwitcher compact />
          {user ? (
            <Link
              href={user.role === "admin" ? "/yonetim" : user.role === "staff" ? "/danisman" : "/panel"}
              className="rounded-full bg-ink px-4 py-2 text-sm text-cream"
            >
              {t(locale, "Panelim", "My portal")}
            </Link>
          ) : (
            <Link href="/giris" className="rounded-full bg-ink px-4 py-2 text-sm text-cream">
              {t(locale, "Giriş", "Sign in")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useLocale();
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif tracking-[0.12em] text-ink">RANZ GLOBAL</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gold-deep">Travel & Visa</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <Link href="/kvkk">{t(locale, "KVKK", "Data notice")}</Link>
          <Link href="/gizlilik">{t(locale, "Gizlilik", "Privacy")}</Link>
          <Link href="/randevu">{t(locale, "Görüşme talebi", "Request a meeting")}</Link>
        </div>
        <p className="max-w-sm text-xs">
          {t(
            locale,
            "Ranz Global özel bir danışmanlık firmasıdır; konsolosluk veya devlet kurumu değildir.",
            "Ranz Global is a private consultancy, not a government or consular office.",
          )}
        </p>
      </div>
    </footer>
  );
}
