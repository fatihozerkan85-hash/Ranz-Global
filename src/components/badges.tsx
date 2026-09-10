import type { AppStatus, DocStatus, Locale } from "@/lib/types";
import { DOC_LABEL, STATUS_LABEL } from "@/lib/i18n";

const appTone: Record<AppStatus, string> = {
  draft: "bg-line text-ink-soft",
  missing: "bg-[#f3ead6] text-gold-deep",
  review: "bg-[#e8eef6] text-ink",
  revision: "bg-[#f6e4dc] text-[#8a3b24]",
  complete: "bg-[#e4efe6] text-[#215c38]",
};

const docTone: Record<DocStatus, string> = {
  empty: "bg-line text-muted",
  uploaded: "bg-[#e8eef6] text-ink",
  approved: "bg-[#e4efe6] text-[#215c38]",
  rejected: "bg-[#f6e4dc] text-[#8a3b24]",
};

export function StatusBadge({ status, locale }: { status: AppStatus; locale: Locale }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${appTone[status]}`}>
      {STATUS_LABEL[status][locale]}
    </span>
  );
}

export function DocBadge({ status, locale }: { status: DocStatus; locale: Locale }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${docTone[status]}`}>
      {DOC_LABEL[status][locale]}
    </span>
  );
}
