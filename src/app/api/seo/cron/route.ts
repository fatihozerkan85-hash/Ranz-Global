import { NextResponse } from "next/server";
import { SITE } from "@/lib/cms";
import { pingUptime, saveUptime } from "@/lib/seo-server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const checks = await pingUptime(["/", "/hizmetler", "/iletisim", "/vize-rehberi", "/blog"]);
  await saveUptime(checks);
  const sitemap = `${SITE.url}/sitemap.xml`;
  await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`),
    fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`),
  ]);
  return NextResponse.json({ ok: true, checks: checks.length, sitemap });
}
