"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DISCLAIMER_EN, DISCLAIMER_TR } from "@/lib/faq";
import { StartApplicationLink } from "@/components/start-application-link";
import { GUIDE_CTA, relatedGuides, type GuideBlock, type VisaGuide } from "@/lib/visa-guides";

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  return null;
}

function withLinks(text: string) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const href = safeHref(match[2]);
    parts.push(
      href ? (
        <Link key={`${href}-${i}`} href={href} className="text-gold-deep underline-offset-2 hover:underline">
          {match[1]}
        </Link>
      ) : (
        match[1]
      ),
    );
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Blocks({ blocks }: { blocks: GuideBlock[] }) {
  const { locale } = useLocale();
  return (
    <div className="max-w-2xl space-y-5 text-sm leading-7 text-ink-soft">
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2 key={i} className="pt-4 font-serif text-2xl text-ink sm:text-[1.65rem]">
              {t(locale, block.tr, block.en)}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="pt-2 font-serif text-lg text-ink">
              {t(locale, block.tr, block.en)}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item.tr}>{t(locale, item.tr, item.en)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {withLinks(t(locale, block.tr, block.en))}
          </p>
        );
      })}
    </div>
  );
}

export function GuideCta({ region }: { region?: string }) {
  const { locale } = useLocale();
  return (
    <section className="mt-14 rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">{t(locale, GUIDE_CTA.titleTr, GUIDE_CTA.titleEn)}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">{t(locale, GUIDE_CTA.leadTr, GUIDE_CTA.leadEn)}</p>
      <p className="mt-4 text-sm text-ink-soft">{t(locale, "Ranz Global ile:", "With Ranz Global:")}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-soft">
        {(locale === "en" ? GUIDE_CTA.pointsEn : GUIDE_CTA.pointsTr).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-gold-deep">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <StartApplicationLink className="btn mt-8" region={region}>
        {t(locale, GUIDE_CTA.buttonTr, GUIDE_CTA.buttonEn)}
      </StartApplicationLink>
      <p className="mt-5 max-w-2xl text-[11px] leading-5 text-muted">{t(locale, DISCLAIMER_TR, DISCLAIMER_EN)}</p>
    </section>
  );
}

export function RelatedGuides({ guide }: { guide: VisaGuide }) {
  const { locale } = useLocale();
  const rows = relatedGuides(guide);
  if (!rows.length) return null;
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl text-ink">{t(locale, "İlgili Rehberler", "Related Guides")}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.href}>
            <Link href={row.href} className="block rounded-2xl border border-line bg-paper px-5 py-4 text-sm hover:border-gold">
              {t(locale, row.titleTr, row.titleEn)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GuideArticle({ guide }: { guide: VisaGuide }) {
  return (
    <>
      <Blocks blocks={guide.blocks} />
      <RelatedGuides guide={guide} />
      <GuideCta region={guide.serviceRegion} />
    </>
  );
}
