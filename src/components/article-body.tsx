"use client";

export function ArticleBody({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="max-w-2xl space-y-4 text-sm leading-7 text-ink-soft">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="pt-2 font-serif text-lg text-ink">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-4 font-serif text-2xl text-ink">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={i} className="font-serif text-2xl text-ink">
              {block.slice(2)}
            </h2>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {block.replace(/^[-*]\s/gm, "• ")}
          </p>
        );
      })}
    </div>
  );
}
