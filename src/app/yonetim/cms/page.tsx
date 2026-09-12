"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CmsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/yonetim/site");
  }, [router]);
  return <p className="text-sm text-muted">…</p>;
}
