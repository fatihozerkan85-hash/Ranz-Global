import type { MetadataRoute } from "next";
import { DEFAULT_GUIDES, DEFAULT_POSTS, SITE } from "@/lib/cms";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/hizmetler",
    "/hakkimizda",
    "/iletisim",
    "/randevu",
    "/vize-rehberi",
    "/blog",
    "/kvkk",
    "/gizlilik",
  ];
  const extra = [
    ...SERVICES.map((s) => `/hizmet/${s.slug}`),
    ...DEFAULT_GUIDES.map((g) => `/vize-rehberi/${g.slug}`),
    ...DEFAULT_POSTS.map((p) => `/blog/${p.slug}`),
  ];
  return [...staticPaths, ...extra].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.startsWith("/hizmet/") ? 0.85 : 0.7,
  }));
}
