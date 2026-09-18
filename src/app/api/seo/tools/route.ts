import { NextResponse } from "next/server";
import { checkBacklink, crawlSite, listBots, listUptime, logBot, pingUptime, saveUptime, scanCompetitor } from "@/lib/seo-server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function GET(request: Request) {
  const action = new URL(request.url).searchParams.get("action");
  if (action === "bots") return noStore({ bots: await listBots() });
  if (action === "uptime") return noStore({ checks: await listUptime() });
  return noStore({ error: "Geçersiz istek." }, 400);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return noStore({ error: "Geçersiz istek." }, 400);
  }
  const action = String(body.action || "");
  try {
    if (action === "crawl") return noStore(await crawlSite());
    if (action === "competitor") return noStore(await scanCompetitor(String(body.domain || "")));
    if (action === "backlink") return noStore(await checkBacklink(String(body.url || "")));
    if (action === "uptime") {
      const paths = Array.isArray(body.paths) ? body.paths.map((p) => String(p)) : ["/", "/hizmetler", "/iletisim", "/vize-rehberi"];
      const checks = await pingUptime(paths);
      await saveUptime(checks);
      return noStore({ checks });
    }
    if (action === "bot") {
      const expected = process.env.CRON_SECRET || "local";
      if (request.headers.get("x-ranz-seo-ingest") !== expected) {
        return noStore({ error: "Yetkisiz." }, 401);
      }
      const ua = String(body.ua || "");
      if (!ua) return noStore({ error: "UA yok." }, 400);
      return noStore(await logBot({ ua, path: String(body.path || "/"), at: String(body.at || "") || undefined }));
    }
    return noStore({ error: "Geçersiz işlem." }, 400);
  } catch (error) {
    return noStore({ error: (error as Error).message }, 500);
  }
}
