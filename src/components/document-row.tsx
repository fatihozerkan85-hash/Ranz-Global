"use client";

import { useRef, useState } from "react";
import { ExternalLink, Upload } from "lucide-react";
import type { DocumentItem, Locale } from "@/lib/types";
import { DocBadge } from "@/components/badges";
import { documentOpenHref } from "@/lib/blob-evrak";
import { t } from "@/lib/i18n";

export function DocumentRow({
  doc,
  locale,
  onUpload,
  actions,
}: {
  doc: DocumentItem;
  locale: Locale;
  onUpload?: (file: File) => void | Promise<void>;
  actions?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const label = t(locale, doc.labelTr, doc.labelEn);
  const openHref = documentOpenHref(doc.filePathname);

  return (
    <div className="flex flex-col gap-3 border-b border-line py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-ink">{label}</p>
          {!doc.required && (
            <span className="text-[10px] uppercase tracking-wider text-muted">
              {t(locale, "isteğe bağlı", "optional")}
            </span>
          )}
          <DocBadge status={doc.status} locale={locale} />
        </div>
        {doc.fileName && <p className="mt-1 truncate text-xs text-muted">{doc.fileName}</p>}
        {doc.note && <p className="mt-1 text-xs text-[#8a3b24]">{doc.note}</p>}
        {error && <p className="mt-1 text-xs text-[#8a3b24]">{error}</p>}
      </div>
      <div className="flex items-center gap-2">
        {openHref && (
          <a href={openHref} target="_blank" rel="noreferrer" className="btn btn-sm">
            <ExternalLink size={13} />
            {t(locale, "Aç", "Open")}
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
                  setError(
                    err instanceof Error
                      ? err.message
                      : t(locale, "Yükleme başarısız.", "Upload failed."),
                  );
                } finally {
                  setBusy(false);
                }
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="btn btn-sm"
            >
              <Upload size={13} />
              {busy
                ? t(locale, "Yükleniyor…", "Uploading…")
                : doc.status === "empty"
                  ? t(locale, "Yükle", "Upload")
                  : t(locale, "Yeniden yükle", "Replace")}
            </button>
          </>
        )}
        {actions}
      </div>
    </div>
  );
}
