import { publicMeta } from "@/lib/seo-meta";
import { BlogListJsonLd, FaqJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { listBlogPosts } from "@/lib/blog-server";
import HomeView from "./home-view";

export const metadata = publicMeta({
  title: "Ranz Global · Travel & Visa",
  description:
    "Türkiye ve KKTC’den İngiltere, ABD, Kanada, Schengen ve diğer vize dosyalarında dijital danışmanlık. Ranz Global vize onayı garantisi vermez.",
  path: "",
  absoluteTitle: true,
});

export default async function Page() {
  const posts = (await listBlogPosts()).filter((p) => p.status === "published");
  return (
    <>
      <WebSiteJsonLd />
      <FaqJsonLd />
      {posts.length ? <BlogListJsonLd posts={posts} /> : null}
      <HomeView initialPosts={posts} />
    </>
  );
}
