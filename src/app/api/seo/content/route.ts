import { NextResponse } from "next/server";
import { getBlogPost, listBlogPosts, saveBlogPost, unpublishBlogPost, unpublishCreatedBlogPosts, deleteBlogPost } from "@/lib/blog-server";
import { slugifyTopic, wordCount, type BlogArticle } from "@/lib/blog-article";
import { isListedBlogPost } from "@/lib/cms";
import { writeBlogArticle, GEMINI_BLOG_MODEL } from "@/lib/write-blog";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

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
  return noStore({
    posts: posts.filter(isListedBlogPost),
    gemini: {
      model: GEMINI_BLOG_MODEL,
      hasGatewayKey: Boolean(process.env.AI_GATEWAY_API_KEY),
      onVercel: process.env.VERCEL === "1",
    },
  });
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
      const { article, source, warning, model } = await writeBlogArticle(topic, locale);
      return noStore({
        article,
        source,
        warning,
        model,
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
    if (action === "unpublish") {
      const slug = slugifyTopic(String(body.slug || ""));
      if (!slug) return noStore({ error: "Slug yok." }, 400);
      await unpublishBlogPost(slug);
      return noStore({ ok: true, slug });
    }
    if (action === "unpublish-all") {
      await unpublishCreatedBlogPosts();
      return noStore({ ok: true });
    }
    if (action === "delete") {
      const slug = slugifyTopic(String(body.slug || ""));
      if (!slug) return noStore({ error: "Slug yok." }, 400);
      await deleteBlogPost(slug);
      return noStore({ ok: true, slug });
    }
    return noStore({ error: "Geçersiz işlem." }, 400);
  } catch (error) {
    return noStore({ error: (error as Error).message }, 500);
  }
}
