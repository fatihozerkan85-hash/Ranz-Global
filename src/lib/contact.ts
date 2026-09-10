import type { Locale } from "./types";

/** Uluslararası format: ülke kodu + numara, başında 0 yok. Örn. 905551112233 */
export const WHATSAPP_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "";

export function whatsappHref(locale: Locale) {
  const text = encodeURIComponent(
    locale === "en"
      ? "Hello, I would like information from Ranz Global about visa consultancy."
      : "Merhaba, Ranz Global vize danışmanlığı hakkında bilgi almak istiyorum.",
  );
  const phone = WHATSAPP_E164.replace(/\D/g, "");
  return phone
    ? `https://wa.me/${phone}?text=${text}`
    : `https://wa.me/?text=${text}`;
}
