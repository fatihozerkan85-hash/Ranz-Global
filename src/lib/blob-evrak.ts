export const EVRAK_MAX_BYTES = 8 * 1024 * 1024;
export const EVRAK_CONTENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;

export function sanitizeFileName(name: string) {
  const trimmed = name.trim().replace(/\\/g, "/").split("/").pop() ?? "belge";
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80);
  return safe || "belge";
}

export function evrakPathname(appId: string, docKey: string, fileName: string) {
  const app = sanitizeFileName(appId);
  const key = sanitizeFileName(docKey);
  return `evrak/${app}/${key}/${sanitizeFileName(fileName)}`;
}

export function isEvrakPathname(pathname: string) {
  if (!pathname || pathname.includes("..") || pathname.startsWith("/") || pathname.includes("\\")) {
    return false;
  }
  return /^evrak\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\//.test(pathname);
}

export function documentOpenHref(pathname?: string) {
  if (!pathname || !isEvrakPathname(pathname)) return null;
  return `/api/evrak/indir?p=${encodeURIComponent(pathname)}`;
}
