"use client";

import { useCallback, useEffect, useState } from "react";
import type { GoogleSeoStatus } from "@/lib/google-seo";

const EMPTY: GoogleSeoStatus = {
  configured: false,
  connected: false,
  gscSites: [],
  ga4Properties: [],
  gscQueries: [],
  gscPages: [],
  ga4Totals: null,
  ga4Channels: [],
  ga4Landings: [],
};

export function useGoogleSeo() {
  const [data, setData] = useState<GoogleSeoStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo/google", { cache: "no-store" });
      const json = (await res.json()) as GoogleSeoStatus;
      setData(json);
    } catch {
      setData({ ...EMPTY, error: "Google SEO verisi alınamadı." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data: data ?? EMPTY, loading, refresh, ready: data !== null };
}
