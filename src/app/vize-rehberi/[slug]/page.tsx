import type { Metadata } from "next";
import { publicMeta } from "@/lib/seo-meta";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { DEFAULT_GUIDES } from "@/lib/cms";
import GuideView from "./view";

export function generateStaticParams() {
  return DEFAULT_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = DEFAULT_GUIDES.find((x) => x.slug === slug);
  return publicMeta({
    title: g?.titleTr ?? "Vize rehberi",
    description: (g?.descriptionTr ?? "Ranz Global vize rehberi.").slice(0, 155),
    path: `/vize-rehberi/${slug}`,
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = DEFAULT_GUIDES.find((x) => x.slug === slug);
  return (
    <>
      {g ? (
        <>
          <ArticleJsonLd title={g.titleTr} description={g.descriptionTr} path={`/vize-rehberi/${g.slug}`} />
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
