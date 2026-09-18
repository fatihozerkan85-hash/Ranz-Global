"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { portalPath, useAuth } from "@/lib/auth";
import { isPublicSessionUser } from "@/lib/store";

export function stashGuestLead(region?: string, ulke?: string) {
  try {
    sessionStorage.setItem(
      "ranz-quiz-lead",
      JSON.stringify({ region: region ?? "", memberCode: ulke ?? "" }),
    );
    window.dispatchEvent(new Event("ranz-quiz-lead"));
  } catch {
    /* ignore */
  }
}

export function startApplicationHref(
  user: { id?: string; email: string; role?: string } | null | undefined,
  region?: string,
  ulke?: string,
) {
  if (isPublicSessionUser(user) && user?.role === "client") {
    const q = new URLSearchParams();
    if (region) q.set("hizmet", region);
    if (ulke) q.set("ulke", ulke);
    const query = q.toString();
    return query ? `/panel/yeni?${query}` : "/panel/yeni";
  }
  if (isPublicSessionUser(user) && user) return portalPath(user);
  return "/#iletisim";
}

export function StartApplicationLink({
  className,
  children,
  region,
  ulke,
}: {
  className?: string;
  children: ReactNode;
  region?: string;
  ulke?: string;
}) {
  const { user, ready } = useAuth();
  const signedIn = ready && isPublicSessionUser(user);
  return (
    <Link
      href={startApplicationHref(signedIn ? user : null, region, ulke)}
      className={className}
      onClick={() => {
        if (!signedIn) stashGuestLead(region, ulke);
      }}
    >
      {children}
    </Link>
  );
}
