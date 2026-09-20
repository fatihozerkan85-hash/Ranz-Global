import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  outputFileTracingIncludes: {
    "/api/seo/serp": ["./src/lib/fonts/NotoSans-Regular.ttf"],
    "/src/app/api/seo/serp/route": ["./src/lib/fonts/NotoSans-Regular.ttf"],
  },
};

export default nextConfig;
