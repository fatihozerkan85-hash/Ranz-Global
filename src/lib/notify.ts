import { isDeliverableEmail, type MailEventId } from "@/lib/mail-catalog";

export async function notifyMail(
  event: MailEventId | "test",
  to: string | (string | undefined | null)[],
  data: Record<string, string> = {},
) {
  if (typeof window === "undefined") return;
  const recipients = (Array.isArray(to) ? to : [to]).filter(isDeliverableEmail);
  if (!recipients.length && !data.phone) return;
  try {
    const res = await fetch("/api/bildirim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, to: recipients, data }),
    });
    if (!res.ok) {
      console.error("notifyMail", event, await res.text());
    }
  } catch {
    /* mail is best-effort */
  }
}

export function notifyClient(
  event: MailEventId,
  client: { email?: string; phone?: string } | undefined,
  data: Record<string, string>,
) {
  void notifyMail(event, [client?.email], { ...data, phone: client?.phone || data.phone || "", audience: "client" });
}
