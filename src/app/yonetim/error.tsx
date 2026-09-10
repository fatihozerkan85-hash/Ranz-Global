"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-8">
      <h1 className="font-serif text-3xl">Panel yüklenemedi</h1>
      <p className="mt-3 text-sm text-ink-soft">{error.message || "Beklenmeyen bir hata oluştu."}</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm text-cream">
        Yeniden dene
      </button>
    </div>
  );
}
