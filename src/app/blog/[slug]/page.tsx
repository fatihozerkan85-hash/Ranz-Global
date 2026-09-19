import type { Metadata } from "next";
import { publicMeta } from "@/lib/seo-meta";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { getBlogPost, listBlogPosts } from "@/lib/blog-server";
import PostView from "./view";

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getBlogPost(slug);
  return publicMeta({
    title: p?.titleTr ?? "Blog",
    description: p?.excerptTr ?? "Ranz Global vize danışmanlığı yazısı.",
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getBlogPost(slug);
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
