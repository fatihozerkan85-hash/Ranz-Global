import type { Metadata } from "next";
import { publicMeta } from "@/lib/seo-meta";
import { DEFAULT_PAGES } from "@/lib/cms";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = DEFAULT_PAGES.find((p) => p.slug === slug);
  return publicMeta({
    title: page?.titleTr ?? "Sayfa",
    description: (page?.descriptionTr ?? "Ranz Global sayfası.").slice(0, 155),
    path: `/sayfa/${slug}`,
  });
}

export { default } from "./view";
