import { NextResponse } from "next/server";
import { authUrl, oauthConfigured } from "@/lib/google-seo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  if (!oauthConfigured()) {
    return NextResponse.redirect(`${origin}/yonetim/seo/gsc?error=missing_oauth`);
  }
  const state = crypto.randomUUID();
  const res = NextResponse.redirect(authUrl(request, state));
  res.cookies.set("ranz_g_oauth", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https"),
    path: "/",
    maxAge: 600,
  });
  return res;
}
