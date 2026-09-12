import { isDeliverableEmail, type MailEventId } from "@/lib/mail-catalog";

export async function notifyMail(
  event: MailEventId | "test",
  to: string | (string | undefined | null)[],
  data: Record<string, string> = {},
) {
  if (typeof window === "undefined") return;
  const recipients = (Array.isArray(to) ? to : [to]).filter(isDeliverableEmail);
  if (!recipients.length) return;
  try {
    await fetch("/api/bildirim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, to: recipients, data }),
    });
  } catch {
    /* mail is best-effort */
  }
}
