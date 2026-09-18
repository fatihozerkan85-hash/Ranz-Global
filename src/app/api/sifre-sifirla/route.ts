import { NextResponse } from "next/server";
import { isDeliverableEmail } from "@/lib/mail-catalog";
import { sendResendMail } from "@/lib/mail-server";
import { signResetToken } from "@/lib/reset-token";

const lastSent = new Map<string, number>();
const COOLDOWN_MS = 60_000;

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isDeliverableEmail(email)) {
    return NextResponse.json({ ok: true });
  }

  const prev = lastSent.get(email) || 0;
  if (Date.now() - prev < COOLDOWN_MS) {
    return NextResponse.json({ ok: true });
  }

  try {
    const token = signResetToken(email);
    const base = (process.env.MAIL_SITE_URL || "https://www.ranzglobal.com").replace(/\/$/, "");
    const resetUrl = `${base}/sifre-yenile?token=${encodeURIComponent(token)}`;
    const sent = await sendResendMail({ event: "password_reset", to: [email], data: { resetUrl } });
    lastSent.set(email, Date.now());
    console.info("password_reset", { to: email, id: sent.id, lastEvent: sent.lastEvent });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("password_reset_failed", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Mail gönderilemedi." },
      { status: 500 },
    );
  }
}
