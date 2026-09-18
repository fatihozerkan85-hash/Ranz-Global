import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicMeta } from "@/lib/seo-meta";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { SERVICES, serviceBySlug } from "@/lib/services";
import { ServiceView } from "./view";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return { title: "Hizmet" };
  const desc = `${s.titleTr} — ${s.visaTr}. ${s.fee ? `Danışmanlık ücreti ${s.fee}.` : ""} Konsolosluk harcı ayrıdır. Ranz Global vize onayı garantisi vermez.`;
  return publicMeta({
    title: s.titleTr,
    description: desc.slice(0, 155),
    path: `/hizmet/${s.slug}`,
  });
}

export default async function ServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ulke?: string }>;
}) {
  const { slug } = await params;
  const { ulke } = await searchParams;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  return (
    <>
      <ServiceJsonLd service={service} />
      <BreadcrumbJsonLd
        items={[
          { name: "Ranz Global", path: "" },
          { name: "Hizmetler", path: "/hizmetler" },
          { name: service.titleTr, path: `/hizmet/${service.slug}` },
        ]}
      />
      <ServiceView slug={slug} ulke={ulke} />
    </>
  );
}
