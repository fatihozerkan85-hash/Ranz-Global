import type { Locale } from "./types";

const KEY = "ranz-seo-v2";
const EVENT = "ranz-seo";

export type SeoIssue = {
  id: string;
  url: string;
  rule: string;
  severity: "error" | "warn";
  titleTr: string;
  titleEn: string;
  suggestion: string;
  status: "open" | "approved" | "applied" | "ignored";
};

export type CrawlUrl = {
  url: string;
  status: number;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  noindex: boolean;
  hasOg: boolean;
  hasJsonLd: boolean;
  issues: string[];
};

export type CrawlRun = {
  id: string;
  startedAt: string;
  urls: CrawlUrl[];
};

export type ContentJob = {
  id: string;
  topic: string;
  locale: Locale;
  status: "queued" | "draft" | "scheduled" | "published";
  words: number;
  createdAt: string;
  body: string;
};

export type KeywordRow = {
  query: string;
  locale: "TR" | "US";
  position: number | null;
  clicks: number;
  impressions: number;
  volume: number | null;
  kd: number | null;
};

export type Competitor = {
  domain: string;
  topics: string[];
};

export type UptimeCheck = {
  url: string;
  ok: boolean;
  ms: number;
  at: string;
};

export type EngagementEvent = {
  type: string;
  page: string;
  at: string;
};

export type BacklinkCandidate = {
  url: string;
  live: boolean | null;
  lastChecked?: string;
};

export type SeoStore = {
  crawls: CrawlRun[];
  issues: SeoIssue[];
  queue: ContentJob[];
  keywords: KeywordRow[];
  competitors: Competitor[];
  bots: { ua: string; path: string; at: string; tag: "ai" | "suspect" }[];
  uptime: UptimeCheck[];
  uptimeTargets: string[];
  engagement: EngagementEvent[];
  backlinks: BacklinkCandidate[];
  gscConnected: boolean;
  ga4Connected: boolean;
};

function seed(): SeoStore {
  return {
    crawls: [],
    issues: [],
    queue: [],
    keywords: [],
    competitors: [],
    bots: [],
    uptime: [],
    uptimeTargets: ["/", "/giris", "/hizmetler", "/iletisim"],
    engagement: [],
    backlinks: [],
    gscConnected: false,
    ga4Connected: false,
  };
}

function read(): SeoStore {
  const base = seed();
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      try {
        localStorage.setItem(KEY, JSON.stringify(base));
      } catch {
        /* quota */
      }
      return base;
    }
    const parsed = JSON.parse(raw) as Partial<SeoStore>;
    return {
      ...base,
      ...parsed,
      crawls: parsed.crawls ?? base.crawls,
      issues: parsed.issues ?? base.issues,
      queue: parsed.queue ?? base.queue,
      keywords: parsed.keywords ?? base.keywords,
      competitors: parsed.competitors ?? base.competitors,
      bots: parsed.bots ?? base.bots,
      uptime: parsed.uptime ?? base.uptime,
      uptimeTargets: parsed.uptimeTargets ?? base.uptimeTargets,
      engagement: parsed.engagement ?? base.engagement,
      backlinks: parsed.backlinks ?? base.backlinks,
    };
  } catch {
    return base;
  }
}

function write(store: SeoStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeSeo(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getSeo(): SeoStore {
  return read();
}

export function saveCrawl(run: CrawlRun, issues: SeoIssue[]) {
  const store = read();
  store.crawls.unshift(run);
  store.crawls = store.crawls.slice(0, 8);
  const open = store.issues.filter((i) => i.status === "applied" || i.status === "ignored");
  store.issues = [...issues, ...open.filter((o) => !issues.some((n) => n.id === o.id))];
  write(store);
}

export function setIssueStatus(id: string, status: SeoIssue["status"]) {
  const store = read();
  const issue = store.issues.find((i) => i.id === id);
  if (issue) issue.status = status;
  write(store);
}

export function addContentJob(topic: string, locale: Locale) {
  const store = read();
  store.queue.unshift({
    id: `q-${Date.now()}`,
    topic,
    locale,
    status: "queued",
    words: 0,
    createdAt: new Date().toISOString().slice(0, 10),
    body: "",
  });
  write(store);
}

export function draftContent(id: string) {
  const store = read();
  const job = store.queue.find((j) => j.id === id);
  if (!job) return;
  const body =
    job.locale === "tr"
      ? `# ${job.topic}\n\n## Nelere bakılır\nRanz Global bu konuda size özel evrak listesi açar. Belgeleri panele yüklersiniz; danışman eksikleri işaretler.\n\n## Sonraki adım\nHesap açıp dosya başlatın. Konsolosluk kararı resmi makamlara aittir.`
      : `# ${job.topic}\n\n## What you need\nRanz Global prepares a personal checklist for this topic. Upload documents in the portal; advisors review missing items.\n\n## Next step\nOpen an account and start a file. Consular decisions remain with official authorities.`;
  job.body = body;
  job.words = body.split(/\s+/).length;
  job.status = "draft";
  write(store);
}

export function publishContent(id: string) {
  const store = read();
  const job = store.queue.find((j) => j.id === id);
  if (job) job.status = "published";
  write(store);
}

export function addKeyword(query: string, locale: KeywordRow["locale"]) {
  const store = read();
  if (store.keywords.length >= 200) return;
  store.keywords.push({
    query,
    locale,
    position: null,
    clicks: 0,
    impressions: 0,
    volume: null,
    kd: null,
  });
  write(store);
}

export function addCompetitor(domain: string) {
  const store = read();
  if (store.competitors.length >= 10) return;
  store.competitors.push({ domain, topics: [] });
  write(store);
}

export function setIntegrations(gsc: boolean, ga4: boolean) {
  const store = read();
  store.gscConnected = gsc;
  store.ga4Connected = ga4;
  write(store);
}

export function pushUptime(checks: UptimeCheck[]) {
  const store = read();
  store.uptime = [...checks, ...store.uptime].slice(0, 200);
  write(store);
}

export function trackEngagement(type: string, page: string) {
  const store = read();
  store.engagement.unshift({ type, page, at: new Date().toISOString() });
  store.engagement = store.engagement.slice(0, 400);
  write(store);
}

export function addBacklink(url: string) {
  const store = read();
  store.backlinks.push({ url, live: null });
  write(store);
}

export function setBacklinkLive(url: string, live: boolean) {
  const store = read();
  const row = store.backlinks.find((b) => b.url === url);
  if (row) {
    row.live = live;
    row.lastChecked = new Date().toISOString();
  }
  write(store);
}

export const SITE_PATHS = [
  "/",
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
  "/randevu",
  "/vize-rehberi",
  "/vize-rehberi/schengen",
  "/vize-rehberi/abd",
  "/blog",
  "/blog/schengen-evragi-nasil-hazirlanir",
  "/blog/abd-b1b2-randevu-oncesi",
  "/kvkk",
  "/gizlilik",
  "/giris",
];
