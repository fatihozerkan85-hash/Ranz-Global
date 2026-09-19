import type { MetadataRoute } from "next";
import { DEFAULT_GUIDES, SITE } from "@/lib/cms";
import { SERVICES } from "@/lib/services";
import { listBlogPosts } from "@/lib/blog-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await listBlogPosts();
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
    ...posts.filter((p) => p.status === "published").map((p) => `/blog/${p.slug}`),
  ];
  return [...staticPaths, ...extra].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path.startsWith("/hizmet/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/hizmet/") ? 0.85 : path.startsWith("/blog/") ? 0.6 : 0.7,
  }));
}
