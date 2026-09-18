"use client";

import { RegionCountryScroller } from "@/components/region-country-scroller";

export function SchengenCountryScroller({
  value,
  onChange,
  mode = "select",
}: {
  value?: string;
  onChange?: (code: string) => void;
  mode?: "select" | "links";
}) {
  return <RegionCountryScroller region="schengen" value={value} onChange={onChange} mode={mode} />;
}
