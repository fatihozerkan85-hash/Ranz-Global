"use client";

import Link from "next/link";
import type { ReactNode } from "react";

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    if (url.hostname === "www.ranzglobal.com" || url.hostname === "ranzglobal.com") return href;
  } catch {
    /* ignore */
  }
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

export function ArticleBody({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="max-w-2xl space-y-4 text-sm leading-7 text-ink-soft">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="pt-2 font-serif text-lg text-ink">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-4 font-serif text-2xl text-ink">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={i} className="font-serif text-2xl text-ink">
              {block.slice(2)}
            </h2>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {withLinks(block.replace(/^[-*]\s/gm, "• "))}
          </p>
        );
      })}
    </div>
  );
}
