import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import fontkitImport from "@pdf-lib/fontkit";
import type { SerpReport } from "./serp-competitor";
import type { Ga4Row, GoogleSeoStatus, GscRow } from "./google-seo";

const NAVY = rgb(15 / 255, 39 / 255, 68 / 255);
const GOLD = rgb(196 / 255, 160 / 255, 86 / 255);
const MUTED = rgb(0.35, 0.38, 0.42);

const fontkit = (fontkitImport as { default?: typeof fontkitImport }).default ?? fontkitImport;

function posLabel(n: number | null) {
  return n == null ? "yok" : String(n);
}

function fmtInt(n: number) {
  return Math.round(n).toLocaleString("tr-TR");
}

function fmtDec(n: number, digits = 1) {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

function fmtPct(n: number) {
  const value = n > 1 ? n : n * 100;
  return `${fmtDec(value, 1)}%`;
}

async function loadFontBytes() {
  return readFile(join(process.cwd(), "src/lib/fonts/NotoSans-Regular.ttf"));
}

function fit(font: PDFFont, text: string, size: number, maxWidth: number) {
  const clean = text.replace(/\s+/g, " ").trim() || "—";
  if (font.widthOfTextAtSize(clean, size) <= maxWidth) return clean;
  let t = clean;
  while (t.length > 1 && font.widthOfTextAtSize(`${t}…`, size) > maxWidth) t = t.slice(0, -1);
  return `${t}…`;
}

export async function serpReportPdf(report: SerpReport, analytics?: GoogleSeoStatus | null) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(await loadFontBytes(), { subset: false });
  const pageSize: [number, number] = [595, 842];
  let page = pdf.addPage(pageSize);
  let y = 800;
  const left = 48;
  const right = 547;
  const width = right - left;

  const ensure = (need: number) => {
    if (y - need < 48) {
      page = pdf.addPage(pageSize);
      y = 800;
    }
  };

  const line = (text: string, size: number, color = NAVY, gap = size + 8) => {
    ensure(gap);
    page.drawText(fit(font, text, size, width), { x: left, y, size, font, color });
    y -= gap;
  };

  const table = (heads: string[], rows: string[][], colWeights: number[]) => {
    const size = 8;
    const rowH = 16;
    const gap = 8;
    const cols = colWeights.map((w) => (w / colWeights.reduce((a, b) => a + b, 0)) * width);
    const drawRow = (cells: string[], color = NAVY, header = false) => {
      ensure(rowH + 2);
      let x = left;
      cells.forEach((cell, i) => {
        const colW = cols[i] - 4;
        page.drawText(fit(font, cell, size, colW), { x, y, size, font, color });
        x += cols[i];
      });
      if (header) {
        page.drawLine({
          start: { x: left, y: y - 3 },
          end: { x: right, y: y - 3 },
          thickness: 0.4,
          color: GOLD,
        });
      }
      y -= rowH;
    };
    drawRow(heads, MUTED, true);
    for (const row of rows) drawRow(row);
    y -= gap;
  };

  line("Ranz Global", 11, GOLD);
  line("Rakip SERP raporu", 22);
  line(new Date(report.at).toLocaleString("tr-TR"), 10, MUTED);
  line(`Pazar: Google ${report.gl.toUpperCase()}  ·  Biz: ${report.ourDomain}`, 10, MUTED);
  y -= 6;
  line("Özet (ilk 10 sonuçta görünme)", 13);
  for (const score of report.scores) {
    const tag = score.ours ? " (biz)" : "";
    const avg = score.avgPosition == null ? "-" : String(score.avgPosition);
    line(`${score.domain}${tag}  ·  ${score.page1}/${report.queries.length} kelime  ·  ort. sıra ${avg}`, 10);
  }
  y -= 8;
  line("Kelime bazında sıra", 13);
  for (const row of report.queries) {
    ensure(56);
    line(row.query, 11);
    line(`Ranz Global: ${posLabel(row.ourPosition)}`, 10, MUTED, 14);
    const others = Object.entries(row.competitorPositions)
      .map(([d, p]) => `${d}: ${posLabel(p)}`)
      .join("   ");
    if (others) line(others, 9, MUTED, 14);
    const top = row.results[0];
    if (top) line(`1. ${top.domain} - ${top.title}`, 9, MUTED, 16);
    y -= 4;
  }
  if (report.gaps.length) {
    y -= 4;
    line("Boşluk: rakip ilk 10'da, biz yokuz", 13);
    for (const gap of report.gaps) {
      line(`${gap.query}  ·  ${gap.leader} #${gap.leaderPos}`, 10);
    }
  }

  y -= 10;
  drawAnalytics(analytics ?? null, line, table);

  y -= 12;
  line("Bu rapor Google'daki organik görünürlük ve bağlanan Analytics istatistikleridir. Vize onayı sözü yoktur.", 8, MUTED);
  return pdf.save();
}

