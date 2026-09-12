import { NextResponse } from "next/server";
import { isDeliverableEmail, isMailEventId } from "@/lib/mail-catalog";
import { sendResendMail, type MailPayload } from "@/lib/mail-server";

export async function POST(request: Request) {
  let body: Partial<MailPayload> & { event?: string };
  try {
    body = (await request.json()) as Partial<MailPayload> & { event?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const event = body.event;
  if (!event || (event !== "test" && !isMailEventId(event))) {
    return NextResponse.json({ error: "Bilinmeyen bildirim." }, { status: 400 });
  }

  const to = [...new Set((body.to ?? []).map((item) => item.trim().toLowerCase()))].filter(isDeliverableEmail);
  if (!to.length) {
    return NextResponse.json({ skipped: true, reason: "no-recipient" });
  }
  if (to.length > 5) {
    return NextResponse.json({ error: "Çok fazla alıcı." }, { status: 400 });
  }

  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.data ?? {})) {
    if (typeof value === "string") data[key] = value.slice(0, 4000);
  }

  try {
    await sendResendMail({ event, to, data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Mail gönderilemedi." },
      { status: 500 },
    );
  }
}
