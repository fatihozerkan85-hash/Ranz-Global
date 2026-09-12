"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { DISCLAIMER_EN, DISCLAIMER_TR } from "@/lib/faq";

const TEAM = [
  { name: "Berat", roleTr: "Müşteri İlişkileri", roleEn: "Client relations" },
  { name: "", roleTr: "İngiltere & Kanada Vize Uzmanı", roleEn: "UK & Canada visa specialist" },
  { name: "", roleTr: "Schengen Vize Uzmanı", roleEn: "Schengen visa specialist" },
];

export default function AboutView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Ranz Global"
        title={t(locale, "Ranz Global Hakkında", "About Ranz Global")}
        lead={t(
          locale,
          "Dijital vize yönetim platformu ve uzman danışmanlık. Türkiye ve KKTC genelinde.",
          "A digital visa management platform plus specialist consultancy, across Türkiye and the TRNC.",
        )}
      />
      <section className="mx-auto max-w-6xl space-y-12 px-5 py-14">
        <div>
          <h2 className="font-serif text-3xl">{t(locale, "Biz Kimiz?", "Who We Are")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "Ranz Global, vize dosyasını WhatsApp yığınından çıkarıp tek bir panele alan özel bir danışmanlık ekibidir. Konsolosluk, VFS veya devlet kurumu değiliz.",
              "Ranz Global is a private team that moves the visa file out of a WhatsApp pile into one portal. We are not a consulate, VAC or government office.",
            )}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">{t(locale, "Ne Yapıyoruz?", "What We Do")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "Ön değerlendirme, kişiye özel evrak listesi, form desteği, evrak kontrolü ve başvuru öncesi son kontrol. Vize kararını vermeyiz; dosyayı başvuruya hazır hale getiririz.",
              "Preliminary assessment, a personal document list, form support, document review and a final check. We do not decide visas; we get the file ready to apply.",
            )}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">{t(locale, "Hangi Ülkelerde Uzmanız?", "Where We Specialise")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "İngiltere, ABD, Kanada, Schengen (Almanya, Danimarka ve diğer kısa konaklama), BAE/Dubai, Çin ve Rusya ziyaretçi dosyaları.",
              "UK, US, Canada, Schengen (Germany, Denmark and other short-stay), UAE/Dubai, China and Russia visitor files.",
            )}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">{t(locale, "Çalışma Sistemimiz", "How We Work")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "Ülkenizi seçin, ön değerlendirme yapın, ücreti görün, hesabınız açılsın, evrak listesi gelsin, belgelerinizi işaretleyin, danışman kontrol etsin, süreci panelden izleyin. Dijital altyapımız sayesinde Türkiye ve KKTC genelinde vize danışmanlığı sağlıyoruz. Sahte bir fiziki ofis adresi kullanmıyoruz.",
              "Choose a country, run a short assessment, see the fee, open an account, receive a list, mark documents, get advisor review, track the file. We advise across Türkiye and the TRNC through a digital setup. We do not invent a fake office address.",
            )}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">{t(locale, "Ekibimiz", "The Team")}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TEAM.map((person) => (
              <article key={person.roleTr} className="rounded-2xl border border-line bg-paper p-6">
                <p className="font-serif text-2xl">{person.name || t(locale, "Uzman Kadro", "Specialist Desk")}</p>
                <p className="mt-2 text-sm text-ink-soft">{t(locale, person.roleTr, person.roleEn)}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="max-w-2xl text-xs leading-5 text-muted">{t(locale, DISCLAIMER_TR, DISCLAIMER_EN)}</p>
        <Link href="/kayit" className="btn">
          {t(locale, "Vize Başvurumu Başlat", "Start My Visa Application")}
        </Link>
      </section>
    </MarketingShell>
  );
}
