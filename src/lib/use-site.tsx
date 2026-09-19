"use client";

import { useEffect, useState } from "react";
import {
  getAllPosts,
  getGuides,
  getHome,
  getMedia,
  getMediaById,
  getPages,
  subscribeStore,
} from "@/lib/store";
import type { BlogPost, CmsPage, HomeContent, SiteMedia } from "@/lib/types";
import { DEFAULT_GUIDES, DEFAULT_PAGES, DEFAULT_POSTS, RETIRED_BLOG_SLUGS, isListedBlogPost } from "@/lib/cms";
import { DEFAULT_HOME } from "@/lib/site-content";

export function useHome() {
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME);
  useEffect(() => {
    const load = () => setHome(getHome());
    load();
    void import("@/lib/ops-client").then((mod) => mod.pullOps().then(load));
    return subscribeStore(load);
  }, []);
  return home;
}

export function usePages() {
  const [pages, setPages] = useState<CmsPage[]>(DEFAULT_PAGES);
  useEffect(() => {
    const load = () => setPages(getPages());
    load();
    return subscribeStore(load);
  }, []);
  return pages;
}

export function useGuides() {
  const [guides, setGuides] = useState<CmsPage[]>(DEFAULT_GUIDES);
  useEffect(() => {
    const load = () => setGuides(getGuides());
    load();
    return subscribeStore(load);
  }, []);
  return guides;
}

export function usePosts(all = false) {
  const [posts, setPosts] = useState<BlogPost[]>(() =>
    all ? DEFAULT_POSTS : DEFAULT_POSTS.filter(isListedBlogPost),
  );
  useEffect(() => {
    let remote: BlogPost[] = [];
    const apply = () => {
      const map = new Map<string, BlogPost>();
      for (const post of all ? getAllPosts() : getAllPosts().filter(isListedBlogPost)) {
        map.set(post.slug, post);
      }
      for (const post of remote) {
        if (RETIRED_BLOG_SLUGS.has(post.slug)) continue;
        if (!all && !isListedBlogPost(post)) continue;
        map.set(post.slug, post);
      }
      setPosts([...map.values()].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "")));
    };
    apply();
    void fetch("/api/seo/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { posts?: BlogPost[] }) => {
        remote = json.posts ?? [];
        apply();
      })
      .catch(() => undefined);
    return subscribeStore(apply);
  }, [all]);
  return posts;
}

export function useMedia() {
  const [media, setMedia] = useState<SiteMedia[]>([]);
  useEffect(() => {
    const load = () => setMedia(getMedia());
    load();
    return subscribeStore(load);
  }, []);
  return media;
}

export function CmsImg({ id, alt, className }: { id?: string; alt: string; className?: string }) {
  const [src, setSrc] = useState<string | undefined>();
  useEffect(() => {
    const load = () => setSrc(getMediaById(id)?.dataUrl);
    load();
    return subscribeStore(load);
  }, [id]);
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}
