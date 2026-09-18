"use client";

import { useRef, useState } from "react";
import type { DocumentItem, Locale } from "@/lib/types";
import { documentOpenHref } from "@/lib/blob-evrak";
import { t } from "@/lib/i18n";

const TONE: Record<DocumentItem["status"], { bar: string; labelTr: string; labelEn: string }> = {
  approved: { bar: "bg-[#2f7d4a]", labelTr: "Onaylandı", labelEn: "Approved" },
  uploaded: { bar: "bg-[#c4a056]", labelTr: "İnceleniyor", labelEn: "In review" },
  rejected: { bar: "bg-[#c45c2a]", labelTr: "Revizyon gerekli", labelEn: "Needs revision" },
  empty: { bar: "bg-[#8a3b24]", labelTr: "Eksik", labelEn: "Missing" },
};

export function DocumentStatusCard({
  doc,
  locale,
  onUpload,
}: {
  doc: DocumentItem;
  locale: Locale;
  onUpload?: (file: File) => void | Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tone = TONE[doc.status];
  const openHref = documentOpenHref(doc.filePathname);

  return (
    <article className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {doc.required ? t(locale, "Zorunlu", "Required") : t(locale, "İsteğe bağlı", "Optional")}
          </p>
          <h3 className="mt-1 font-serif text-2xl">{t(locale, doc.labelTr, doc.labelEn)}</h3>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.bar}`} />
          {t(locale, tone.labelTr, tone.labelEn)}
        </span>
      </div>
      {doc.fileName && <p className="mt-2 truncate text-xs text-muted">{doc.fileName}</p>}
      {doc.note && (
        <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-sm leading-6 text-ink-soft">
          <span className="text-xs uppercase tracking-[0.16em] text-gold-deep">
            {t(locale, "Danışman notu", "Advisor note")}
          </span>
          <span className="mt-1 block">{doc.note}</span>
        </p>
      )}
      {error && <p className="mt-2 text-xs text-[#8a3b24]">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {openHref && (
          <a href={openHref} target="_blank" rel="noreferrer" className="btn btn-sm">
            {t(locale, "Belgeyi aç", "Open file")}
          </a>
        )}
        {onUpload && doc.status !== "approved" && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setBusy(true);
                setError(null);
                try {
                  await onUpload(file);
                } catch (err) {
                  setError(err instanceof Error ? err.message : t(locale, "Yükleme başarısız.", "Upload failed."));
                } finally {
                  setBusy(false);
                }
              }}
            />
            <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="btn btn-sm">
              {busy
                ? t(locale, "Yükleniyor…", "Uploading…")
                : doc.status === "empty"
                  ? t(locale, "Belge yükle", "Upload")
                  : t(locale, "Yeni belge yükle", "Upload new document")}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
