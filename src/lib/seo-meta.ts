import type { Metadata } from "next";
import { SITE } from "./cms";

const OG_IMAGE = { url: "/logo.jpg", width: 1200, height: 1200, alt: "Ranz Global" };
const DESC_PAD = " Ranz Global vize danışmanlığıdır; nihai karar konsolosluk veya yetkili makama aittir.";

export function ensureMetaDescription(text: string) {
  const base = text.replace(/\s+/g, " ").trim();
  if (base.length >= 70 && base.length <= 155) return base;
  if (base.length > 155) {
    const cut = base.slice(0, 154).replace(/\s+\S*$/, "");
    return `${cut}…`;
  }
  let next = `${base}${DESC_PAD}`.replace(/\s+/g, " ").trim();
  if (next.length < 70) next = `${next} Türkiye ve KKTC başvurularında dosya hazırlanır.`;
  if (next.length > 155) {
    const cut = next.slice(0, 154).replace(/\s+\S*$/, "");
    return `${cut}…`;
  }
  return next;
}

export function publicMeta({
  title,
  description,
  path,
  absoluteTitle = false,
  index = true,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  index?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = path ? `${SITE.url}${path}` : SITE.url;
  const desc = ensureMetaDescription(description);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    robots: { index, follow: index },
    openGraph: {
      type,
      locale: "tr_TR",
      url,
      siteName: SITE.name,
      title,
      description: desc,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: ["/logo.jpg"],
    },
  };
}
