"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { portalPath, useAuth } from "@/lib/auth";
import { isPublicSessionUser } from "@/lib/store";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { WhatsAppHeaderButton } from "@/components/whatsapp-button";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StartApplicationLink } from "@/components/start-application-link";
import { DISCLAIMER_EN, DISCLAIMER_TR } from "@/lib/faq";

export { BrandMark };

const NAV = [
  { href: "/#ulkeler", tr: "Vizeler", en: "Visas" },
  { href: "/#nasil", tr: "Nasıl Çalışır?", en: "How It Works" },
  { href: "/#ucret", tr: "Ücretler", en: "Fees" },
  { href: "/vize-rehberi", tr: "Vize Rehberi", en: "Visa Guide" },
  { href: "/hakkimizda", tr: "Hakkımızda", en: "About" },
  { href: "/#iletisim", tr: "İletişim", en: "Contact" },
];

export function SiteHeader({ solid: _solid = false }: { solid?: boolean }) {
  const { locale } = useLocale();
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const inApp =
    pathname.startsWith("/panel") || pathname.startsWith("/danisman") || pathname.startsWith("/yonetim");
  const signedIn = ready && isPublicSessionUser(user);
  const fileHref = signedIn && user ? portalPath(user) : "/giris";
  const welcome =
    signedIn && user
      ? `${t(locale, "Hoşgeldin,", "Welcome,")} ${user.name}`
      : null;

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-navy">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:h-[4.5rem] sm:gap-3 sm:px-5">
        <BrandMark onDark />
        {!inApp && (
          <nav className="hidden items-center gap-5 text-[13px] text-cream/80 xl:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-gold">
                {t(locale, item.tr, item.en)}
              </a>
            ))}
            <a href={fileHref} className="hover:text-gold">
              {t(locale, "Müşteri Paneli", "Client Portal")}
            </a>
          </nav>
        )}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <WhatsAppHeaderButton locale={locale} />
          <LanguageSwitcher compact tone="gold" />
          {!inApp && welcome ? (
            <Link
              href={fileHref}
              className="max-w-[9.5rem] truncate text-right text-[11px] font-medium text-gold sm:max-w-[18rem] sm:text-sm"
              title={welcome}
            >
              {welcome}
            </Link>
          ) : !inApp ? (
            <StartApplicationLink className="btn btn-sm btn-gold btn-header max-[380px]:hidden">
              <span className="sm:hidden">{t(locale, "Başlat", "Start")}</span>
              <span className="hidden sm:inline">{t(locale, "Başvurumu Başlat", "Start Application")}</span>
            </StartApplicationLink>
          ) : (
            <Link href={fileHref} className="btn btn-sm btn-gold btn-header max-[380px]:hidden">
              {t(locale, "Panelim", "My Portal")}
            </Link>
          )}
          {!inApp && (
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full text-cream xl:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>
      {menuOpen && !inApp && (
        <nav className="border-t border-gold/25 bg-navy px-4 py-3 xl:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm text-cream/85 hover:bg-white/5 hover:text-gold"
              >
                {t(locale, item.tr, item.en)}
              </a>
            ))}
            <a href={fileHref} className="rounded-lg px-3 py-2.5 text-sm text-cream/85 hover:bg-white/5 hover:text-gold">
              {welcome ?? t(locale, "Müşteri Paneli", "Client Portal")}
            </a>
            {!welcome && (
              <StartApplicationLink className="mt-1 btn btn-sm btn-gold w-full min-[381px]:hidden">
                {t(locale, "Başvurumu Başlat", "Start Application")}
              </StartApplicationLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useLocale();
  return (
    <footer className="bg-navy text-cream/80">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif tracking-[0.12em] text-cream">RANZ GLOBAL</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gold">Travel & Visa</p>
            <p className="mt-3 max-w-xs text-xs text-cream/70">
              {t(locale, "Dijital vize yönetim platformu ve uzman danışmanlık.", "Digital visa platform and specialist consultancy.")}
            </p>
          </div>
          <div className="flex max-w-md flex-wrap gap-x-4 gap-y-2 text-xs text-cream/70">
            <Link href="/kvkk" className="hover:text-gold">
              {t(locale, "KVKK", "Data Notice")}
            </Link>
            <Link href="/gizlilik" className="hover:text-gold">
              {t(locale, "Gizlilik", "Privacy")}
            </Link>
            <Link href="/mesafeli-hizmet" className="hover:text-gold">
              {t(locale, "Mesafeli Hizmet", "Distance Services")}
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-gold">
              {t(locale, "Çerez Politikası", "Cookies")}
            </Link>
            <Link href="/vize-reddi" className="hover:text-gold">
              {t(locale, "Vize Reddi", "Visa Refusal")}
            </Link>
            <Link href="/hakkimizda" className="hover:text-gold">
              {t(locale, "Hakkımızda", "About")}
            </Link>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-6 text-cream/55">{t(locale, DISCLAIMER_TR, DISCLAIMER_EN)}</p>
        <p className="mt-3 text-xs leading-5 text-cream/45">
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
