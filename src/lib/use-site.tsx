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
import { DEFAULT_HOME } from "@/lib/site-content";

export function useHome() {
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME);
  useEffect(() => {
    const load = () => setHome(getHome());
    load();
    return subscribeStore(load);
  }, []);
  return home;
}

export function usePages() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  useEffect(() => {
    const load = () => setPages(getPages());
    load();
    return subscribeStore(load);
  }, []);
  return pages;
}

export function useGuides() {
  const [guides, setGuides] = useState<CmsPage[]>([]);
  useEffect(() => {
    const load = () => setGuides(getGuides());
    load();
    return subscribeStore(load);
  }, []);
  return guides;
}

export function usePosts(all = false) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    const load = () => setPosts(all ? getAllPosts() : getAllPosts().filter((p) => p.status === "published"));
    load();
    return subscribeStore(load);
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
