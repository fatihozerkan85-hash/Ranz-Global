import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/cms";
import { SERVICES, serviceBySlug } from "@/lib/services";
import { ServiceView } from "./view";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return { title: "Hizmet" };
  return {
    title: s.titleTr,
    description: `${s.titleTr} — ${s.visaTr}. ${s.fee ? `Danışmanlık ücreti ${s.fee}.` : ""} Ranz Global vize danışmanlığı.`,
    alternates: { canonical: `${SITE.url}/hizmet/${s.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  return <ServiceView slug={slug} />;
}
