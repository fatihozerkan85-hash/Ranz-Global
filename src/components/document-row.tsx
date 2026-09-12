"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import type { DocumentItem, Locale } from "@/lib/types";
import { DocBadge } from "@/components/badges";
import { t } from "@/lib/i18n";

export function DocumentRow({
  doc,
  locale,
  onUpload,
  actions,
}: {
  doc: DocumentItem;
  locale: Locale;
  onUpload?: (file: File) => void;
  actions?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = t(locale, doc.labelTr, doc.labelEn);

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
      </div>
      <div className="flex items-center gap-2">
        {onUpload && doc.status !== "approved" && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn btn-sm"
            >
              <Upload size={13} />
              {doc.status === "empty" ? t(locale, "Yükle", "Upload") : t(locale, "Yeniden yükle", "Replace")}
            </button>
          </>
        )}
        {actions}
      </div>
    </div>
  );
}
