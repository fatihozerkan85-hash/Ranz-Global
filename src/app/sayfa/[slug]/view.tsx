"use client";

import { useParams } from "next/navigation";
import { StorePageView } from "@/components/store-page-view";

export default function ExtraPageView() {
  const { slug } = useParams<{ slug: string }>();
  return <StorePageView slug={slug} />;
}
