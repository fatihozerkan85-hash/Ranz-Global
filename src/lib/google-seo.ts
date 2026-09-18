import { get, put, del } from "@vercel/blob";
import { SITE } from "./cms";

const TOKEN_PATH = "ops/google-oauth.json";
const SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
].join(" ");

export type GoogleSeoTokens = {
  refreshToken: string;
  accessToken?: string;
  accessExpiry?: number;
  email?: string;
  gscSiteUrl?: string;
  ga4PropertyId?: string;
  connectedAt?: string;
};

export type GscRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type Ga4Row = { dimension: string; sessions: number; users: number; views: number };

export type GoogleSeoStatus = {
  configured: boolean;
  connected: boolean;
  email?: string;
  gscSiteUrl?: string;
  ga4PropertyId?: string;
  gscSites: string[];
  ga4Properties: { id: string; name: string }[];
  gscQueries: GscRow[];
  gscPages: GscRow[];
  ga4Totals: { sessions: number; users: number; views: number; bounceRate: number } | null;
  ga4Channels: Ga4Row[];
  ga4Landings: Ga4Row[];
  error?: string;
};

function siteUrl() {
  return (process.env.GSC_SITE_URL || `${SITE.url}/`).replace(/\/?$/, "/");
}

export function oauthConfigured() {
  return Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET);
}

export function redirectUriFrom(request: Request) {
  if (process.env.GOOGLE_OAUTH_REDIRECT_URI) return process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const url = new URL(request.url);
  return `${url.origin}/api/seo/google/callback`;
}

export function authUrl(request: Request, state: string) {
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id", process.env.GOOGLE_OAUTH_CLIENT_ID || "");
  u.searchParams.set("redirect_uri", redirectUriFrom(request));
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", SCOPES);
  u.searchParams.set("access_type", "offline");
  u.searchParams.set("prompt", "consent");
  u.searchParams.set("include_granted_scopes", "true");
  u.searchParams.set("state", state);
  return u.toString();
}

async function readTokens(): Promise<GoogleSeoTokens | null> {
  try {
    const result = await get(TOKEN_PATH, { access: "private", useCache: false });
    if (!result?.stream) return null;
    const parsed = JSON.parse(await new Response(result.stream).text()) as GoogleSeoTokens;
    if (!parsed?.refreshToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeTokens(tokens: GoogleSeoTokens) {
  await put(TOKEN_PATH, JSON.stringify(tokens), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export async function clearTokens() {
  try {
    await del(TOKEN_PATH);
  } catch {
    /* missing */
  }
}

async function tokenRequest(body: Record<string, string>) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || "Google token alınamadı.");
  }
  return json;
}

export async function exchangeCode(request: Request, code: string) {
  const json = await tokenRequest({
    code,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    redirect_uri: redirectUriFrom(request),
    grant_type: "authorization_code",
  });
  if (!json.refresh_token) {
    throw new Error("Google yenileme jetonu gelmedi. Bağlantıyı tekrar deneyin (consent).");
  }
  const access = json.access_token!;
  const email = await fetchEmail(access);
  const prev = await readTokens();
  const next: GoogleSeoTokens = {
    refreshToken: json.refresh_token,
    accessToken: access,
    accessExpiry: Date.now() + (json.expires_in ?? 3600) * 1000,
    email,
    connectedAt: new Date().toISOString(),
    gscSiteUrl: prev?.gscSiteUrl,
    ga4PropertyId: prev?.ga4PropertyId || process.env.GA4_PROPERTY_ID,
  };
  const sites = await listGscSites(access);
  next.gscSiteUrl = pickGscSite(sites, next.gscSiteUrl);
  const props = await listGa4Properties(access);
  if (!next.ga4PropertyId && props[0]) next.ga4PropertyId = props[0].id;
  await writeTokens(next);
  return next;
}

async function fetchEmail(access: string) {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access}` },
    });
    const json = (await res.json()) as { email?: string };
    return json.email;
  } catch {
    return undefined;
  }
}

async function accessToken(): Promise<{ token: string; saved: GoogleSeoTokens } | null> {
  const saved = await readTokens();
  if (!saved) return null;
  if (saved.accessToken && saved.accessExpiry && Date.now() < saved.accessExpiry - 60_000) {
    return { token: saved.accessToken, saved };
  }
  const json = await tokenRequest({
    refresh_token: saved.refreshToken,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    grant_type: "refresh_token",
  });
  const next = {
    ...saved,
    accessToken: json.access_token,
    accessExpiry: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  await writeTokens(next);
  return { token: json.access_token!, saved: next };
}

function pickGscSite(sites: string[], preferred?: string) {
  const want = (preferred || siteUrl()).replace(/\/?$/, "/");
  const domain = `sc-domain:${new URL(SITE.url).hostname.replace(/^www\./, "")}`;
  return (
    sites.find((s) => s === preferred) ||
    sites.find((s) => s.replace(/\/?$/, "/") === want) ||
    sites.find((s) => s === SITE.url || s === `${SITE.url}/`) ||
    sites.find((s) => s === domain) ||
    sites[0]
  );
}

async function listGscSites(access: string) {
  const res = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${access}` },
  });
  const json = (await res.json()) as { siteEntry?: { siteUrl: string }[]; error?: { message?: string } };
  if (!res.ok) throw new Error(json.error?.message || "Search Console siteleri alınamadı.");
  return (json.siteEntry ?? []).map((s) => s.siteUrl);
}

