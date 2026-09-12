import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { EVRAK_CONTENT_TYPES, EVRAK_MAX_BYTES, isEvrakPathname } from "@/lib/blob-evrak";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isEvrakPathname(pathname)) {
          throw new Error("Geçersiz evrak yolu.");
        }
        return {
          allowedContentTypes: [...EVRAK_CONTENT_TYPES],
          maximumSizeInBytes: EVRAK_MAX_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 0,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Yükleme başarısız." },
      { status: 400 },
    );
  }
}
