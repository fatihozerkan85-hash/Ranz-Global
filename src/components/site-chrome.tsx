"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { WhatsAppHeaderButton } from "@/components/whatsapp-button";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useHome } from "@/lib/use-site";

export { BrandMark };

export function SiteHeader({ solid: _solid = false }: { solid?: boolean }) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const pathname = usePathname();
  const inApp =
    pathname.startsWith("/panel") || pathname.startsWith("/danisman") || pathname.startsWith("/yonetim");

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-navy">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-5">
        <BrandMark onDark />
        {!inApp && (
          <nav className="hidden items-center gap-7 text-sm text-cream/80 md:flex">
            <Link href="/hizmetler" className="hover:text-gold">
              {t(locale, "Hizmetler", "Services")}
            </Link>
            <Link href="/vize-rehberi" className="hover:text-gold">
              {t(locale, "Vize rehberi", "Visa guides")}
            </Link>
            <Link href="/blog" className="hover:text-gold">
              {t(locale, "Blog", "Blog")}
            </Link>
            <Link href="/hakkimizda" className="hover:text-gold">
              {t(locale, "Hakkımızda", "About")}
            </Link>
            <Link href="/#iletisim" className="hover:text-gold">
              {t(locale, "İletişim", "Contact")}
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <WhatsAppHeaderButton locale={locale} />
          <LanguageSwitcher compact tone="gold" />
          {user ? (
            <Link
              href={user.role === "admin" ? "/yonetim/erp" : user.role === "staff" ? "/danisman" : "/panel"}
              className="btn btn-sm btn-gold btn-header"
            >
              {t(locale, "Panelim", "My portal")}
            </Link>
          ) : (
            <Link href="/giris" className="btn btn-sm btn-gold btn-header">
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
  const home = useHome();
  return (
    <footer className="bg-navy text-cream/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-serif tracking-[0.12em] text-cream">RANZ GLOBAL</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gold">Travel & Visa</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-cream/70">
          <Link href="/kvkk" className="hover:text-gold">
            {t(locale, "KVKK", "Data notice")}
          </Link>
          <Link href="/gizlilik" className="hover:text-gold">
            {t(locale, "Gizlilik", "Privacy")}
          </Link>
          <Link href="/randevu" className="hover:text-gold">
            {t(locale, "Görüşme talebi", "Request a meeting")}
          </Link>
        </div>
        <p className="max-w-sm text-xs leading-5 text-cream/55">
          {home
            ? t(locale, home.footerNoteTr, home.footerNoteEn)
            : t(
                locale,
                "Ranz Global özel bir danışmanlık firmasıdır; konsolosluk veya devlet kurumu değildir.",
                "Ranz Global is a private consultancy, not a government or consular office.",
              )}
        </p>
      </div>
    </footer>
  );
}
