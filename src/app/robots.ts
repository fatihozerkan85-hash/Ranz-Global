import type { MetadataRoute } from "next";
import { SITE } from "@/lib/cms";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/danisman", "/yonetim", "/giris", "/kayit", "/sifre-unuttum", "/sifre-yenile", "/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url.replace(/^https?:\/\//, ""),
  };
}
