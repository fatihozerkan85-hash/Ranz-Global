"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

const LINKS = [
  { href: "/yonetim/seo", tr: "Özet", en: "Overview" },
  { href: "/yonetim/seo/tarama", tr: "Tarama", en: "Crawl" },
  { href: "/yonetim/seo/onarim", tr: "Onarım", en: "Fixes" },
  { href: "/yonetim/seo/icerik", tr: "İçerik", en: "Content" },
  { href: "/yonetim/seo/kelimeler", tr: "Kelimeler", en: "Keywords" },
  { href: "/yonetim/seo/rakipler", tr: "Rakipler", en: "Competitors" },
  { href: "/yonetim/seo/gsc", tr: "GSC / GA4", en: "GSC / GA4" },
  { href: "/yonetim/seo/botlar", tr: "AI botlar", en: "AI bots" },
  { href: "/yonetim/seo/uptime", tr: "Uptime", en: "Uptime" },
  { href: "/yonetim/seo/etkilesim", tr: "Etkileşim", en: "Engagement" },
  { href: "/yonetim/seo/backlink", tr: "Backlink", en: "Backlinks" },
];

export function SeoNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-3 py-1.5 text-xs ${active ? "bg-navy text-cream" : "bg-navy/55 text-cream"}`}
          >
            {t(locale, l.tr, l.en)}
          </Link>
        );
      })}
    </nav>
  );
}
