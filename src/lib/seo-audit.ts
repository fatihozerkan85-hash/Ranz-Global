import type { CrawlRun, CrawlUrl, SeoIssue } from "./seo-store";
import { SITE_PATHS } from "./seo-store";

function pick(html: string, re: RegExp) {
  return html.match(re)?.[1]?.trim() ?? "";
}

function auditHtml(url: string, status: number, html: string): CrawlUrl {
  const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i).replace(/\s+/g, " ");
  const description = pick(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const canonical = pick(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const robots = pick(html, /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i).toLowerCase();
  const hasOg = /property=["']og:/i.test(html);
  const hasJsonLd = /application\/ld\+json/i.test(html);
  const issues: string[] = [];
  if (status >= 400) issues.push("http");
  if (!title) issues.push("title-empty");
  if (title.length > 65) issues.push("title-long");
  if (!description) issues.push("desc-empty");
  if (description && description.length < 70) issues.push("desc-short");
  if (description && description.length > 160) issues.push("desc-long");
  if (!h1) issues.push("h1-missing");
  if ((html.match(/<h1\b/gi) || []).length > 1) issues.push("h1-multiple");
  if (!hasOg) issues.push("og-missing");
  if (!hasJsonLd) issues.push("jsonld-missing");
  if (!canonical) issues.push("canonical-missing");
  return {
    url,
    status,
    title,
    description,
    h1,
    canonical,
    noindex: robots.includes("noindex"),
    hasOg,
    hasJsonLd,
    issues,
  };
}

const RULES: Record<string, { tr: string; en: string; suggestion: string }> = {
  http: { tr: "HTTP hata kodu", en: "HTTP error status", suggestion: "Sayfayı yayınlayın veya 301 yönlendirin." },
  "title-empty": { tr: "Title boş", en: "Empty title", suggestion: "CMS’ten 50–60 karakter başlık yazın." },
  "title-long": { tr: "Title uzun", en: "Title too long", suggestion: "Başlığı 65 karakterin altına çekin." },
  "desc-empty": { tr: "Meta description yok", en: "Missing meta description", suggestion: "120–155 karakter açıklama ekleyin." },
  "desc-short": { tr: "Description kısa", en: "Description too short", suggestion: "Açıklamayı en az 70 karaktere çıkarın." },
  "desc-long": { tr: "Description uzun", en: "Description too long", suggestion: "Açıklamayı 160 karakterin altına alın." },
  "h1-missing": { tr: "H1 yok", en: "Missing H1", suggestion: "Sayfada tek bir H1 kullanın." },
  "h1-multiple": { tr: "Birden fazla H1", en: "Multiple H1 tags", suggestion: "Tek H1 bırakın, diğerlerini H2 yapın." },
  "og-missing": { tr: "Open Graph yok", en: "Missing Open Graph", suggestion: "og:title ve og:description ekleyin." },
  "jsonld-missing": { tr: "JSON-LD yok", en: "Missing JSON-LD", suggestion: "Organization veya Article şeması ekleyin." },
  "canonical-missing": { tr: "Canonical yok", en: "Missing canonical", suggestion: "Kendine işaret eden canonical ekleyin." },
};

export async function runSiteCrawl(origin: string): Promise<{ run: CrawlRun; issues: SeoIssue[] }> {
  const urls: CrawlUrl[] = [];
  for (const path of SITE_PATHS) {
    const href = `${origin}${path}`;
    try {
      const res = await fetch(href, { cache: "no-store" });
      const html = await res.text();
      urls.push(auditHtml(path, res.status, html));
    } catch {
      urls.push(auditHtml(path, 0, ""));
    }
  }
  const issues: SeoIssue[] = [];
  for (const row of urls) {
    for (const rule of row.issues) {
      const meta = RULES[rule];
      if (!meta) continue;
      issues.push({
        id: `${row.url}:${rule}`,
        url: row.url,
        rule,
        severity: rule === "http" || rule === "title-empty" || rule === "h1-missing" ? "error" : "warn",
        titleTr: meta.tr,
        titleEn: meta.en,
        suggestion: meta.suggestion,
        status: "open",
      });
    }
  }
  return {
    run: {
      id: `c-${Date.now()}`,
      startedAt: new Date().toISOString(),
      urls,
    },
    issues,
  };
}
