import type { Metadata } from "next";
import { DEFAULT_GUIDES, SITE } from "@/lib/cms";

export function generateStaticParams() {
  return DEFAULT_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = DEFAULT_GUIDES.find((x) => x.slug === slug);
  return {
    title: g?.titleTr ?? "Vize rehberi",
    description: g?.descriptionTr,
    alternates: { canonical: `${SITE.url}/vize-rehberi/${slug}` },
  };
}

export { default } from "./view";
