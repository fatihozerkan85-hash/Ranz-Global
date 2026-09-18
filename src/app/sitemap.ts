import type { MetadataRoute } from "next";
import { DEFAULT_GUIDES, DEFAULT_POSTS, SITE } from "@/lib/cms";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/hizmetler",
    "/hakkimizda",
    "/iletisim",
    "/randevu",
    "/vize-rehberi",
    "/blog",
    "/vize-reddi",
    "/mesafeli-hizmet",
    "/cerez-politikasi",
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
    lastModified: now,
    changeFrequency: path === "" || path.startsWith("/hizmet/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/hizmet/") ? 0.85 : path.startsWith("/blog/") ? 0.6 : 0.7,
  }));
}
