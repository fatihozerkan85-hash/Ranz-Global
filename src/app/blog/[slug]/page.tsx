import type { Metadata } from "next";
import { publicMeta } from "@/lib/seo-meta";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { DEFAULT_POSTS } from "@/lib/cms";
import PostView from "./view";

export function generateStaticParams() {
  return DEFAULT_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = DEFAULT_POSTS.find((x) => x.slug === slug);
  return publicMeta({
    title: p?.titleTr ?? "Blog",
    description: (p?.excerptTr ?? "Ranz Global vize danışmanlığı yazısı.").slice(0, 155),
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = DEFAULT_POSTS.find((x) => x.slug === slug);
  return (
    <>
      {p ? (
        <>
          <ArticleJsonLd title={p.titleTr} description={p.excerptTr} path={`/blog/${p.slug}`} datePublished={p.publishedAt} />
          <BreadcrumbJsonLd
            items={[
              { name: "Ranz Global", path: "" },
              { name: "Blog", path: "/blog" },
              { name: p.titleTr, path: `/blog/${p.slug}` },
            ]}
          />
        </>
      ) : null}
      <PostView />
    </>
  );
}
