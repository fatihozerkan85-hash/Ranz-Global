import type { MetadataRoute } from "next";
import { DEFAULT_GUIDES, DEFAULT_POSTS, SITE } from "@/lib/cms";

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
    ...DEFAULT_GUIDES.map((g) => `/vize-rehberi/${g.slug}`),
    ...DEFAULT_POSTS.map((p) => `/blog/${p.slug}`),
  ];
  return [...staticPaths, ...extra].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
