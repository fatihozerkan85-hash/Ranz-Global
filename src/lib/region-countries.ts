import { SCHENGEN_COUNTRIES, schengenByCode, schengenServiceHref } from "./schengen-countries";

export type RegionId = "schengen" | "asya" | "afrika";
export type RegionVisaId = "schengen" | "asia" | "africa";

export type RegionCountry = {
  code: string;
  tr: string;
  en: string;
};

export const REGION_META: Record<
  RegionId,
  {
    visaId: RegionVisaId;
    labelTr: string;
    labelEn: string;
    headingTr: string;
    headingEn: string;
    hintTr: string;
    hintEn: string;
    prevTr: string;
    prevEn: string;
    nextTr: string;
    nextEn: string;
    sliderTr: string;
    sliderEn: string;
  }
> = {
  schengen: {
    visaId: "schengen",
    labelTr: "Schengen",
    labelEn: "Schengen",
    headingTr: "Schengen ülkesi",
    headingEn: "Schengen country",
    hintTr: "Asıl gideceğiniz veya en uzun kalacağınız ülkeyi seçin. Başvuru o ülkenin konsolosluğuna yapılır.",
    hintEn: "Choose the country you will visit, or stay in longest. The application is filed with that consulate.",
    prevTr: "Önceki Schengen ülkeleri",
    prevEn: "Previous Schengen countries",
    nextTr: "Sonraki Schengen ülkeleri",
    nextEn: "Next Schengen countries",
    sliderTr: "Tüm Schengen ülkelerini kaydır",
    sliderEn: "Scroll all Schengen countries",
  },
  asya: {
    visaId: "asia",
    labelTr: "Asya",
    labelEn: "Asia",
    headingTr: "Asya ülkesi",
    headingEn: "Asian country",
    hintTr: "Türkiye pasaportu için vize gerektiren Asya ülkesini seçin. Çin, BAE ve Rusya ayrı hizmet sayfalarındadır.",
    hintEn: "Choose an Asian country that requires a visa for Turkish passports. China, the UAE and Russia have their own service pages.",
    prevTr: "Önceki Asya ülkeleri",
    prevEn: "Previous Asian countries",
    nextTr: "Sonraki Asya ülkeleri",
    nextEn: "Next Asian countries",
    sliderTr: "Tüm Asya ülkelerini kaydır",
    sliderEn: "Scroll all Asian countries",
  },
  afrika: {
    visaId: "africa",
    labelTr: "Afrika",
    labelEn: "Africa",
    headingTr: "Afrika ülkesi",
    headingEn: "African country",
    hintTr: "Türkiye pasaportu için vize gerektiren Afrika ülkesini seçin.",
    hintEn: "Choose an African country that requires a visa for Turkish passports.",
    prevTr: "Önceki Afrika ülkeleri",
    prevEn: "Previous African countries",
    nextTr: "Sonraki Afrika ülkeleri",
    nextEn: "Next African countries",
    sliderTr: "Tüm Afrika ülkelerini kaydır",
    sliderEn: "Scroll all African countries",
  },
};

/** Visa-required destinations for ordinary Turkish passports. China, UAE and Russia stay on their own cards. */
export const ASIA_COUNTRIES: RegionCountry[] = [
  { code: "jp", tr: "Japonya", en: "Japan" },
  { code: "in", tr: "Hindistan", en: "India" },
  { code: "sa", tr: "Suudi Arabistan", en: "Saudi Arabia" },
  { code: "id", tr: "Endonezya", en: "Indonesia" },
  { code: "vn", tr: "Vietnam", en: "Vietnam" },
  { code: "il", tr: "İsrail", en: "Israel" },
  { code: "ir", tr: "İran", en: "Iran" },
  { code: "iq", tr: "Irak", en: "Iraq" },
  { code: "pk", tr: "Pakistan", en: "Pakistan" },
  { code: "bd", tr: "Bangladeş", en: "Bangladesh" },
  { code: "jo", tr: "Ürdün", en: "Jordan" },
  { code: "lb", tr: "Lübnan", en: "Lebanon" },
  { code: "om", tr: "Umman", en: "Oman" },
  { code: "kw", tr: "Kuveyt", en: "Kuwait" },
  { code: "bh", tr: "Bahreyn", en: "Bahrain" },
  { code: "tw", tr: "Tayvan", en: "Taiwan" },
  { code: "lk", tr: "Sri Lanka", en: "Sri Lanka" },
  { code: "np", tr: "Nepal", en: "Nepal" },
  { code: "kh", tr: "Kamboçya", en: "Cambodia" },
  { code: "la", tr: "Laos", en: "Laos" },
  { code: "mm", tr: "Myanmar", en: "Myanmar" },
  { code: "mn", tr: "Moğolistan", en: "Mongolia" },
  { code: "bt", tr: "Bhutan", en: "Bhutan" },
  { code: "tm", tr: "Türkmenistan", en: "Turkmenistan" },
  { code: "af", tr: "Afganistan", en: "Afghanistan" },
  { code: "sy", tr: "Suriye", en: "Syria" },
  { code: "ye", tr: "Yemen", en: "Yemen" },
  { code: "kp", tr: "Kuzey Kore", en: "North Korea" },
];

