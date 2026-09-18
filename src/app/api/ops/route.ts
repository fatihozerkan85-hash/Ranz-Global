import { get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { coerceOps, EMPTY_OPS, mergeOps, type OpsPayload } from "@/lib/ops-shared";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PATH = "ops/ranz-global.json";

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

async function readOps(): Promise<OpsPayload> {
  try {
    const result = await get(PATH, { access: "private", useCache: false });
    if (!result?.stream) return EMPTY_OPS;
    const text = await new Response(result.stream).text();
    return coerceOps(JSON.parse(text)) ?? EMPTY_OPS;
  } catch (error) {
    console.error("ops_read_failed", (error as Error).message);
    return EMPTY_OPS;
  }
}

async function writeOps(data: OpsPayload) {
  await put(PATH, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export async function GET() {
  try {
    return noStore(await readOps());
  } catch (error) {
    return noStore({ error: (error as Error).message || "Kuyruk okunamadı." }, 500);
  }
}

export async function POST(request: Request) {
  let incoming: unknown;
  try {
    incoming = await request.json();
  } catch {
    return noStore({ error: "Geçersiz istek." }, 400);
  }
  const slice = coerceOps(incoming);
  if (!slice) {
    return noStore({ error: "Geçersiz kuyruk." }, 400);
  }

  try {
    const current = await readOps();
    const merged = mergeOps(current, slice);
    await writeOps(merged);
    return noStore({ ok: true, files: merged.applications.length });
  } catch (error) {
    console.error("ops_write_failed", (error as Error).message);
    return noStore({ error: (error as Error).message || "Kuyruk yazılamadı." }, 500);
  }
}
