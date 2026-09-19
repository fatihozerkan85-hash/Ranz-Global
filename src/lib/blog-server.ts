import { get, put } from "@vercel/blob";
import { DEFAULT_POSTS, RETIRED_BLOG_SLUGS } from "./cms";
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
  for (const post of DEFAULT_POSTS) {
    if (!RETIRED_BLOG_SLUGS.has(post.slug)) map.set(post.slug, post);
  }
  for (const post of remote) {
    if (post?.slug && !RETIRED_BLOG_SLUGS.has(post.slug)) map.set(post.slug, post);
  }
  return [...map.values()].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

export async function listBlogPosts() {
  return mergePosts(await readRemote());
}

export async function getBlogPost(slug: string) {
  const post = (await listBlogPosts()).find((p) => p.slug === slug);
  if (!post || post.status !== "published") return undefined;
  return post;
}

export async function saveBlogPost(post: BlogPost) {
  const remote = await readRemote();
  const next = remote.filter((p) => p.slug !== post.slug);
  next.unshift(post);
  await writeRemote(next);
  return post;
}

async function writeRemote(posts: BlogPost[]) {
  await put(POSTS_PATH, JSON.stringify(posts), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export async function listRemoteBlogPosts() {
  return readRemote();
}

export async function unpublishBlogPost(slug: string) {
  const remote = await readRemote();
  const next = remote.map((post) => (post.slug === slug ? { ...post, status: "draft" as const } : post));
  await writeRemote(next);
  return next.find((p) => p.slug === slug) ?? null;
}

export async function unpublishCreatedBlogPosts() {
  const remote = await readRemote();
  const next = remote.map((post) => ({ ...post, status: "draft" as const }));
  await writeRemote(next);
  return next;
}

export async function deleteBlogPost(slug: string) {
  const remote = await readRemote();
  const next = remote.filter((p) => p.slug !== slug);
  await writeRemote(next);
  return { ok: true };
}
