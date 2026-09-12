import { Resend } from "resend";
import type { MailEventId } from "@/lib/mail-catalog";

export type MailPayload = {
  event: MailEventId | "test";
  to: string[];
  data: Record<string, string>;
};

function siteUrl() {
  return process.env.MAIL_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.ranzglobal.com";
}

function wrap(title: string, body: string) {
  return `<!doctype html>
<html><body style="margin:0;background:#f6f1e8;font-family:Georgia,serif;color:#0c1a2a">
  <div style="max-width:560px;margin:24px auto;background:#fffdf8;border:1px solid #e6dcc8;padding:28px">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8c6d28">Ranz Global</p>
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:400">${title}</h1>
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#2a3648">${body}</div>
    <p style="margin:24px 0 0;font-size:12px;color:#6d675c">Ranz Global vize onayı garantisi vermez. Karar ilgili ülkenin makamlarına aittir.</p>
  </div>
</body></html>`;
}

function link(href: string, label: string) {
  return `<p><a href="${href}" style="color:#0f2744">${label}</a></p>`;
}

export function buildMail(payload: MailPayload): { subject: string; html: string; text: string } {
  const d = payload.data;
  const base = siteUrl().replace(/\/$/, "");
  const fileHref = d.fileId ? `${base}/panel/basvuru/${d.fileId}` : `${base}/giris`;
  const staffHref = d.fileId ? `${base}/danisman/basvuru/${d.fileId}` : `${base}/giris`;

  const map: Record<string, { subject: string; html: string }> = {
    test: {
      subject: "Ranz Global — deneme bildirimi",
      html: wrap("Deneme bildirimi", `<p>Resend bağlantısı çalışıyor.</p>`),
    },
    signup: {
      subject: "Ranz Global hesabınız açıldı",
      html: wrap(
        "Hesabınız hazır",
        `<p>Merhaba ${d.name || ""},</p><p>Kayda alındınız. Dosyanızı panelden takip edebilirsiniz.</p>${link(`${base}/giris`, "Panele gir")}`,
      ),
    },
    doc_status: {
      subject:
        d.status === "rejected"
          ? `Evrak revizyon: ${d.docLabel || "belge"}`
          : d.status === "approved"
            ? `Evrak onaylandı: ${d.docLabel || "belge"}`
            : `Evrak yüklendi: ${d.docLabel || "belge"}`,
      html: wrap(
        d.status === "rejected" ? "Evrak revizyon" : d.status === "approved" ? "Evrak onaylandı" : "Evrak yüklendi",
        `<p>Dosya <strong>${d.fileId || ""}</strong></p>
         <p><strong>${d.docLabel || ""}</strong> — ${d.statusLabel || d.status || ""}</p>
         ${d.note ? `<p>${d.note}</p>` : ""}
         ${link(d.audience === "staff" ? staffHref : fileHref, "Dosyayı aç")}`,
      ),
    },
    advisor_note: {
      subject: `Danışman notu — ${d.fileId || "dosya"}`,
      html: wrap(
        "Danışmanınız yazdı",
        `<p>Dosya <strong>${d.fileId || ""}</strong></p><p>${d.note || ""}</p>${link(fileHref, "Dosyayı aç")}`,
      ),
    },
    advisor_assigned: {
      subject: `Yeni dosya atandı — ${d.fileId || ""}`,
      html: wrap(
        "Size bir dosya atandı",
        `<p>${d.destination || ""} · ${d.clientName || ""}</p><p>Dosya no: ${d.fileId || ""}</p>${link(staffHref, "Kuyruğu aç")}`,
      ),
    },
    assignment_left: {
      subject: `Dosya devredildi — ${d.fileId || ""}`,
      html: wrap(
        "Dosya başka danışmana geçti",
        `<p>${d.fileId || ""} artık sizin kuyruğunuzda değil.</p>`,
      ),
    },
    file_opened: {
      subject: `Yeni dosya — ${d.fileId || ""}`,
      html: wrap(
        "Yeni dosya açıldı",
        `<p>${d.clientName || ""} · ${d.destination || ""}</p><p>Dosya no: ${d.fileId || ""}</p>${link(staffHref, "Dosyayı aç")}`,
      ),
    },
    all_docs_uploaded: {
      subject: `İnceleme sırası — ${d.fileId || ""}`,
      html: wrap(
        "Zorunlu evraklar yüklendi",
        `<p>${d.fileId || ""} inceleme bekliyor.</p>${link(staffHref, "İncele")}`,
      ),
    },
    file_complete: {
      subject: `Dosya tamamlandı — ${d.fileId || ""}`,
      html: wrap(
        "Dosya başvuruya hazır",
        `<p>${d.fileId || ""} · ${d.destination || ""}</p>${link(d.audience === "admin" ? `${base}/yonetim/kuyruk` : fileHref, "Görüntüle")}`,
      ),
    },
    staff_created: {
      subject: "Ranz Global danışman hesabınız",
      html: wrap(
        "Danışman girişiniz",
        `<p>Merhaba ${d.name || ""},</p>
         <p>Giriş: ${d.email || ""}</p>
         ${d.password ? `<p>Şifre: ${d.password}</p>` : ""}
         ${link(`${base}/giris`, "Giriş yap")}`,
      ),
    },
    contact_form: {
      subject: `İletişim formu — ${d.name || ""}`,
      html: wrap(
        "Yeni form",
        `<p>${d.name || ""} · ${d.phone || ""} · ${d.email || ""}</p><p>${d.message || ""}</p>`,
      ),
    },
    fee_changed: {
      subject: `Hizmet bedeli — ${d.fileId || ""}`,
      html: wrap(
        "Bedel güncellendi",
        `<p>${d.fileId || ""}: ${d.fee || ""} TL</p>`,
      ),
    },
  };

  const built = map[payload.event] ?? map.test;
  return {
    subject: built.subject,
    html: built.html,
    text: built.subject,
  };
}

export async function sendResendMail(payload: MailPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY tanımlı değil.");
  }
  const from = process.env.MAIL_FROM || "Ranz Global <onboarding@resend.dev>";
  const replyTo = process.env.MAIL_REPLY_TO || "info@ranzglobal.com";
  const mail = buildMail(payload);
  const resend = new Resend(key);
  const result = await resend.emails.send({
    from,
    to: payload.to,
    replyTo,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}
