"use client";

import { useEffect } from "react";
import { trackEngagement } from "@/lib/seo-store";

function send(type: string, page: string) {
  trackEngagement(type, page);
  void fetch("/api/seo/tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "engagement", type, page }),
    keepalive: true,
  }).catch(() => undefined);
}

export function logPublicEngagement(type: "whatsapp" | "phone" | "email" | "form", page: string) {
  send(type, page);
}

export function EngagementTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const page = window.location.pathname;
      if (href.includes("wa.me") || href.includes("whatsapp")) send("whatsapp", page);
      else if (href.startsWith("tel:")) send("phone", page);
      else if (href.startsWith("mailto:")) send("email", page);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
