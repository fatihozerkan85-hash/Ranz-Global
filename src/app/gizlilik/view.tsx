"use client";

import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import type { KvkkBlock } from "@/lib/kvkk";
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE_EN,
  PRIVACY_TITLE_TR,
} from "@/lib/privacy";

function Blocks({ blocks }: { blocks: KvkkBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className="mt-4 text-sm leading-7 text-ink-soft">
              {block.tr}
            </p>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="mt-8 font-serif text-xl">
              {block.tr}
            </h3>
          );
        }
        return (
          <ul key={i} className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-soft">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

export default function PrivacyView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero eyebrow={t(locale, "Gizlilik", "Privacy")} title={t(locale, PRIVACY_TITLE_TR, PRIVACY_TITLE_EN)} />
      <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        {locale !== "tr" ? (
          <p className="mb-8 rounded-2xl border border-line bg-paper p-4 text-sm leading-7 text-ink-soft">
            The official policy is the Turkish text below. English is a short guide only; the Turkish version prevails.
          </p>
        ) : null}
        <Blocks blocks={PRIVACY_INTRO} />
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="font-serif text-2xl">{section.title}</h2>
            <Blocks blocks={section.blocks} />
          </section>
        ))}
      </article>
    </MarketingShell>
  );
}
