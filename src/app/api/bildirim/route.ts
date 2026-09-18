import { NextResponse } from "next/server";
import { isDeliverableEmail, isMailEventId } from "@/lib/mail-catalog";
import { sendResendMail, type MailPayload } from "@/lib/mail-server";
import { clientReviewWhatsApp, sendWhatsAppText } from "@/lib/whatsapp-server";

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
  if (event === "password_reset") {
    return NextResponse.json({ error: "Şifre sıfırlama ayrı uçtan gider." }, { status: 400 });
  }

  const to = [...new Set((body.to ?? []).map((item) => item.trim().toLowerCase()))].filter(isDeliverableEmail);

  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.data ?? {})) {
    if (typeof value === "string") data[key] = value.slice(0, 4000);
  }

  if (!to.length && !data.phone) {
    return NextResponse.json({ skipped: true, reason: "no-recipient" });
  }
  if (to.length > 5) {
    return NextResponse.json({ error: "Çok fazla alıcı." }, { status: 400 });
  }

  try {
    let id: string | undefined;
    let lastEvent = "skipped";
    if (to.length) {
      try {
        const sent = await sendResendMail({ event, to, data });
        id = sent.id;
        lastEvent = sent.lastEvent;
      } catch (error) {
        if (!data.phone) throw error;
        lastEvent = (error as Error).message;
      }
    }
    if (
      data.audience === "client" &&
      data.phone &&
      (event === "doc_status" || event === "advisor_note" || event === "file_complete")
    ) {
      const text =
        event === "advisor_note"
          ? `Ranz Global\nDanışmanınız dosyanıza not ekledi.\n${data.note || ""}\nMüşteri panelinizden görüntüleyebilirsiniz.`
          : event === "file_complete"
            ? `Ranz Global\n${data.destination || "Vize"} dosyanız başvuruya hazır olarak işaretlendi. Detaylar müşteri panelinizde.`
            : clientReviewWhatsApp(data);
      try {
        await sendWhatsAppText(data.phone, text);
      } catch (err) {
        console.error("whatsapp", err);
      }
    }
    return NextResponse.json({ ok: true, id, lastEvent });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Mail gönderilemedi." }, { status: 500 });
  }
}
