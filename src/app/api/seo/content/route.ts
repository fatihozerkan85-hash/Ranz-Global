import { NextResponse } from "next/server";
import { getBlogPost, listBlogPosts, saveBlogPost } from "@/lib/blog-server";
import { slugifyTopic, wordCount, type BlogArticle } from "@/lib/blog-article";
import { writeBlogArticle } from "@/lib/write-blog";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

function toPost(article: BlogArticle, slug: string): BlogPost {
  return {
    slug,
    titleTr: article.titleTr,
    titleEn: article.titleEn,
    excerptTr: article.excerptTr,
    excerptEn: article.excerptEn,
    bodyTr: article.bodyTr,
    bodyEn: article.bodyEn,
    coverAltTr: article.titleTr,
    coverAltEn: article.titleEn,
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "published",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const slug = searchParams.get("slug") || "";
  if (action === "post" && slug) {
    const post = await getBlogPost(slug);
    if (!post) return noStore({ error: "Yazı yok." }, 404);
    return noStore({ post });
  }
  const posts = await listBlogPosts();
  return noStore({ posts: posts.filter((p) => p.status === "published") });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return noStore({ error: "Geçersiz istek." }, 400);
  }
  const action = String(body.action || "draft");
  try {
    if (action === "draft") {
      const topic = String(body.topic || "").trim();
      const locale = String(body.locale || "tr");
      const { article, source } = await writeBlogArticle(topic, locale);
      return noStore({
        article,
        source,
        words: wordCount(locale === "en" ? article.bodyEn : article.bodyTr),
      });
    }
    if (action === "publish") {
      const article = body.article as BlogArticle | undefined;
      const topic = String(body.topic || article?.titleTr || "");
      if (!article?.bodyTr) return noStore({ error: "Önce taslak üretin." }, 400);
      const slug = slugifyTopic(String(body.slug || topic));
      const post = await saveBlogPost(toPost(article, slug));
      return noStore({ ok: true, href: `/blog/${post.slug}`, post });
    }
    return noStore({ error: "Geçersiz işlem." }, 400);
  } catch (error) {
    return noStore({ error: (error as Error).message }, 500);
  }
}
