import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { isEvrakPathname } from "@/lib/blob-evrak";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("p");

  if (!pathname || !isEvrakPathname(pathname)) {
    return NextResponse.json({ error: "Eksik veya geçersiz dosya." }, { status: 400 });
  }

  try {
    const result = await get(pathname, {
      access: "private",
      useCache: false,
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });

    if (!result) {
      return new NextResponse("Dosya bulunamadı.", { status: 404 });
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "private, no-store",
        },
      });
    }

    if (result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Dosya bulunamadı.", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "Content-Disposition": result.blob.contentDisposition || "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        ETag: result.blob.etag,
      },
    });
  } catch {
    return new NextResponse("Dosya bulunamadı.", { status: 404 });
  }
}
