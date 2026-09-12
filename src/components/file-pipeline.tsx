"use client";

import type { Application, Locale } from "@/lib/types";
import { fileStages } from "@/lib/pipeline";
import { t } from "@/lib/i18n";

export function FilePipeline({ app, locale }: { app: Application; locale: Locale }) {
  const stages = fileStages(app, locale);
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(locale, "Başvurum", "My application")}</p>
      <h2 className="mt-2 font-serif text-2xl">{t(locale, app.destinationTr, app.destinationEn)}</h2>
      <ol className="mt-5 space-y-2.5">
        {stages.map((stage) => (
          <li key={stage.id} className="flex items-center gap-3 text-sm">
            <span
              className={
                stage.state === "done"
                  ? "h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f7d4a]"
                  : stage.state === "current"
                    ? "h-2.5 w-2.5 shrink-0 rounded-full bg-[#c4a056]"
                    : "h-2.5 w-2.5 shrink-0 rounded-full bg-line"
              }
              aria-hidden
            />
            <span className={stage.state === "todo" ? "text-muted" : "text-ink"}>{stage.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
