export type BlogArticle = {
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  bodyTr: string;
  bodyEn: string;
};

export function slugifyTopic(value: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a" };
  return (
    value
      .toLowerCase()
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 72) || `yazi-${Date.now()}`
  );
}

export function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function clipText(text: string, max: number) {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function isUsableArticle(article: BlogArticle | null | undefined): article is BlogArticle {
  if (!article) return false;
  const fields = [article.titleTr, article.titleEn, article.excerptTr, article.excerptEn, article.bodyTr, article.bodyEn];
  if (fields.some((f) => !String(f || "").trim())) return false;
  return wordCount(article.bodyTr) >= 400 && wordCount(article.bodyEn) >= 400;
}

export function previewBody(article: BlogArticle, locale: string) {
  return locale === "en" ? article.bodyEn : article.bodyTr;
}
