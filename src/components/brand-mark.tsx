"use client";

import Link from "next/link";
import Image from "next/image";

export function BrandMark({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
      <Image
        src="/logo.jpg"
        alt="Ranz Global"
        width={compact ? 40 : 44}
        height={compact ? 40 : 44}
        className="h-10 w-10 shrink-0 rounded-sm object-cover shadow-[0_4px_12px_-6px_rgba(12,26,42,0.5)] sm:h-11 sm:w-11"
        priority
      />
      <span className="min-w-0 leading-tight">
        <span
          className={`block font-serif text-[1.05rem] tracking-[0.12em] sm:text-[1.45rem] sm:tracking-[0.08em] ${
            onDark ? "text-cream" : "text-ink"
          }`}
        >
          RANZ GLOBAL
        </span>
        <span className="mt-0.5 block text-[8px] font-medium uppercase tracking-[0.2em] text-gold sm:text-[9px] sm:tracking-[0.28em]">
          Travel & Visa
        </span>
      </span>
    </Link>
  );
}
