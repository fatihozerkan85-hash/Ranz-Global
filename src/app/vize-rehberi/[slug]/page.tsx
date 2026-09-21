import type { Metadata } from "next";
import { publicMeta } from "@/lib/seo-meta";
import { ArticleJsonLd, BreadcrumbJsonLd, GuideFaqJsonLd } from "@/components/json-ld";
import { VISA_GUIDES, getVisaGuide } from "@/lib/visa-guides";
import GuideView from "./view";

export function generateStaticParams() {
  return VISA_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getVisaGuide(slug);
  return publicMeta({
    title: g?.metaTitleTr ?? "Vize rehberi",
    description: g?.metaDescriptionTr ?? "Ranz Global vize rehberi. Karar resmi makama aittir.",
    path: `/vize-rehberi/${slug}`,
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getVisaGuide(slug);
  return (
    <>
      {g ? (
        <>
          <ArticleJsonLd title={g.titleTr} description={g.metaDescriptionTr} path={`/vize-rehberi/${g.slug}`} />
          <GuideFaqJsonLd items={g.faq} />
          <BreadcrumbJsonLd
            items={[
              { name: "Ranz Global", path: "" },
              { name: "Vize rehberi", path: "/vize-rehberi" },
              { name: g.titleTr, path: `/vize-rehberi/${g.slug}` },
            ]}
          />
        </>
      ) : null}
      <GuideView />
    </>
  );
}
