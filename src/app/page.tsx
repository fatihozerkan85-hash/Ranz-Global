import { publicMeta } from "@/lib/seo-meta";
import { BlogListJsonLd, FaqJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { listBlogPosts } from "@/lib/blog-server";
import { isListedBlogPost } from "@/lib/cms";
import HomeView from "./home-view";

export const metadata = publicMeta({
  title: "Ranz Global · Travel & Visa",
  description:
    "Vize danışmanlığı: Türkiye ve KKTC’den İngiltere, ABD, Kanada, Schengen dosya hazırlığı. Kuzey Kıbrıs Schengen vize danışmanlığı dahildir. Onay garantisi yoktur.",
  path: "",
  absoluteTitle: true,
});

export default async function Page() {
  const posts = (await listBlogPosts()).filter(isListedBlogPost);
  return (
    <>
      <WebSiteJsonLd />
      <FaqJsonLd />
      {posts.length ? <BlogListJsonLd posts={posts} /> : null}
      <HomeView />
    </>
  );
}
