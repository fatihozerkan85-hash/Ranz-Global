"use client";

import { useEffect } from "react";
import { trackEngagement } from "@/lib/seo-store";

export function EngagementTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const page = window.location.pathname;
      if (href.includes("wa.me") || href.includes("whatsapp")) trackEngagement("whatsapp", page);
      else if (href.startsWith("tel:")) trackEngagement("phone", page);
      else if (href.startsWith("mailto:")) trackEngagement("email", page);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
