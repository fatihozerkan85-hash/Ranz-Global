"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/yonetim/erp");
  }, [router]);
  return <p className="text-sm text-muted">…</p>;
}
