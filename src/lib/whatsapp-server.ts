function digits(value: string) {
  return value.replace(/\D/g, "");
}

export async function sendWhatsAppText(to: string | undefined, body: string) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;
  const dest = digits(to || "");
  if (!token || !phoneId || dest.length < 10 || !body.trim()) {
    return { skipped: true as const };
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: dest,
      type: "text",
      text: { preview_url: false, body: body.slice(0, 1024) },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err.slice(0, 400) || "WhatsApp gönderilemedi.");
  }
  return { skipped: false as const };
}

export function clientReviewWhatsApp(data: Record<string, string>) {
  const dest = data.destination || "vize";
  const n = data.revisionCount || "";
  const note = data.note ? `\n${data.note}` : "";
  if (data.status === "rejected") {
    return `Ranz Global\n${dest} vize dosyanız danışmanınız tarafından incelendi.${n ? `\n${n} belgeniz için revizyon talebi bulunmaktadır.` : ""}${note}\nMüşteri panelinize giriş yaparak detayları görüntüleyebilirsiniz.`;
  }
  if (data.status === "approved") {
    return `Ranz Global\n${dest} vize dosyanız güncellendi. ${data.docLabel || "Bir belgeniz"} onaylandı.\nMüşteri panelinizden durumu görüntüleyebilirsiniz.`;
  }
  return `Ranz Global\n${dest} vize dosyanızda bir güncelleme var.\nMüşteri panelinize giriş yaparak detayları görüntüleyebilirsiniz.`;
}
