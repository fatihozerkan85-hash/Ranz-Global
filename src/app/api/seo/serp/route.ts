import { NextResponse } from "next/server";
import {
  DEFAULT_SERP_QUERIES,
  parseDomainList,
  parseQueryList,
  runSerpCompetitorReport,
  serpConfigured,
  type SerpReport,
} from "@/lib/serp-competitor";
import { serpReportPdf } from "@/lib/serp-report-pdf";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function GET() {
  return noStore({
    configured: serpConfigured(),
    defaults: DEFAULT_SERP_QUERIES,
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return noStore({ error: "Geçersiz istek." }, 400);
  }
  const action = String(body.action || "analyze");
  try {
    if (action === "pdf") {
      const report = body.report as SerpReport | undefined;
      if (!report?.queries?.length) return noStore({ error: "Önce analizi çalıştırın." }, 400);
      const bytes = await serpReportPdf(report);
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      return new NextResponse(copy, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="ranz-serp-rakip-${report.at.slice(0, 10)}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    }
    const queries = parseQueryList(String(body.queries || ""));
    const competitors = parseDomainList(String(body.competitors || ""));
    const report = await runSerpCompetitorReport({
      queries,
      competitors,
      gl: String(body.gl || "tr"),
      hl: String(body.hl || "tr"),
    });
    return noStore({ report });
  } catch (error) {
    return noStore({ error: (error as Error).message }, 500);
  }
}