function gscRows(rows: GscRow[]) {
  return rows.map((r) => [
    r.keys[0] || "—",
    fmtInt(r.clicks),
    fmtInt(r.impressions),
    fmtPct(r.ctr),
    fmtDec(r.position, 1),
  ]);
}

function channelRows(rows: Ga4Row[]) {
  return rows.map((r) => [r.dimension, fmtInt(r.sessions), fmtInt(r.users), fmtInt(r.views)]);
}

function landingRows(rows: Ga4Row[]) {
  return rows.map((r) => [r.dimension, fmtInt(r.sessions), fmtInt(r.users), fmtInt(r.views)]);
}

function drawAnalytics(
  analytics: GoogleSeoStatus | null,
  line: (text: string, size: number, color?: ReturnType<typeof rgb>, gap?: number) => void,
  table: (heads: string[], rows: string[][], colWeights: number[]) => void,
) {
  line("Search Console / Analytics (son 28 gün)", 13);
  if (!analytics?.connected) {
    line("Google hesabı bağlı değil. GSC / Analytics sekmesinden bağlayınca bu bölüm dolar.", 10, MUTED);
    return;
  }

  const bits = [
    analytics.email ? `Hesap: ${analytics.email}` : null,
    analytics.gscSiteUrl ? `Search Console: ${analytics.gscSiteUrl}` : null,
    analytics.ga4PropertyId ? `Analytics mülk: ${analytics.ga4PropertyId}` : null,
  ].filter(Boolean) as string[];
  for (const bit of bits) line(bit, 10, MUTED);

  const totals = analytics.ga4Totals;
  if (totals) {
    line("Analytics özet", 11);
    table(
      ["Oturum", "Kullanıcı", "Görüntüleme", "Hemen çıkma"],
      [[fmtInt(totals.sessions), fmtInt(totals.users), fmtInt(totals.views), fmtPct(totals.bounceRate)]],
      [1, 1, 1, 1],
    );
  } else {
    line("Analytics özet henüz yok (mülk seçilmemiş veya veri gelmedi).", 10, MUTED);
  }

  if (analytics.gscQueries.length) {
    line("Search Console sorguları", 11);
    table(
      ["Kelime", "Tıklama", "Gösterim", "CTR", "Sıra"],
      gscRows(analytics.gscQueries),
      [4.2, 1, 1.1, 0.9, 0.8],
    );
  } else {
    line("Search Console sorgusu yok.", 10, MUTED);
  }

  if (analytics.gscPages.length) {
    line("Search Console sayfaları", 11);
    table(
      ["Sayfa", "Tıklama", "Gösterim", "CTR", "Sıra"],
      gscRows(analytics.gscPages),
      [4.2, 1, 1.1, 0.9, 0.8],
    );
  }

  if (analytics.ga4Channels.length) {
    line("Analytics kanalları", 11);
    table(["Kanal", "Oturum", "Kullanıcı", "Görüntüleme"], channelRows(analytics.ga4Channels), [2.4, 1, 1, 1.2]);
  }

  if (analytics.ga4Landings.length) {
    line("Analytics açılış sayfaları", 11);
    table(["Sayfa", "Oturum", "Kullanıcı", "Görüntüleme"], landingRows(analytics.ga4Landings), [3.4, 1, 1, 1.2]);
  }

  if (analytics.error) line(`Not: ${analytics.error}`, 8, MUTED);
}
