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
    window.gtag("event", "page_view", { page_path, page_title: document.title, send_to: id });
  }, [pathname, search]);
  return null;
}

export function GooglePageView() {
  return (
    <Suspense fallback={null}>
      <GooglePageViewInner />
    </Suspense>
  );
}
