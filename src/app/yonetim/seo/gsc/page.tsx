"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { useGoogleSeo } from "@/lib/google-seo-client";

function fmt(n: number, digits = 0) {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: digits });
}

export default function GscPage() {
  const { locale } = useLocale();
  const { data, loading, refresh } = useGoogleSeo();
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setFlash(p.get("connected") === "1");
    setOauthError(p.get("error"));
  }, []);

  useEffect(() => {
    if (flash) void refresh();
  }, [flash, refresh]);

  const onSelect = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/seo/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gscSiteUrl: String(form.get("gscSiteUrl") || ""),
        ga4PropertyId: String(form.get("ga4PropertyId") || ""),
      }),
    });
    await refresh();
    setBusy(false);
  };

  const disconnect = async () => {
    setBusy(true);
    await fetch("/api/seo/google", { method: "DELETE" });
    await refresh();
    setBusy(false);
  };

  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">Search Console / Analytics</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        {t(
          locale,
          "Google hesabını bağlayın. Son 28 günün sorgu, sayfa, oturum ve kanal verisi bu panele düşer.",
          "Connect the Google account. Last 28 days of queries, pages, sessions and channels appear here.",
        )}
      </p>

      {flash && (
        <p className="mt-4 rounded-xl border border-gold bg-paper px-4 py-3 text-sm">
          {t(locale, "Google hesabı bağlandı.", "Google account connected.")}
        </p>
      )}
      {(oauthError || data.error) && (
        <p className="mt-4 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-[#8a3b24]">
          {oauthError === "missing_oauth"
            ? t(
                locale,
                "Önce Google OAuth istemci kimliği ve sırrını Vercel ortam değişkenlerine ekleyin.",
                "Add the Google OAuth client ID and secret to Vercel environment variables first.",
              )
            : oauthError === "oauth_state"
              ? t(locale, "OAuth doğrulaması başarısız. Tekrar bağlayın.", "OAuth check failed. Connect again.")
              : oauthError || data.error}
        </p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">Google Search Console</h2>
          <p className="mt-2 text-sm text-muted">
            {loading
              ? "…"
              : data.connected
                ? t(locale, "Bağlı", "Connected") + (data.email ? ` · ${data.email}` : "")
                : t(locale, "Bağlı değil", "Not connected")}
          </p>
          {data.gscSiteUrl && <p className="mt-1 text-xs text-muted">{data.gscSiteUrl}</p>}
        </div>
        <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">GA4</h2>
          <p className="mt-2 text-sm text-muted">
            {data.connected && data.ga4PropertyId
              ? `${t(locale, "Mülk", "Property")} ${data.ga4PropertyId}`
              : t(locale, "Mülk seçilmedi", "No property selected")}
          </p>
          {data.ga4Totals && (
            <p className="mt-2 text-sm">
              {fmt(data.ga4Totals.sessions)} {t(locale, "oturum", "sessions")} · {fmt(data.ga4Totals.users)}{" "}
              {t(locale, "kullanıcı", "users")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href="/api/seo/google/start" className="btn">
          {data.connected ? t(locale, "Yeniden bağla", "Reconnect") : t(locale, "Google ile bağla", "Connect with Google")}
        </a>
        {data.connected && (
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm" disabled={busy} onClick={() => void disconnect()}>
            {t(locale, "Bağlantıyı kes", "Disconnect")}
          </button>
        )}
      </div>

      {!data.configured && (
        <ol className="mt-8 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
          <li>{t(locale, "Google Cloud’da bir proje açın ve Search Console API + Google Analytics Data API + Admin API’yi açın.", "Create a Google Cloud project and enable Search Console API, Analytics Data API and Admin API.")}</li>
          <li>{t(locale, "OAuth istemcisi (Web) oluşturun. Yönlendirme: /api/seo/google/callback", "Create a Web OAuth client. Redirect: /api/seo/google/callback")}</li>
          <li>GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET</li>
          <li>{t(locale, "Aynı Google hesabını Search Console ve GA4 mülküne ekleyin.", "Add the same Google account to Search Console and the GA4 property.")}</li>
        </ol>
      )}

      {data.connected && (
        <form onSubmit={(e) => void onSelect(e)} className="mt-8 grid gap-4 rounded-2xl border border-line bg-paper p-6 md:grid-cols-2">
          <label className="block text-sm">
            Search Console
            <select name="gscSiteUrl" defaultValue={data.gscSiteUrl} className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5">
              {data.gscSites.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            GA4
            <select name="ga4PropertyId" defaultValue={data.ga4PropertyId} className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2.5">
              {data.ga4Properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="btn" disabled={busy}>
              {t(locale, "Kaydet ve yenile", "Save and refresh")}
            </button>
          </div>
        </form>
      )}

      {data.connected && !loading && data.gscQueries.length === 0 && (
        <p className="mt-8 text-sm text-muted">
          {t(locale, "Bu mülkte henüz Search Console sorgusu yok. Dizinleme sonrası dolacaktır.", "No Search Console queries on this property yet. They appear after indexing.")}
        </p>
      )}
      {data.gscQueries.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">{t(locale, "Sorgular", "Queries")}</h2>
          <Table
            heads={[t(locale, "Kelime", "Query"), t(locale, "Tıklama", "Clicks"), t(locale, "Gösterim", "Impr."), t(locale, "Sıra", "Pos")]}
            rows={data.gscQueries.map((r) => [r.keys[0] || "—", fmt(r.clicks), fmt(r.impressions), fmt(r.position, 1)])}
          />
        </section>
      )}
      {data.gscPages.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">{t(locale, "Sayfalar", "Pages")}</h2>
          <Table
            heads={[t(locale, "Sayfa", "Page"), t(locale, "Tıklama", "Clicks"), t(locale, "Gösterim", "Impr."), t(locale, "Sıra", "Pos")]}
            rows={data.gscPages.map((r) => [r.keys[0] || "—", fmt(r.clicks), fmt(r.impressions), fmt(r.position, 1)])}
          />
        </section>
      )}
      {data.ga4Channels.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">{t(locale, "Kanallar", "Channels")}</h2>
          <Table
            heads={[t(locale, "Kanal", "Channel"), t(locale, "Oturum", "Sessions"), t(locale, "Kullanıcı", "Users")]}
            rows={data.ga4Channels.map((r) => [r.dimension, fmt(r.sessions), fmt(r.users)])}
          />
        </section>
      )}
      {data.ga4Landings.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">{t(locale, "Açılış sayfaları", "Landing pages")}</h2>
          <Table
            heads={[t(locale, "Sayfa", "Page"), t(locale, "Oturum", "Sessions"), t(locale, "Görüntüleme", "Views")]}
            rows={data.ga4Landings.map((r) => [r.dimension, fmt(r.sessions), fmt(r.views)])}
          />
        </section>
      )}
    </div>
  );
}

function Table({ heads, rows }: { heads: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-muted">
          <tr>
            {heads.map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line">
              {row.map((c, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? "max-w-md truncate" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
