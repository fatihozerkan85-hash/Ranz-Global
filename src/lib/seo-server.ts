import { get, put } from "@vercel/blob";
import { AI_BOT_UA } from "./ai-bots";
import { DEFAULT_GUIDES, SITE } from "./cms";
import { SERVICES } from "./services";
import { listBlogPosts } from "./blog-server";
import { auditHtml, issuesFromUrls } from "./seo-audit";
import type { CrawlRun, EngagementEvent, SeoIssue, UptimeCheck } from "./seo-store";

const BOTS_PATH = "ops/seo-bots.json";
const ENGAGE_PATH = "ops/seo-engagement.json";
const ENGAGE_TYPES = new Set(["whatsapp", "phone", "email", "form"]);

export type SeoBotHit = { ua: string; path: string; at: string; tag: "ai" | "suspect" };

export async function crawlPaths() {
  const posts = await listBlogPosts();
  return [
    "/",
    "/hizmetler",
    "/hakkimizda",
    "/iletisim",
    "/randevu",
    "/vize-rehberi",
    "/blog",
    "/vize-reddi",
    "/mesafeli-hizmet",
    "/cerez-politikasi",
    "/kvkk",
    "/gizlilik",
    ...SERVICES.map((s) => `/hizmet/${s.slug}`),
    ...DEFAULT_GUIDES.map((g) => `/vize-rehberi/${g.slug}`),
    ...posts.filter((p) => p.status === "published").map((p) => `/blog/${p.slug}`),
  ];
}

export function publicOrigin() {
  return SITE.url.replace(/\/$/, "");
}

async function fetchPage(href: string) {
  const res = await fetch(href, {
    cache: "no-store",
    redirect: "follow",
    headers: { "User-Agent": "RanzGlobalSEOBot/1.0" },
  });
  const html = await res.text();
  return { status: res.status, html, finalUrl: res.url };
}

export async function crawlSite(): Promise<{ run: CrawlRun; issues: SeoIssue[] }> {
  const origin = publicOrigin();
  const urls = [];
  for (const path of await crawlPaths()) {
    try {
      const { status, html } = await fetchPage(`${origin}${path}`);
      urls.push(auditHtml(path, status, html));
    } catch {
      urls.push(auditHtml(path, 0, ""));
    }
  }
  return {
    run: { id: `c-${Date.now()}`, startedAt: new Date().toISOString(), urls },
    issues: issuesFromUrls(urls),
  };
}

function stripTags(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

export async function scanCompetitor(domain: string) {
  const host = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!host) throw new Error("Domain gerekli.");
  const href = `https://${host}/`;
  const { status, html } = await fetchPage(href);
  const text = stripTags(html);
  const title =
    html
      .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim() || host;
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  const links = [...html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 8 && s.length < 80);
  const keywords = ["vize", "visa", "schengen", "evrak", "danışman", "passport", "oturum"];
  const fromText = text
    .split(/[\n.!?;]+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 20 && s.length < 90 && keywords.some((k) => s.toLowerCase().includes(k)));
  const topics = [...new Set([...h1s, ...links.filter((l) => keywords.some((k) => l.toLowerCase().includes(k))), ...fromText])]
    .slice(0, 8);
  return {
    domain: host,
    ok: status < 400,
    title,
    topics: topics.length ? topics : [`${host} vize danışmanlığı`, "Evrak listesi", "Randevu hazırlığı"],
  };
}

export async function checkBacklink(url: string) {
  const href = url.startsWith("http") ? url : `https://${url}`;
  try {
    const { status, html } = await fetchPage(href);
    const reachable = status > 0 && status < 400;
    const mentions = /ranzglobal\.com|ranz global/i.test(html);
    return { url: href, reachable, mentions, status, live: reachable };
  } catch {
    return { url: href, reachable: false, mentions: false, status: 0, live: false };
  }
}

const UPTIME_PATH = "ops/seo-uptime.json";

export async function listUptime(): Promise<UptimeCheck[]> {
  try {
    const result = await get(UPTIME_PATH, { access: "private", useCache: false });
    if (!result?.stream) return [];
    const parsed = JSON.parse(await new Response(result.stream).text()) as UptimeCheck[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveUptime(checks: UptimeCheck[]) {
  const prev = await listUptime();
  const next = [...checks, ...prev].slice(0, 200);
  await put(UPTIME_PATH, JSON.stringify(next), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  return next;
}

export async function pingUptime(paths: string[]): Promise<UptimeCheck[]> {
  const origin = publicOrigin();
  const checks: UptimeCheck[] = [];
  for (const path of paths) {
    const href = path.startsWith("http") ? path : `${origin}${path.startsWith("/") ? path : `/${path}`}`;
    const t0 = Date.now();
    try {
      const res = await fetch(href, { cache: "no-store", redirect: "follow", method: "GET" });
      checks.push({ url: path, ok: res.ok, ms: Date.now() - t0, at: new Date().toISOString() });
    } catch {
      checks.push({ url: path, ok: false, ms: Date.now() - t0, at: new Date().toISOString() });
    }
  }
  return checks;
}

async function readBots(): Promise<SeoBotHit[]> {
  try {
    const result = await get(BOTS_PATH, { access: "private", useCache: false });
    if (!result?.stream) return [];
    const parsed = JSON.parse(await new Response(result.stream).text()) as SeoBotHit[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function listBots() {
  return readBots();
}

export function classifyBot(ua: string): "ai" | "suspect" {
  if (AI_BOT_UA.test(ua)) {
    return "ai";
  }
  return "suspect";
}

export async function logBot(hit: { ua: string; path: string; at?: string }) {
  const ua = hit.ua.slice(0, 240);
  const path = hit.path.slice(0, 180) || "/";
  const row: SeoBotHit = { ua, path, at: hit.at || new Date().toISOString(), tag: classifyBot(ua) };
  const prev = await readBots();
  const next = [row, ...prev].slice(0, 250);
  await put(BOTS_PATH, JSON.stringify(next), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  return row;
}

async function readEngagement(): Promise<EngagementEvent[]> {
  try {
    const result = await get(ENGAGE_PATH, { access: "private", useCache: false });
    if (!result?.stream) return [];
    const parsed = JSON.parse(await new Response(result.stream).text()) as EngagementEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function listEngagement() {
  return readEngagement();
}

export async function logEngagement(hit: { type: string; page: string }) {
  const type = ENGAGE_TYPES.has(hit.type) ? hit.type : null;
  if (!type) throw new Error("Geçersiz etkileşim.");
  const page = (hit.page || "/").slice(0, 180);
  const row: EngagementEvent = { type, page, at: new Date().toISOString() };
  const next = [row, ...(await readEngagement())].slice(0, 400);
  await put(ENGAGE_PATH, JSON.stringify(next), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  return row;
}
