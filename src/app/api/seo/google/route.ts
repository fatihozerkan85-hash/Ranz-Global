import { NextResponse } from "next/server";
import { clearTokens, googleSeoStatus, saveSelection } from "@/lib/google-seo";

export const dynamic = "force-dynamic";

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET() {
  try {
    return noStore(await googleSeoStatus());
  } catch (error) {
    return noStore({ error: (error as Error).message, configured: false, connected: false }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { gscSiteUrl?: string; ga4PropertyId?: string };
    await saveSelection(body);
    return noStore(await googleSeoStatus());
  } catch (error) {
    return noStore({ error: (error as Error).message }, 400);
  }
}

export async function DELETE() {
  await clearTokens();
  return noStore({ ok: true });
}
