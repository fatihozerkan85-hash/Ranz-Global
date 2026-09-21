import type { Locale } from "./types";
import { t } from "./i18n";

/** Uluslararası format: ülke kodu + numara, başında 0 yok. */
export const WHATSAPP_DISPLAY = "+90 530 925 88 92";
export const WHATSAPP_E164 = (process.env.NEXT_PUBLIC_WHATSAPP_E164 || "905309258892").replace(/\D/g, "") || "905309258892";

export function whatsappHref(locale: Locale, extra?: string) {
  const base = t(
    locale,
    "Merhaba Ranz Global, vize danışmanlığı hakkında bilgi almak istiyorum.",
    "Hello Ranz Global, I would like information about visa consultancy.",
  );
  const text = encodeURIComponent(extra ? `${base}\n${extra}` : base);
  return `https://wa.me/${WHATSAPP_E164}?text=${text}`;
}
