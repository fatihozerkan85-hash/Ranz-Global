export type SchengenCountry = {
  code: string;
  tr: string;
  en: string;
};

/** Schengen Area members. Popular destinations first, then the rest A–Z by English name. */
export const SCHENGEN_COUNTRIES: SchengenCountry[] = [
  { code: "de", tr: "Almanya", en: "Germany" },
  { code: "fr", tr: "Fransa", en: "France" },
  { code: "it", tr: "İtalya", en: "Italy" },
  { code: "es", tr: "İspanya", en: "Spain" },
  { code: "nl", tr: "Hollanda", en: "Netherlands" },
  { code: "gr", tr: "Yunanistan", en: "Greece" },
  { code: "at", tr: "Avusturya", en: "Austria" },
  { code: "be", tr: "Belçika", en: "Belgium" },
  { code: "ch", tr: "İsviçre", en: "Switzerland" },
  { code: "pt", tr: "Portekiz", en: "Portugal" },
  { code: "dk", tr: "Danimarka", en: "Denmark" },
  { code: "se", tr: "İsveç", en: "Sweden" },
  { code: "no", tr: "Norveç", en: "Norway" },
  { code: "pl", tr: "Polonya", en: "Poland" },
  { code: "cz", tr: "Çekya", en: "Czechia" },
  { code: "hu", tr: "Macaristan", en: "Hungary" },
  { code: "hr", tr: "Hırvatistan", en: "Croatia" },
  { code: "ro", tr: "Romanya", en: "Romania" },
  { code: "bg", tr: "Bulgaristan", en: "Bulgaria" },
  { code: "fi", tr: "Finlandiya", en: "Finland" },
  { code: "is", tr: "İzlanda", en: "Iceland" },
  { code: "sk", tr: "Slovakya", en: "Slovakia" },
  { code: "si", tr: "Slovenya", en: "Slovenia" },
  { code: "lt", tr: "Litvanya", en: "Lithuania" },
  { code: "lv", tr: "Letonya", en: "Latvia" },
  { code: "ee", tr: "Estonya", en: "Estonia" },
  { code: "lu", tr: "Lüksemburg", en: "Luxembourg" },
  { code: "mt", tr: "Malta", en: "Malta" },
  { code: "li", tr: "Lihtenştayn", en: "Liechtenstein" },
];

export function schengenByCode(code?: string | null) {
  if (!code) return undefined;
  return SCHENGEN_COUNTRIES.find((item) => item.code === code.toLowerCase());
}

export function schengenServiceHref(code: string) {
  if (code === "de") return "/hizmet/almanya";
  if (code === "dk") return "/hizmet/danimarka";
  return `/hizmet/schengen?ulke=${code}`;
}

export function isSchengenServiceSlug(slug: string) {
  return slug === "schengen" || slug === "almanya" || slug === "danimarka";
}
