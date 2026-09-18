import { NextResponse } from "next/server";
import { verifyResetToken } from "@/lib/reset-token";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = verifyResetToken(body.token || "");
  if (!parsed) {
    return NextResponse.json({ error: "Bağlantı geçersiz veya süresi dolmuş." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, email: parsed.email });
}
