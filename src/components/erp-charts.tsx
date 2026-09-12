"use client";

export function GroupedBars({
  rows,
  aLabel,
  bLabel,
}: {
  rows: { label: string; a: number; b: number }[];
  aLabel: string;
  bLabel: string;
}) {
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b]), 1);
  return (
    <div>
      <div className="mb-4 flex gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-navy" /> {aLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-gold" /> {bLabel}
        </span>
      </div>
      <div className="flex h-52 items-end gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end justify-center gap-1">
              <div
                className="w-[42%] rounded-t-sm bg-navy"
                style={{ height: `${Math.max(4, (row.a / max) * 100)}%` }}
                title={`${aLabel}: ${row.a.toLocaleString("tr-TR")}`}
              />
              <div
                className="w-[42%] rounded-t-sm bg-gold"
                style={{ height: `${Math.max(4, (row.b / max) * 100)}%` }}
                title={`${bLabel}: ${row.b.toLocaleString("tr-TR")}`}
              />
            </div>
            <span className="truncate text-[10px] uppercase tracking-wider text-muted">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HBars({ rows }: { rows: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span>{row.label}</span>
            <span className="text-muted">{row.value.toLocaleString("tr-TR")}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(6, (row.value / max) * 100)}%`,
                background: row.color ?? "var(--color-navy)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
