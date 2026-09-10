import type { MetadataRoute } from "next";
import { SITE } from "@/lib/cms";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/danisman", "/yonetim"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
