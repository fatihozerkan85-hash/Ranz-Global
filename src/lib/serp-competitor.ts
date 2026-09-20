import { SITE } from "./cms";

export type SerpHit = {
  position: number;
  title: string;
  url: string;
  domain: string;
};

export type SerpQueryRow = {
  query: string;
  ourPosition: number | null;
  results: SerpHit[];
  competitorPositions: Record<string, number | null>;
};

export type SerpDomainScore = {
  domain: string;
  ours: boolean;
  page1: number;
  avgPosition: number | null;
};

export type SerpReport = {
  at: string;
  gl: string;
  ourDomain: string;
  queries: SerpQueryRow[];
  scores: SerpDomainScore[];
  gaps: { query: string; leader: string; leaderPos: number }[];
};

export const DEFAULT_SERP_QUERIES = [
  "vize danışmanlığı",
  "Kuzey Kıbrıs Schengen vize danışmanlığı",
  "KKTC Schengen vize",
  "Schengen vize danışmanlığı",
  "İngiltere vize danışmanlığı",
  "ABD vize danışmanlığı",
  "Kanada vize danışmanlığı",
  "vize reddi",
];

function serpKey() {
  return process.env.SERPAPI_API_KEY || process.env.SERPAPI_KEY || "";
}

export function serpConfigured() {
  return Boolean(serpKey());
}

export function hostOf(value: string) {
  const raw = value.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
  return raw.replace(/^www\./, "");
}

export function ourHost() {
  return hostOf(SITE.url);
}

function domainOfUrl(url: string) {
  try {
    return hostOf(new URL(url).hostname);
  } catch {
    return hostOf(url);
  }
}

export function parseQueryList(raw: string, max = 8) {
  return [...new Set(raw.split(/\r?\n/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean))].slice(0, max);
}

export function parseDomainList(raw: string, max = 8) {
  return [...new Set(raw.split(/[\n,]+/).map(hostOf).filter(Boolean))].slice(0, max);
}

type SerpJson = {
  error?: string;
  organic_results?: { position?: number; title?: string; link?: string }[];
};

async function searchGoogle(query: string, gl: string, hl: string): Promise<SerpHit[]> {
  const key = serpKey();
  if (!key) throw new Error("SERPAPI_API_KEY tanımlı değil. SerpAPI hesabından anahtarı Vercel’e ekleyin.");
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("gl", gl);
  url.searchParams.set("hl", hl);
  url.searchParams.set("google_domain", gl === "tr" ? "google.com.tr" : "google.com");
  url.searchParams.set("num", "10");
  url.searchParams.set("api_key", key);
  const res = await fetch(url, { cache: "no-store" });
  const json = (await res.json()) as SerpJson;
  if (!res.ok || json.error) throw new Error(json.error || `SerpAPI ${res.status}`);
  return (json.organic_results ?? [])
    .map((row) => ({
      position: Number(row.position) || 0,
      title: String(row.title || "").slice(0, 180),
      url: String(row.link || ""),
      domain: domainOfUrl(String(row.link || "")),
    }))
    .filter((row) => row.position > 0 && row.url);
}

function positionFor(hits: SerpHit[], domain: string) {
  return hits.find((h) => h.domain === domain)?.position ?? null;
}

function average(nums: number[]) {
  if (!nums.length) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export async function runSerpCompetitorReport(input: {
  queries: string[];
  competitors: string[];
  gl?: string;
  hl?: string;
}): Promise<SerpReport> {
  const gl = input.gl === "us" ? "us" : "tr";
  const hl = input.hl === "en" ? "en" : "tr";
  const ours = ourHost();
  const competitors = input.competitors.map(hostOf).filter((d) => d && d !== ours);
  const queries = input.queries.map((q) => q.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 8);
  if (!queries.length) throw new Error("En az bir arama kelimesi yazın.");
  const rows: SerpQueryRow[] = [];
  for (const query of queries) {
    const results = await searchGoogle(query, gl, hl);
    const competitorPositions: Record<string, number | null> = {};
    for (const domain of competitors) competitorPositions[domain] = positionFor(results, domain);
    rows.push({
      query,
      ourPosition: positionFor(results, ours),
      results,
      competitorPositions,
    });
  }
  const domains = [ours, ...competitors];
  const scores: SerpDomainScore[] = domains.map((domain) => {
    const positions = rows
      .map((row) => (domain === ours ? row.ourPosition : row.competitorPositions[domain]))
      .filter((n): n is number => typeof n === "number");
    return {
      domain,
      ours: domain === ours,
      page1: positions.length,
      avgPosition: average(positions),
    };
  });
  scores.sort((a, b) => b.page1 - a.page1 || (a.avgPosition ?? 99) - (b.avgPosition ?? 99));
  const gaps = rows
    .filter((row) => row.ourPosition == null)
    .map((row) => {
      const leader = Object.entries(row.competitorPositions)
        .filter(([, pos]) => pos != null)
        .sort((a, b) => (a[1] ?? 99) - (b[1] ?? 99))[0];
      if (!leader || leader[1] == null) return null;
      return { query: row.query, leader: leader[0], leaderPos: leader[1] };
    })
    .filter((row): row is { query: string; leader: string; leaderPos: number } => Boolean(row));
  return {
    at: new Date().toISOString(),
    gl,
    ourDomain: ours,
    queries: rows,
    scores,
    gaps,
  };
}
