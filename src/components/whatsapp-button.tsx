"use client";

import type { Locale } from "@/lib/types";
import { whatsappHref } from "@/lib/contact";
import { t } from "@/lib/i18n";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.83c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"
      />
    </svg>
  );
}

export function WhatsAppHeaderButton({ locale }: { locale: Locale }) {
  return (
    <a
      href={whatsappHref(locale)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white transition hover:brightness-95"
      title="WhatsApp"
    >
      <WhatsAppGlyph className="h-[18px] w-[18px]" />
    </a>
  );
}

export function WhatsAppFloat({ locale }: { locale: Locale }) {
  return (
    <a
      href={whatsappHref(locale)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition hover:brightness-95"
      aria-label={t(locale, "WhatsApp ile yazın", "Chat on WhatsApp")}
    >
      <WhatsAppGlyph className="h-7 w-7" />
      <span className="pr-1 text-sm font-medium">
        {t(locale, "WhatsApp", "WhatsApp")}
      </span>
    </a>
  );
}
