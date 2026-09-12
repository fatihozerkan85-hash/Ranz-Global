"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WhatsAppFloat } from "@/components/whatsapp-button";
import { useLocale } from "@/lib/locale";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader solid />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat locale={locale} />
    </div>
  );
}

export function GoldEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-[0.32em] text-gold-deep">{children}</p>;
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl space-y-4 text-sm leading-7 text-ink-soft whitespace-pre-line">{children}</div>;
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-gold/30 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <div className="mb-5 h-px w-12 bg-gold" />
        <GoldEyebrow>{eyebrow}</GoldEyebrow>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">{lead}</p>}
      </div>
    </section>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-gold-deep hover:underline">
      {children}
    </Link>
  );
}
