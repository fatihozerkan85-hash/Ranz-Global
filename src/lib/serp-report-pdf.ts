import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, rgb } from "pdf-lib";
import fontkitImport from "@pdf-lib/fontkit";
import type { SerpReport } from "./serp-competitor";

const NAVY = rgb(15 / 255, 39 / 255, 68 / 255);
const GOLD = rgb(196 / 255, 160 / 255, 86 / 255);
const MUTED = rgb(0.35, 0.38, 0.42);

const fontkit = (fontkitImport as { default?: typeof fontkitImport }).default ?? fontkitImport;

function posLabel(n: number | null) {
  return n == null ? "yok" : String(n);
}

async function loadFontBytes() {
  return readFile(join(process.cwd(), "src/lib/fonts/NotoSans-Regular.ttf"));
}

export async function serpReportPdf(report: SerpReport) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(await loadFontBytes(), { subset: false });
  const pageSize: [number, number] = [595, 842];
  let page = pdf.addPage(pageSize);
  let y = 800;
  const left = 48;

  const ensure = (need: number) => {
    if (y - need < 48) {
      page = pdf.addPage(pageSize);
      y = 800;
    }
  };

  const line = (text: string, size: number, color = NAVY, gap = size + 8) => {
    ensure(gap);
    page.drawText(text.slice(0, 110), { x: left, y, size, font, color });
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
  y -= 12;
  line("Bu rapor Google'daki organik görünürlüktür. Vize onayı sözü yoktur.", 8, MUTED);
  return pdf.save();
}
