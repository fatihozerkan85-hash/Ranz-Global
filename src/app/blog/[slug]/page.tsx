import type { Metadata } from "next";
import { DEFAULT_POSTS, SITE } from "@/lib/cms";

export function generateStaticParams() {
  return DEFAULT_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = DEFAULT_POSTS.find((x) => x.slug === slug);
  return {
    title: p?.titleTr ?? "Blog",
    description: p?.excerptTr,
    alternates: { canonical: `${SITE.url}/blog/${slug}` },
    openGraph: { title: p?.titleTr, description: p?.excerptTr },
  };
}

export { default } from "./view";
