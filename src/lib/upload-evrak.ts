"use client";

import { upload } from "@vercel/blob/client";
import { evrakPathname } from "@/lib/blob-evrak";

export async function uploadEvrakFile(appId: string, docKey: string, file: File) {
  const blob = await upload(evrakPathname(appId, docKey, file.name), file, {
    access: "private",
    handleUploadUrl: "/api/evrak/yukle",
    multipart: file.size > 4.5 * 1024 * 1024,
    contentType: file.type || undefined,
    clientPayload: JSON.stringify({ appId, docKey }),
  });
  return blob;
}
