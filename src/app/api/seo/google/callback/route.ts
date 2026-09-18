import { NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google-seo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const dest = `${origin}/yonetim/seo/gsc`;
  const err = url.searchParams.get("error");
  if (err) return NextResponse.redirect(`${dest}?error=${encodeURIComponent(err)}`);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("cookie") ?? "";
  const expected = decodeURIComponent(cookie.match(/(?:^|;\s*)ranz_g_oauth=([^;]+)/)?.[1] ?? "");
  if (!code || !state || !expected || state !== expected) {
    return NextResponse.redirect(`${dest}?error=oauth_state`);
  }
  try {
    await exchangeCode(request, code);
    const res = NextResponse.redirect(`${dest}?connected=1`);
    res.cookies.set("ranz_g_oauth", "", { path: "/", maxAge: 0 });
    return res;
  } catch (error) {
    return NextResponse.redirect(`${dest}?error=${encodeURIComponent((error as Error).message)}`);
  }
}
