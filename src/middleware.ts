import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const AI =
  /GPTBot|ChatGPT-User|ClaudeBot|anthropic|PerplexityBot|Google-Extended|Bytespider|CCBot|meta-externalagent|Applebot-Extended|Diffbot/i;

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const ua = request.headers.get("user-agent") || "";
  if (!AI.test(ua)) return NextResponse.next();
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api") || path.startsWith("/_next") || path.startsWith("/yonetim") || path.startsWith("/panel") || path.startsWith("/danisman")) {
    return NextResponse.next();
  }
  const url = new URL("/api/seo/tools", request.nextUrl.origin);
  event.waitUntil(
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ranz-seo-ingest": process.env.CRON_SECRET || "local",
      },
      body: JSON.stringify({ action: "bot", ua, path }),
    }).catch(() => undefined),
  );
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)"],
};
