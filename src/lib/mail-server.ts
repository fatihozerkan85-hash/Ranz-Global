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
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f6f1e8;font-family:Georgia,'Times New Roman',serif;color:#0c1a2a">
  <div style="max-width:560px;margin:24px auto;background:#fffdf8;border:1px solid #e6dcc8;overflow:hidden">
    <div style="background:#0f2744;padding:18px 28px">
      <p style="margin:0;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#c4a056">Ranz Global</p>
      <p style="margin:4px 0 0;font-size:12px;color:#f6f1e8">Travel &amp; Visa</p>
    </div>
    <div style="padding:28px">
      <h1 style="margin:0 0 16px;font-size:26px;font-weight:400;color:#0f2744">${title}</h1>
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.65;color:#2a3648">${body}</div>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6d675c">Ranz Global vize onayı garantisi vermez. Karar ilgili ülkenin makamlarına aittir.</p>
    </div>
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
    password_reset: {
      subject: "Ranz Global — şifre sıfırlama",
      html: wrap(
        "Şifrenizi yenileyin",
        `<p>Bu isteği siz yapmadıysanız bu maili yok sayın.</p>
         <p>Bağlantı 2 saat geçerlidir. Hesabın kayıtlı olduğu tarayıcıda açın.</p>
         ${link(d.resetUrl || `${base}/giris`, "Yeni şifre belirle")}`,
      ),
    },
    doc_status: {
      subject:
        d.audience === "client"
          ? `${d.destination || "Vize"} dosyanız incelendi`
          : d.status === "rejected"
            ? `Evrak revizyon: ${d.docLabel || "belge"}`
            : d.status === "approved"
              ? `Evrak onaylandı: ${d.docLabel || "belge"}`
              : `Evrak yüklendi: ${d.docLabel || "belge"}`,
      html: wrap(
        d.audience === "client" ? "Dosyanız incelendi" : d.status === "rejected" ? "Evrak revizyon" : d.status === "approved" ? "Evrak onaylandı" : "Evrak yüklendi",
        d.audience === "client"
          ? `<p>${d.destination || "Vize"} vize dosyanız danışmanınız tarafından incelendi.</p>
             ${d.revisionCount ? `<p>${d.revisionCount} belgeniz için revizyon talebi bulunmaktadır.</p>` : ""}
             <p><strong>${d.docLabel || ""}</strong> — ${d.statusLabel || d.status || ""}</p>
             ${d.note ? `<p>${d.note}</p>` : ""}
             <p>Müşteri panelinize giriş yaparak detayları görüntüleyebilirsiniz.</p>
             ${link(fileHref, "Müşteri paneli")}`
          : `<p>Dosya <strong>${d.fileId || ""}</strong></p>
             <p><strong>${d.docLabel || ""}</strong> — ${d.statusLabel || d.status || ""}</p>
             ${d.note ? `<p>${d.note}</p>` : ""}
             ${link(staffHref, "Dosyayı aç")}`,
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
        `<p>${d.clientName || ""} · ${d.destination || ""}</p><p>Dosya no: ${d.fileId || ""}</p>${link(`${base}/yonetim/kuyruk`, "Kuyruğu aç")}`,
      ),
    },
    all_docs_uploaded: {
      subject: `İnceleme sırası — ${d.fileId || ""}`,
      html: wrap(
        "Zorunlu evraklar yüklendi",
        `<p>${d.fileId || ""} inceleme bekliyor.</p>${link(staffHref, "İncele")}`,
      ),
    },
    docs_submitted: {
      subject:
        d.audience === "admin"
          ? `Kuyruğa dosya geldi — ${d.fileId || ""}`
          : "Dosyalarınız gönderildi",
      html: wrap(
        d.audience === "admin" ? "Kuyruğa dosya geldi" : "Dosyalarınız gönderildi",
        d.audience === "admin"
          ? `<p><strong>${d.clientName || ""}</strong></p>
             <p>E-posta: ${d.clientEmail || ""}</p>
             <p>Hedef: ${d.destination || ""}</p>
             <p>Dosya no: <strong>${d.fileId || ""}</strong></p>
             <p>Gönderilen evraklar:</p>
             <p>${d.docs || ""}</p>
             ${link(`${base}/yonetim/kuyruk`, "Kuyruğu aç")}`
          : `<p>Merhaba ${d.clientName || ""},</p>
             <p>Dosyalarınızdaki evraklar Ranz Global’e gönderildi. İnceleme sürecini panelinizden takip edebilirsiniz.</p>
             <p>Dosya no: <strong>${d.fileId || ""}</strong></p>
             ${link(fileHref, "Dosyayı aç")}`,
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
    contact_form_client: {
      subject: d.locale === "en" ? "We received your request — Ranz Global" : "Talebiniz alındı — Ranz Global",
      html: wrap(
        d.locale === "en" ? "We received your request" : "Talebiniz alındı",
        d.locale === "en"
          ? `<p>Hello ${d.name || ""},</p>
             <p>We received your visa enquiry. Our expert customer representative will contact you as soon as possible.</p>
             <p style="margin:20px 0 0;font-size:13px;color:#6d675c">If you did not send this form, you can ignore this email.</p>`
          : `<p>Merhaba ${d.name || ""},</p>
             <p>Talebiniz alındı. Uzman Müşteri Temsilcimiz sizinle en kısa sürede irtibata geçecektir.</p>
             <p style="margin:20px 0 0;font-size:13px;color:#6d675c">Bu formu siz göndermediyseniz bu e-postayı yok sayabilirsiniz.</p>`,
      ),
    },
    refusal_form: {
      subject: `Vize ret dosyası — ${d.name || ""}`,
      html: wrap(
        "Yeni vize ret dosyası",
        `<p><strong>${d.name || ""}</strong> · ${d.email || ""}</p>
         <p>Dosya no: ${d.fileId || ""}</p>
         <p>Ülke: ${d.country || ""}</p>
         <p>Yıl: ${d.year || ""}</p>
         <p>Madde: ${d.article || ""}</p>
         ${link(`${base}/yonetim/vize-ret`, "Vize ret dosyalarını aç")}`,
      ),
    },
    refusal_form_client: {
      subject: d.locale === "en" ? "We received your refusal file — Ranz Global" : "Ret dosyanız alındı — Ranz Global",
      html: wrap(
        d.locale === "en" ? "We received your refusal file" : "Ret dosyanız alındı",
        d.locale === "en"
          ? `<p>Hello ${d.name || ""},</p>
             <p>We received your visa refusal review request. An advisor will assess the file and contact you.</p>
             <p>Country: ${d.country || ""}</p>
             <p>Year: ${d.year || ""}</p>
             <p>Ground / article: ${d.article || ""}</p>
             <p style="margin:20px 0 0;font-size:13px;color:#6d675c">If you did not send this form, you can ignore this email.</p>`
          : `<p>Merhaba ${d.name || ""},</p>
             <p>Ret değerlendirme talebiniz alındı. Uzmanımız dosyanızı inceleyip sizinle irtibata geçecektir.</p>
             <p>Ülke: ${d.country || ""}</p>
             <p>Yıl: ${d.year || ""}</p>
             <p>Madde: ${d.article || ""}</p>
             <p style="margin:20px 0 0;font-size:13px;color:#6d675c">Bu formu siz göndermediyseniz bu e-postayı yok sayabilirsiniz.</p>`,
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
  const text =
    payload.event === "contact_form_client"
      ? d.locale === "en"
        ? `Hello ${d.name || ""},\n\nWe received your visa enquiry. Our expert customer representative will contact you as soon as possible.`
        : `Merhaba ${d.name || ""},\n\nTalebiniz alındı. Uzman Müşteri Temsilcimiz sizinle en kısa sürede irtibata geçecektir.`
      : payload.event === "refusal_form_client"
        ? d.locale === "en"
          ? `Hello ${d.name || ""},\n\nWe received your visa refusal review request.`
          : `Merhaba ${d.name || ""},\n\nRet değerlendirme talebiniz alındı.`
        : built.subject;
  return {
    subject: built.subject,
    html: built.html,
    text,
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
  const id = result.data?.id;
  let lastEvent = "sent";
  if (id && payload.event === "test") {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const status = await resend.emails.get(id);
      lastEvent = status.data?.last_event || lastEvent;
    } catch {
      /* send already succeeded */
    }
  }
  return { id, lastEvent };
}
