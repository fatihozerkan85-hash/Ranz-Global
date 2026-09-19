"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function GooglePageViewInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
    if (!id || typeof window.gtag !== "function") return;
    const page_path = `${pathname}${search.toString() ? `?${search}` : ""}`;
    const content_group = pathname.startsWith("/blog") ? "blog" : pathname === "/" ? "home" : "site";
    window.gtag("event", "page_view", {
      page_path,
      page_title: document.title,
      content_group,
      send_to: id,
    });
  }, [pathname, search]);
  return null;
}

export function trackBlogListView(count: number) {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "view_item_list", {
    item_list_id: "kesfet",
    item_list_name: "Keşfet",
    items: [{ item_name: "blog", quantity: count }],
    send_to: id,
  });
}

export function trackBlogOpen(slug: string, title: string) {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "select_content", {
    content_type: "blog",
    content_id: `/blog/${slug}`,
    item_id: slug,
    item_name: title,
    send_to: id,
  });
}

export function GooglePageView() {
  return (
    <Suspense fallback={null}>
      <GooglePageViewInner />
    </Suspense>
  );
}
