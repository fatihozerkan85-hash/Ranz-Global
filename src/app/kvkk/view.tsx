"use client";

import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { KVKK_INTRO, KVKK_SECTIONS, KVKK_TITLE_EN, KVKK_TITLE_TR, type KvkkBlock } from "@/lib/kvkk";

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

export default function KvkkView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero eyebrow="KVKK" title={t(locale, KVKK_TITLE_TR, KVKK_TITLE_EN)} />
      <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        {locale !== "tr" ? (
          <p className="mb-8 rounded-2xl border border-line bg-paper p-4 text-sm leading-7 text-ink-soft">
            The official disclosure is the Turkish text below. English is a short guide only; the Turkish version
            prevails.
          </p>
        ) : null}
        <Blocks blocks={KVKK_INTRO} />
        {KVKK_SECTIONS.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="font-serif text-2xl">{section.title}</h2>
            <Blocks blocks={section.blocks} />
          </section>
        ))}
      </article>
    </MarketingShell>
  );
}