/** Visa-required destinations for ordinary Turkish passports. Visa-free Morocco and Tunisia are omitted. */
export const AFRICA_COUNTRIES: RegionCountry[] = [
  { code: "eg", tr: "Mısır", en: "Egypt" },
  { code: "za", tr: "Güney Afrika", en: "South Africa" },
  { code: "ng", tr: "Nijerya", en: "Nigeria" },
  { code: "ke", tr: "Kenya", en: "Kenya" },
  { code: "dz", tr: "Cezayir", en: "Algeria" },
  { code: "ly", tr: "Libya", en: "Libya" },
  { code: "et", tr: "Etiyopya", en: "Ethiopia" },
  { code: "gh", tr: "Gana", en: "Ghana" },
  { code: "tz", tr: "Tanzanya", en: "Tanzania" },
  { code: "ug", tr: "Uganda", en: "Uganda" },
  { code: "ao", tr: "Angola", en: "Angola" },
  { code: "cm", tr: "Kamerun", en: "Cameroon" },
  { code: "sd", tr: "Sudan", en: "Sudan" },
  { code: "cd", tr: "Kongo DC", en: "DR Congo" },
  { code: "cg", tr: "Kongo", en: "Congo" },
  { code: "ga", tr: "Gabon", en: "Gabon" },
  { code: "ci", tr: "Fildişi Sahili", en: "Côte d’Ivoire" },
  { code: "mg", tr: "Madagaskar", en: "Madagascar" },
  { code: "mz", tr: "Mozambik", en: "Mozambique" },
  { code: "zw", tr: "Zimbabve", en: "Zimbabwe" },
  { code: "bw", tr: "Botsvana", en: "Botswana" },
  { code: "na", tr: "Namibya", en: "Namibia" },
  { code: "rw", tr: "Ruanda", en: "Rwanda" },
  { code: "td", tr: "Çad", en: "Chad" },
  { code: "er", tr: "Eritre", en: "Eritrea" },
  { code: "ml", tr: "Mali", en: "Mali" },
  { code: "bf", tr: "Burkina Faso", en: "Burkina Faso" },
  { code: "gn", tr: "Gine", en: "Guinea" },
  { code: "sl", tr: "Sierra Leone", en: "Sierra Leone" },
];

export const REGION_IDS: RegionId[] = ["schengen", "asya", "afrika"];

export function countriesForRegion(region: RegionId): RegionCountry[] {
  if (region === "schengen") return SCHENGEN_COUNTRIES;
  if (region === "asya") return ASIA_COUNTRIES;
  return AFRICA_COUNTRIES;
}

export function regionByCode(region: RegionId, code?: string | null) {
  if (!code) return undefined;
  const key = code.toLowerCase();
  if (region === "schengen") return schengenByCode(key);
  return countriesForRegion(region).find((item) => item.code === key);
}

export function findRegionCountry(code?: string | null) {
  if (!code) return undefined;
  for (const region of REGION_IDS) {
    const country = regionByCode(region, code);
    if (country) {
      return { region, visaId: REGION_META[region].visaId, country };
    }
  }
  return undefined;
}

export function regionServiceHref(region: RegionId, code: string) {
  if (region === "schengen") return schengenServiceHref(code);
  return `/hizmet/${region}?ulke=${code}`;
}

export function slugToRegion(slug?: string | null): RegionId | undefined {
  if (!slug) return undefined;
  if (slug === "schengen" || slug === "almanya" || slug === "danimarka") return "schengen";
  if (slug === "asya" || slug === "afrika") return slug;
  return undefined;
}

export function isRegionServiceSlug(slug: string) {
  return Boolean(slugToRegion(slug));
}

export function isRegionVisaId(id: string): id is RegionVisaId {
  return id === "schengen" || id === "asia" || id === "africa";
}

export function visaIdToRegion(id: RegionVisaId): RegionId {
  if (id === "asia") return "asya";
  if (id === "africa") return "afrika";
  return "schengen";
}

export function regionMemberFromService(slug: string, ulke?: string | null) {
  if (slug === "almanya") return { region: "schengen" as const, country: schengenByCode("de") };
  if (slug === "danimarka") return { region: "schengen" as const, country: schengenByCode("dk") };
  const region = slugToRegion(slug);
  if (!region) return undefined;
  return { region, country: regionByCode(region, ulke) };
}
