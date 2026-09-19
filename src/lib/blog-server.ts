import { get, put } from "@vercel/blob";
import { DEFAULT_POSTS } from "./cms";
import type { BlogPost } from "./types";

const POSTS_PATH = "ops/blog-posts.json";

async function readRemote(): Promise<BlogPost[]> {
  try {
    const result = await get(POSTS_PATH, { access: "private", useCache: false });
    if (!result?.stream) return [];
    const parsed = JSON.parse(await new Response(result.stream).text()) as BlogPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mergePosts(remote: BlogPost[]) {
  const map = new Map<string, BlogPost>();
  for (const post of DEFAULT_POSTS) map.set(post.slug, post);
  for (const post of remote) {
    if (post?.slug) map.set(post.slug, post);
  }
  return [...map.values()].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

export async function listBlogPosts() {
  return mergePosts(await readRemote());
}

export async function getBlogPost(slug: string) {
  return (await listBlogPosts()).find((p) => p.slug === slug);
}

export async function saveBlogPost(post: BlogPost) {
  const remote = await readRemote();
  const next = remote.filter((p) => p.slug !== post.slug);
  next.unshift(post);
  await put(POSTS_PATH, JSON.stringify(next), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  return post;
}
