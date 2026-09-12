"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { compressImage, slugify } from "@/lib/media";
import {
  addMedia,
  deleteGuide,
  deleteMedia,
  deletePage,
  deletePost,
  saveGuide,
  saveHome,
  savePage,
  savePost,
} from "@/lib/store";
import { useGuides, useHome, useMedia, usePages, usePosts } from "@/lib/use-site";
import type { BlogPost, CmsPage, HomeCard, HomeContent, HomeStep } from "@/lib/types";

type Tab = "home" | "pages" | "guides" | "blog" | "media";

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      {label}
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-cream p-3 text-sm outline-none focus:border-gold"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
        />
      )}
    </label>
  );
}

function ImagePick({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (id: string | undefined) => void;
}) {
  const { locale } = useLocale();
  const media = useMedia();
  return (
    <div>
      <p className="text-sm">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-lg border px-2 py-1 text-xs ${!value ? "border-gold bg-cream" : "border-line"}`}
          onClick={() => onChange(undefined)}
        >
          {t(locale, "Görsel yok", "No image")}
        </button>
        {media.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={`overflow-hidden rounded-lg border ${value === m.id ? "border-gold" : "border-line"}`}
          >
            <img src={m.dataUrl} alt={m.name} className="h-14 w-14 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function CardList({
  items,
  onChange,
}: {
  items: HomeCard[];
  onChange: (next: HomeCard[]) => void;
}) {
  const { locale } = useLocale();
  return (
    <div className="space-y-3">
      {items.map((card, i) => (
        <div key={card.id} className="grid gap-2 rounded-xl border border-line p-3 md:grid-cols-2">
          <input
            value={card.titleTr}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...card, titleTr: e.target.value };
              onChange(next);
            }}
            className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            placeholder="Başlık TR"
          />
          <input
            value={card.titleEn}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...card, titleEn: e.target.value };
              onChange(next);
            }}
            className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            placeholder="Title EN"
          />
          <input
            value={card.hintTr}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...card, hintTr: e.target.value };
              onChange(next);
            }}
            className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            placeholder="Alt metin TR"
          />
          <div className="flex gap-2">
            <input
              value={card.hintEn}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...card, hintEn: e.target.value };
                onChange(next);
              }}
              className="flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm"
              placeholder="Hint EN"
            />
            <button type="button" className="text-xs text-[#8a3b24]" onClick={() => onChange(items.filter((c) => c.id !== card.id))}>
              {t(locale, "Sil", "Remove")}
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-gold-deep"
        onClick={() =>
          onChange([...items, { id: `c-${Date.now()}`, titleTr: "", titleEn: "", hintTr: "", hintEn: "" }])
        }
      >
        {t(locale, "+ Kart ekle", "+ Add card")}
      </button>
    </div>
  );
}

function PageEditor({
  page,
  onSave,
  onDelete,
}: {
  page: CmsPage;
  onSave: (p: CmsPage) => void;
  onDelete?: () => void;
}) {
  const { locale } = useLocale();
  const [draft, setDraft] = useState(page);
  const set = (patch: Partial<CmsPage>) => setDraft((d) => ({ ...d, ...patch }));
  return (
    <article className="space-y-3 rounded-2xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">/{draft.slug}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-gold-deep"
            onClick={() => set({ status: draft.status === "published" ? "draft" : "published" })}
          >
            {draft.status}
          </button>
          {onDelete && (
            <button type="button" className="text-xs text-[#8a3b24]" onClick={onDelete}>
              {t(locale, "Sil", "Delete")}
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label={t(locale, "Başlık TR", "Title TR")} value={draft.titleTr} onChange={(v) => set({ titleTr: v })} />
        <Field label={t(locale, "Başlık EN", "Title EN")} value={draft.titleEn} onChange={(v) => set({ titleEn: v })} />
        <Field label={t(locale, "Özet TR", "Summary TR")} value={draft.descriptionTr} onChange={(v) => set({ descriptionTr: v })} rows={2} />
        <Field label={t(locale, "Özet EN", "Summary EN")} value={draft.descriptionEn} onChange={(v) => set({ descriptionEn: v })} rows={2} />
      </div>
      <Field label={t(locale, "Metin TR", "Body TR")} value={draft.bodyTr} onChange={(v) => set({ bodyTr: v })} rows={6} />
      <Field label={t(locale, "Metin EN", "Body EN")} value={draft.bodyEn} onChange={(v) => set({ bodyEn: v })} rows={6} />
      <ImagePick label={t(locale, "Görsel", "Image")} value={draft.imageId} onChange={(imageId) => set({ imageId })} />
      <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm text-cream" onClick={() => onSave(draft)}>
        {t(locale, "Kaydet", "Save")}
      </button>
    </article>
  );
}

export default function SiteContentPage() {
  const { locale } = useLocale();
  const [tab, setTab] = useState<Tab>("home");
  const home = useHome();
  const pages = usePages();
  const guides = useGuides();
  const posts = usePosts(true);
  const media = useMedia();
  const [draftHome, setDraftHome] = useState<HomeContent | null>(null);
  const current = draftHome ?? home;

  const tabs: { id: Tab; tr: string; en: string }[] = [
    { id: "home", tr: "Anasayfa", en: "Home" },
    { id: "pages", tr: "Sayfalar", en: "Pages" },
    { id: "guides", tr: "Rehber", en: "Guides" },
    { id: "blog", tr: "Blog", en: "Blog" },
    { id: "media", tr: "Görseller", en: "Images" },
  ];

  const patchHome = (patch: Partial<HomeContent>) => {
    if (!current) return;
    setDraftHome({ ...current, ...patch });
  };

  const onUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const dataUrl = await compressImage(file);
    addMedia({ id: `img-${Date.now()}`, name: file.name, dataUrl });
    e.currentTarget.reset();
  };

  const addPage = (kind: "page" | "guide" | "post") => {
    const title = prompt(t(locale, "Başlık", "Title"));
    if (!title) return;
    const slug = slugify(title) || `yazi-${Date.now()}`;
    if (kind === "post") {
      const post: BlogPost = {
        slug,
        titleTr: title,
        titleEn: title,
        excerptTr: "",
        excerptEn: "",
        bodyTr: "",
        bodyEn: "",
        coverAltTr: title,
        coverAltEn: title,
        publishedAt: new Date().toISOString().slice(0, 10),
        status: "published",
      };
      savePost(post);
      return;
    }
    const page: CmsPage = {
      slug,
      titleTr: title,
      titleEn: title,
      descriptionTr: "",
      descriptionEn: "",
      bodyTr: "",
      bodyEn: "",
      status: "published",
    };
    if (kind === "guide") saveGuide(page);
    else savePage(page);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{t(locale, "Yönetici", "Admin")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t(locale, "Site içeriği", "Site content")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        {t(
          locale,
          "Sitedeki metin ve görselleri ekleyin, düzeltin veya silin. Header logosu buradan değişmez.",
          "Add, edit or remove site copy and images. The header logo is not changed here.",
        )}
      </p>
      <nav className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-3 py-1.5 text-xs ${tab === item.id ? "bg-ink text-cream" : "border border-line bg-paper"}`}
          >
            {t(locale, item.tr, item.en)}
          </button>
        ))}
      </nav>

      {tab === "home" && current && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label={t(locale, "Hero başlık TR", "Hero title TR")} value={current.heroTitleTr} onChange={(v) => patchHome({ heroTitleTr: v })} />
            <Field label={t(locale, "Hero başlık EN", "Hero title EN")} value={current.heroTitleEn} onChange={(v) => patchHome({ heroTitleEn: v })} />
            <Field label={t(locale, "Hero metin TR", "Hero lead TR")} value={current.heroLeadTr} onChange={(v) => patchHome({ heroLeadTr: v })} rows={3} />
            <Field label={t(locale, "Hero metin EN", "Hero lead EN")} value={current.heroLeadEn} onChange={(v) => patchHome({ heroLeadEn: v })} rows={3} />
            <Field label={t(locale, "Birincil buton TR", "Primary button TR")} value={current.ctaPrimaryTr} onChange={(v) => patchHome({ ctaPrimaryTr: v })} />
            <Field label={t(locale, "Birincil buton EN", "Primary button EN")} value={current.ctaPrimaryEn} onChange={(v) => patchHome({ ctaPrimaryEn: v })} />
          </div>
          <ImagePick label={t(locale, "Hero görseli", "Hero image")} value={current.heroImageId} onChange={(heroImageId) => patchHome({ heroImageId })} />
          <h2 className="font-serif text-2xl">{t(locale, "Ülke kartları", "Country cards")}</h2>
          <CardList items={current.destCards} onChange={(destCards) => patchHome({ destCards })} />
          <h2 className="font-serif text-2xl">{t(locale, "Adımlar", "Steps")}</h2>
          <Field label={t(locale, "Adımlar başlığı TR", "Steps title TR")} value={current.stepsTitleTr} onChange={(v) => patchHome({ stepsTitleTr: v })} />
          <Field label={t(locale, "Adımlar başlığı EN", "Steps title EN")} value={current.stepsTitleEn} onChange={(v) => patchHome({ stepsTitleEn: v })} />
          {current.steps.map((step, i) => (
            <div key={step.id} className="space-y-2 rounded-xl border border-line p-3">
              <div className="flex justify-between">
                <input
                  value={step.n}
                  onChange={(e) => {
                    const steps = [...current.steps];
                    steps[i] = { ...step, n: e.target.value };
                    patchHome({ steps });
                  }}
                  className="w-20 rounded-lg border border-line bg-cream px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  className="text-xs text-[#8a3b24]"
                  onClick={() => patchHome({ steps: current.steps.filter((s) => s.id !== step.id) })}
                >
                  {t(locale, "Sil", "Remove")}
                </button>
              </div>
              <input
                value={step.titleTr}
                onChange={(e) => {
                  const steps = [...current.steps];
                  steps[i] = { ...step, titleTr: e.target.value };
                  patchHome({ steps });
                }}
                className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm"
              />
              <textarea
                value={step.bodyTr}
                onChange={(e) => {
                  const steps = [...current.steps];
                  steps[i] = { ...step, bodyTr: e.target.value };
                  patchHome({ steps });
                }}
                rows={2}
                className="w-full rounded-lg border border-line bg-cream p-3 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-gold-deep"
            onClick={() =>
              patchHome({
                steps: [
                  ...current.steps,
                  { id: `s-${Date.now()}`, n: String(current.steps.length + 1).padStart(2, "0"), titleTr: "", titleEn: "", bodyTr: "", bodyEn: "" } satisfies HomeStep,
                ],
              })
            }
          >
            {t(locale, "+ Adım ekle", "+ Add step")}
          </button>
          <h2 className="font-serif text-2xl">{t(locale, "Vize bölümü", "Visa section")}</h2>
          <Field label="Başlık TR" value={current.visaTitleTr} onChange={(v) => patchHome({ visaTitleTr: v })} />
          <Field label="Metin TR" value={current.visaLeadTr} onChange={(v) => patchHome({ visaLeadTr: v })} rows={3} />
          <CardList items={current.visaCards} onChange={(visaCards) => patchHome({ visaCards })} />
          <h2 className="font-serif text-2xl">{t(locale, "İletişim ve alt bilgi", "Contact & footer")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label={t(locale, "E-posta", "Email")} value={current.email} onChange={(v) => patchHome({ email: v })} />
            <Field label={t(locale, "Telefon", "Phone")} value={current.phone} onChange={(v) => patchHome({ phone: v })} />
            <Field label={t(locale, "Şehir TR", "City TR")} value={current.cityTr} onChange={(v) => patchHome({ cityTr: v })} />
            <Field label={t(locale, "Şehir EN", "City EN")} value={current.cityEn} onChange={(v) => patchHome({ cityEn: v })} />
            <Field label={t(locale, "İletişim başlığı TR", "Contact title TR")} value={current.contactTitleTr} onChange={(v) => patchHome({ contactTitleTr: v })} />
            <Field label={t(locale, "İletişim metni TR", "Contact lead TR")} value={current.contactLeadTr} onChange={(v) => patchHome({ contactLeadTr: v })} rows={2} />
            <Field label={t(locale, "Güven metni TR", "Trust title TR")} value={current.trustTitleTr} onChange={(v) => patchHome({ trustTitleTr: v })} rows={3} />
            <Field label={t(locale, "Güven gövde TR", "Trust body TR")} value={current.trustBodyTr} onChange={(v) => patchHome({ trustBodyTr: v })} rows={3} />
            <Field label={t(locale, "Footer notu TR", "Footer note TR")} value={current.footerNoteTr} onChange={(v) => patchHome({ footerNoteTr: v })} rows={2} />
            <Field label={t(locale, "Footer notu EN", "Footer note EN")} value={current.footerNoteEn} onChange={(v) => patchHome({ footerNoteEn: v })} rows={2} />
          </div>
          <ImagePick
            label={t(locale, "Anasayfa galeri", "Home gallery")}
            value={undefined}
            onChange={(id) => {
              if (!id) return;
              if (current.galleryIds.includes(id)) patchHome({ galleryIds: current.galleryIds.filter((g) => g !== id) });
              else patchHome({ galleryIds: [...current.galleryIds, id] });
            }}
          />
          <p className="text-xs text-muted">
            {t(locale, "Galerideki görseller:", "Gallery images:")} {current.galleryIds.length}
          </p>
          <button type="button" className="rounded-full bg-ink px-6 py-3 text-sm text-cream" onClick={() => saveHome(current)}>
            {t(locale, "Anasayfayı kaydet", "Save homepage")}
          </button>
        </div>
      )}

      {tab === "pages" && (
        <div className="mt-8 space-y-4">
          <button type="button" className="text-sm text-gold-deep" onClick={() => addPage("page")}>
            {t(locale, "+ Sayfa ekle", "+ Add page")}
          </button>
          <p className="text-xs text-muted">
            {t(
              locale,
              "Yeni sayfalar /sayfa/adres altında açılır. Hakkımızda, KVKK ve gizlilik kendi adreslerinde kalır.",
              "New pages open at /sayfa/slug. About, KVKK and privacy keep their own URLs.",
            )}
          </p>
          {pages.map((p) => (
            <PageEditor
              key={p.slug}
              page={p}
              onSave={savePage}
              onDelete={() => {
                if (confirm(t(locale, "Sayfa silinsin mi?", "Delete this page?"))) deletePage(p.slug);
              }}
            />
          ))}
        </div>
      )}

      {tab === "guides" && (
        <div className="mt-8 space-y-4">
          <button type="button" className="text-sm text-gold-deep" onClick={() => addPage("guide")}>
            {t(locale, "+ Rehber ekle", "+ Add guide")}
          </button>
          {guides.map((p) => (
            <PageEditor
              key={p.slug}
              page={p}
              onSave={saveGuide}
              onDelete={() => {
                if (confirm(t(locale, "Rehber silinsin mi?", "Delete this guide?"))) deleteGuide(p.slug);
              }}
            />
          ))}
        </div>
      )}

      {tab === "blog" && (
        <div className="mt-8 space-y-4">
          <button type="button" className="text-sm text-gold-deep" onClick={() => addPage("post")}>
            {t(locale, "+ Yazı ekle", "+ Add article")}
          </button>
          {posts.map((p) => (
            <PageEditor
              key={p.slug}
              page={{
                slug: p.slug,
                titleTr: p.titleTr,
                titleEn: p.titleEn,
                descriptionTr: p.excerptTr,
                descriptionEn: p.excerptEn,
                bodyTr: p.bodyTr,
                bodyEn: p.bodyEn,
                imageId: p.imageId,
                status: p.status === "scheduled" ? "draft" : p.status,
              }}
              onSave={(page) =>
                savePost({
                  ...p,
                  titleTr: page.titleTr,
                  titleEn: page.titleEn,
                  excerptTr: page.descriptionTr,
                  excerptEn: page.descriptionEn,
                  bodyTr: page.bodyTr,
                  bodyEn: page.bodyEn,
                  imageId: page.imageId,
                  status: page.status === "draft" ? "draft" : "published",
                })
              }
              onDelete={() => {
                if (confirm(t(locale, "Yazı silinsin mi?", "Delete this article?"))) deletePost(p.slug);
              }}
            />
          ))}
        </div>
      )}

      {tab === "media" && (
        <div className="mt-8">
          <form onSubmit={onUpload} className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-paper p-5">
            <label className="text-sm">
              {t(locale, "Görsel yükle", "Upload image")}
              <input name="file" type="file" accept="image/*" required className="mt-1 block text-sm" />
            </label>
            <button className="rounded-full bg-ink px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
          </form>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {media.map((m) => (
              <figure key={m.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
                <img src={m.dataUrl} alt={m.name} className="h-40 w-full object-cover" />
                <figcaption className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="truncate">{m.name}</span>
                  <button type="button" className="text-[#8a3b24]" onClick={() => deleteMedia(m.id)}>
                    {t(locale, "Sil", "Delete")}
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
