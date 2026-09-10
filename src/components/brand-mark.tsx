"use client";

import Link from "next/link";
import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <Image
        src="/logo.jpg"
        alt="Ranz Global"
        width={compact ? 40 : 44}
        height={compact ? 40 : 44}
        className="h-10 w-10 rounded-sm object-cover shadow-[0_4px_12px_-6px_rgba(12,26,42,0.5)] sm:h-11 sm:w-11"
        priority
      />
      <span className="hidden leading-tight sm:block">
        <span className="block font-serif text-[1.35rem] tracking-[0.08em] text-ink sm:text-[1.45rem]">
          RANZ GLOBAL
        </span>
        <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.28em] text-gold-deep">
          Travel & Visa
        </span>
      </span>
    </Link>
  );
}
