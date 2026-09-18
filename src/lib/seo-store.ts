import type { Locale } from "./types";
import { getGuide, getPage, getPost, saveGuide, savePage, savePost } from "./store";

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
  job.body = visaArticle(job.topic, job.locale);
  job.words = job.body.split(/\s+/).filter(Boolean).length;
  job.status = "draft";
  write(store);
}

function slugify(value: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a" };
  return value
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || `yazi-${Date.now()}`;
}

function visaArticle(topic: string, locale: Locale) {
  if (locale === "en") {
    return [
      `# ${topic}`,
      ``,
      `Ranz Global prepares a personal visa file around “${topic}”. We do not decide visas. Consulates and visa centres do.`,
      ``,
      `## What the file must show`,
      `Officers read identity, travel purpose, funds and ties together. A template pack that ignores your job, family or sponsor usually creates revision notes.`,
      `Start with a valid passport, a clear itinerary and proof of where you will stay. Add bank statements that match the trip length and your income story. If someone sponsors you, their identity and finances sit next to yours — they do not replace you as the applicant.`,
      ``,
      `## How we work`,
      `You open a portal file. We set the checklist for the country and your profile (employee, owner, student, retired or sponsored). You upload PDFs and photos. An advisor marks gaps and contradictions before you use official appointment systems.`,
      `Online forms such as DS-160 or UK visitor questions must match the papers. We help you keep that story consistent. We do not attend interviews in your place and we do not guarantee an outcome.`,
      ``,
      `## After a refusal`,
      `A new application is often possible. Repeating the same weak file is not a plan. We read the refusal grounds and rebuild the pack. Approval still belongs to the authority.`,
      ``,
      `## Fees`,
      `Ranz Global charges for consultancy. Embassy, VAC, biometrics, courier and translation fees are separate and shown before you proceed.`,
      ``,
      `## Next step`,
      `Create an account, start a file for the destination, and upload the first required items. Questions can go through the panel or WhatsApp without promising a visa.`,
    ].join("\n");
  }
  return [
    `# ${topic}`,
    ``,
    `Ranz Global, “${topic}” başlığı etrafında kişiye özel dosya kurar. Vize kararını biz vermeyiz; karar konsolosluk veya yetkili merkeze aittir.`,
    ``,
    `## Dosyada ne durmalı`,
    `Kimlik, seyahat amacı, mali tablo ve dönüş bağları birlikte okunur. Mesleğinizi, aileyi veya sponsoru yok sayan hazır paket çoğu zaman revizyon üretir.`,
    `Geçerli pasaport, net güzergâh ve konaklama ile başlayın. Banka dökümü seyahat süresi ve gelir hikâyesiyle uyumlu olsun. Sponsor varsa kimliği ve mali belgesi sizin yanınızda durur; sizin yerinize başvuran olmaz.`,
    ``,
    `## Nasıl çalışırız`,
    `Panelde dosya açılır. Ülke ve profilinize (çalışan, şirket sahibi, öğrenci, emekli, sponsorlu) göre madde listesi kurulur. PDF ve görselleri yüklersiniz. Danışman, resmi randevu sistemini kullanmadan önce çelişki ve eksiği işaretler.`,
    `DS-160 veya İngiltere ziyaretçi soruları evrakla aynı hikâyeyi anlatmalıdır. Bunu tutarlı tutmanıza yardımcı oluruz. Mülakata sizin yerinize girmeyiz; sonuç garantisi vermeyiz.`,
    ``,
    `## Ret sonrası`,
    `Yeniden başvuru çoğu ülkede mümkündür. Aynı zayıf dosyayı tekrar etmek plan değildir. Ret gerekçesini okuyup paketi yeniden kurarız. Onay yine resmi makama aittir.`,
    ``,
    `## Ücret`,
    `Ranz Global danışmanlık ücreti alır. Konsolosluk, başvuru merkezi, biyometri, kurye ve çeviri ayrıdır; işlemden önce gösterilir.`,
    ``,
    `## Sonraki adım`,
    `Hesap açın, ülke dosyasını başlatın ve zorunlu ilk evrakları yükleyin. Sorular panel veya WhatsApp üzerinden gider; vize sözü yoktur.`,
  ].join("\n");
}

export function publishContent(id: string) {
  const store = read();
  const job = store.queue.find((j) => j.id === id);
  if (!job?.body) return "Önce taslak üretin.";
  const slug = slugify(job.topic);
  const excerpt = job.body.split("\n").map((l) => l.trim()).find((l) => l && !l.startsWith("#")) || job.topic;
  savePost({
    slug,
    titleTr: job.topic,
    titleEn: job.topic,
    excerptTr: excerpt.slice(0, 160),
    excerptEn: excerpt.slice(0, 160),
    bodyTr: job.body,
    bodyEn: job.body,
    coverAltTr: job.topic,
    coverAltEn: job.topic,
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "published",
  });
  job.status = "published";
  write(store);
  return `/blog/${slug}`;
}