async function listGa4Properties(access: string) {
  const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries", {
    headers: { Authorization: `Bearer ${access}` },
  });
  const json = (await res.json()) as {
    accountSummaries?: { propertySummaries?: { property?: string; displayName?: string }[] }[];
    error?: { message?: string };
  };
  if (!res.ok) throw new Error(json.error?.message || "GA4 mülkleri alınamadı.");
  const rows: { id: string; name: string }[] = [];
  for (const acc of json.accountSummaries ?? []) {
    for (const p of acc.propertySummaries ?? []) {
      const id = (p.property || "").replace(/^properties\//, "");
      if (id) rows.push({ id, name: p.displayName || id });
    }
  }
  return rows;
}

function dateRange(days = 28) {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(end.getUTCDate() - days);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

function asRows(json: { rows?: { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }[] }): GscRow[] {
  return (json.rows ?? []).map((r) => ({
    keys: r.keys ?? [],
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));
}

async function gscQuery(access: string, site: string, dimensions: string[]) {
  const { startDate, endDate } = dateRange();
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: 50 }),
    },
  );
  const json = (await res.json()) as {
    rows?: { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }[];
    error?: { message?: string };
  };
  if (!res.ok) throw new Error(json.error?.message || "Search Console raporu alınamadı.");
  return asRows(json);
}

function metric(row: { metricValues?: { value?: string }[] } | undefined, i: number) {
  return Number(row?.metricValues?.[i]?.value || 0);
}

async function ga4Report(access: string, propertyId: string, dimension: string | null) {
  const { startDate, endDate } = dateRange();
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "screenPageViews" }, { name: "bounceRate" }],
      ...(dimension ? { dimensions: [{ name: dimension }], limit: 15 } : {}),
    }),
  });
  const json = (await res.json()) as {
    rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[];
    error?: { message?: string };
  };
  if (!res.ok) throw new Error(json.error?.message || "GA4 raporu alınamadı.");
  return json.rows ?? [];
}

export async function saveSelection(input: { gscSiteUrl?: string; ga4PropertyId?: string }) {
  const saved = await readTokens();
  if (!saved) throw new Error("Google hesabı bağlı değil.");
  await writeTokens({
    ...saved,
    gscSiteUrl: input.gscSiteUrl ?? saved.gscSiteUrl,
    ga4PropertyId: input.ga4PropertyId ?? saved.ga4PropertyId,
  });
}

export async function googleSeoStatus(): Promise<GoogleSeoStatus> {
  const empty: GoogleSeoStatus = {
    configured: oauthConfigured(),
    connected: false,
    gscSites: [],
    ga4Properties: [],
    gscQueries: [],
    gscPages: [],
    ga4Totals: null,
    ga4Channels: [],
    ga4Landings: [],
  };
  if (!empty.configured) {
    empty.error = "GOOGLE_OAUTH_CLIENT_ID ve GOOGLE_OAUTH_CLIENT_SECRET tanımlı değil.";
    return empty;
  }
  try {
    const auth = await accessToken();
    if (!auth) return empty;
    const { token, saved } = auth;
    const errors: string[] = [];
    let gscSites: string[] = [];
    let ga4Properties: { id: string; name: string }[] = [];
    try {
      gscSites = await listGscSites(token);
    } catch (error) {
      errors.push((error as Error).message);
    }
    try {
      ga4Properties = await listGa4Properties(token);
    } catch (error) {
      errors.push((error as Error).message);
    }
    const gscSiteUrl = pickGscSite(gscSites, saved.gscSiteUrl);
    const ga4PropertyId = saved.ga4PropertyId || process.env.GA4_PROPERTY_ID || ga4Properties[0]?.id;
    if (gscSiteUrl !== saved.gscSiteUrl || ga4PropertyId !== saved.ga4PropertyId) {
      await writeTokens({ ...saved, gscSiteUrl, ga4PropertyId });
    }
    const status: GoogleSeoStatus = {
      ...empty,
      connected: true,
      email: saved.email,
      gscSiteUrl,
      ga4PropertyId,
      gscSites,
      ga4Properties,
    };
    if (gscSiteUrl) {
      try {
        const [queries, pages] = await Promise.all([
          gscQuery(token, gscSiteUrl, ["query"]),
          gscQuery(token, gscSiteUrl, ["page"]),
        ]);
        status.gscQueries = queries;
        status.gscPages = pages;
      } catch (error) {
        errors.push((error as Error).message);
      }
    }
    if (ga4PropertyId) {
      try {
        const [totals, channels, landings] = await Promise.all([
          ga4Report(token, ga4PropertyId, null),
          ga4Report(token, ga4PropertyId, "sessionDefaultChannelGroup"),
          ga4Report(token, ga4PropertyId, "landingPagePlusQueryString"),
        ]);
        const t0 = totals[0];
        status.ga4Totals = {
          sessions: metric(t0, 0),
          users: metric(t0, 1),
          views: metric(t0, 2),
          bounceRate: metric(t0, 3),
        };
        status.ga4Channels = channels.map((r) => ({
          dimension: r.dimensionValues?.[0]?.value || "—",
          sessions: metric(r, 0),
          users: metric(r, 1),
          views: metric(r, 2),
        }));
        status.ga4Landings = landings.map((r) => ({
          dimension: r.dimensionValues?.[0]?.value || "—",
          sessions: metric(r, 0),
          users: metric(r, 1),
          views: metric(r, 2),
        }));
      } catch (error) {
        errors.push((error as Error).message);
      }
    }
    if (errors.length) status.error = errors.join(" ");
    return status;
  } catch (error) {
    empty.error = (error as Error).message;
    return empty;
  }
}
