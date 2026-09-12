import type { Locale } from "./types";
import { t } from "./i18n";

/** Uluslararası format: ülke kodu + numara, başında 0 yok. Örn. 905551112233 */
export const WHATSAPP_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "";

export function whatsappHref(locale: Locale, extra?: string) {
  const base = t(
    locale,
    "Merhaba Ranz Global, vize danışmanlığı hakkında bilgi almak istiyorum.",
    "Hello Ranz Global, I would like information about visa consultancy.",
  );
  const text = encodeURIComponent(extra ? `${base}\n${extra}` : base);
  const phone = WHATSAPP_E164.replace(/\D/g, "");
  return phone
    ? `https://wa.me/${phone}?text=${text}`
    : `https://wa.me/?text=${text}`;
}
