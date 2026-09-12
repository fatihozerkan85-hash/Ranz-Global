"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { WhatsAppHeaderButton } from "@/components/whatsapp-button";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
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
  const { user } = useAuth();
  const pathname = usePathname();
  const inApp =
    pathname.startsWith("/panel") || pathname.startsWith("/danisman") || pathname.startsWith("/yonetim");
  const fileHref = user
    ? user.role === "admin"
      ? "/yonetim/erp"
      : user.role === "staff"
        ? "/danisman"
        : "/panel"
    : "/giris";

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-navy">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-5">
        <BrandMark onDark />
        {!inApp && (
          <nav className="hidden items-center gap-5 text-[13px] text-cream/80 xl:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-gold">
                {t(locale, item.tr, item.en)}
              </Link>
            ))}
            <Link href={fileHref} className="hover:text-gold">
              {t(locale, "Dosyama Gir", "Open My File")}
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <WhatsAppHeaderButton locale={locale} />
          <LanguageSwitcher compact tone="gold" />
          {!inApp ? (
            <Link href="/kayit" className="btn btn-sm btn-gold btn-header">
              {t(locale, "Başvurumu Başlat", "Start Application")}
            </Link>
          ) : (
            <Link href={fileHref} className="btn btn-sm btn-gold btn-header">
              {t(locale, "Panelim", "My Portal")}
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
