import type { Metadata } from "next";
import { SITE } from "./cms";

const OG_IMAGE = { url: "/logo.jpg", width: 1200, height: 1200, alt: "Ranz Global" };

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
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: { index, follow: index },
    openGraph: {
      type,
      locale: "tr_TR",
      url,
      siteName: SITE.name,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.jpg"],
    },
  };
}