function clip(text: string, max: number) {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function fillDesc(current: string, fallback: string) {
  const base = current.trim() || fallback;
  if (base.length >= 70 && base.length <= 155) return base;
  if (base.length > 155) return clip(base, 155);
  return clip(`${base} Ranz Global vize danışmanlığı sunar. Nihai karar resmi makamlara aittir.`, 155);
}

export function applySeoIssue(id: string): string {
  const store = read();
  const issue = store.issues.find((i) => i.id === id);
  if (!issue) return "Kayıt yok.";
  const path = issue.url.split("?")[0];
  const pageSlug = path.replace(/^\//, "");
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  const guideMatch = path.match(/^\/vize-rehberi\/([^/]+)$/);
  if (blogMatch) {
    const post = getPost(blogMatch[1]);
    if (post) {
      if (issue.rule === "title-long" || issue.rule === "title-empty") {
        post.titleTr = clip(post.titleTr || post.titleEn, 55);
        post.titleEn = clip(post.titleEn || post.titleTr, 55);
      }
      if (issue.rule.startsWith("desc") || issue.rule === "og-missing") {
        post.excerptTr = fillDesc(post.excerptTr, post.titleTr);
        post.excerptEn = fillDesc(post.excerptEn, post.titleEn);
      }
      savePost(post);
      issue.status = "applied";
      write(store);
      return `Blog yazısı güncellendi: /blog/${post.slug}`;
    }
  }
  if (guideMatch) {
    const guide = getGuide(guideMatch[1]);
    if (guide) {
      if (issue.rule === "title-long" || issue.rule === "title-empty") {
        guide.titleTr = clip(guide.titleTr, 55);
        guide.titleEn = clip(guide.titleEn, 55);
      }
      if (issue.rule.startsWith("desc") || issue.rule === "og-missing") {
        guide.descriptionTr = fillDesc(guide.descriptionTr, guide.titleTr);
        guide.descriptionEn = fillDesc(guide.descriptionEn, guide.titleEn);
      }
      saveGuide(guide);
      issue.status = "applied";
      write(store);
      return `Rehber güncellendi: /vize-rehberi/${guide.slug}`;
    }
  }
  const page = ["hakkimizda", "hizmetler", "iletisim", "kvkk", "gizlilik", "randevu"].includes(pageSlug)
    ? getPage(pageSlug)
    : undefined;
  if (page) {
    if (issue.rule === "title-long" || issue.rule === "title-empty") {
      page.titleTr = clip(page.titleTr, 55);
      page.titleEn = clip(page.titleEn, 55);
    }
    if (issue.rule.startsWith("desc") || issue.rule === "og-missing") {
      page.descriptionTr = fillDesc(page.descriptionTr, page.titleTr);
      page.descriptionEn = fillDesc(page.descriptionEn, page.titleEn);
    }
    savePage(page);
    issue.status = "applied";
    write(store);
    return `Sayfa güncellendi: /${page.slug}`;
  }
  issue.status = "applied";
  write(store);
  return "İşaretlendi. Bu URL kod şablonundan geliyor; metin CMS kaydında yok.";
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

export function removeKeyword(query: string) {
  const store = read();
  store.keywords = store.keywords.filter((k) => k.query !== query);
  write(store);
}

export function addCompetitor(domain: string) {
  const store = read();
  const host = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
  if (!host || store.competitors.length >= 10) return;
  if (store.competitors.some((c) => c.domain === host)) return;
  store.competitors.push({ domain: host, topics: [] });
  write(store);
}

export function setCompetitorTopics(domain: string, topics: string[]) {
  const store = read();
  const row = store.competitors.find((c) => c.domain === domain);
  if (row) row.topics = topics;
  write(store);
}

export function removeCompetitor(domain: string) {
  const store = read();
  store.competitors = store.competitors.filter((c) => c.domain !== domain);
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
  const seen = new Set(store.uptime.map((row) => `${row.at}|${row.url}`));
  const fresh = checks.filter((row) => {
    const key = `${row.at}|${row.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  store.uptime = [...fresh, ...store.uptime].slice(0, 200);
  write(store);
}

export function addUptimeTarget(path: string) {
  const store = read();
  const value = path.startsWith("/") || path.startsWith("http") ? path : `/${path}`;
  if (!store.uptimeTargets.includes(value)) store.uptimeTargets.push(value);
  write(store);
}

export function removeUptimeTarget(path: string) {
  const store = read();
  store.uptimeTargets = store.uptimeTargets.filter((p) => p !== path);
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
  const href = url.trim();
  if (!href) return;
  if (store.backlinks.some((b) => b.url === href)) return;
  store.backlinks.push({ url: href, live: null });
  write(store);
}

export function setBacklinkLive(url: string, live: boolean) {
  const store = read();
  const row = store.backlinks.find((b) => b.url === url || b.url === url.replace(/\/$/, ""));
  const match = row || store.backlinks.find((b) => url.startsWith(b.url) || b.url.startsWith(url));
  if (match) {
    match.live = live;
    match.lastChecked = new Date().toISOString();
  }
  write(store);
}

export function removeBacklink(url: string) {
  const store = read();
  store.backlinks = store.backlinks.filter((b) => b.url !== url);
  write(store);
}

export function setBots(bots: SeoStore["bots"]) {
  const store = read();
  store.bots = bots.slice(0, 250);
  write(store);
}
