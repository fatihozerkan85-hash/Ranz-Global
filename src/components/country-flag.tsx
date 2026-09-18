"use client";

const FLAGS: Record<string, string> = {
  gb: "/flags/gb.svg",
  us: "/flags/us.svg",
  ca: "/flags/ca.svg",
  eu: "/flags/eu.svg",
  de: "/flags/de.svg",
  dk: "/flags/dk.svg",
  ae: "/flags/ae.svg",
  cn: "/flags/cn.svg",
  ru: "/flags/ru.svg",
  asia: "/flags/asia.svg",
  africa: "/flags/africa.svg",
};

export function CountryFlag({
  code,
  title,
  size = "sm",
}: {
  code: string;
  title?: string;
  size?: "sm" | "md" | "lg";
}) {
  const key = code.toLowerCase();
  const src = FLAGS[key] ?? `/flags/${key}.svg`;
  const fallback = `https://flagcdn.com/w80/${key}.png`;
  const box = size === "lg" ? "h-9 w-12 sm:h-10 sm:w-[3.35rem]" : size === "md" ? "h-5 w-[1.67rem]" : "h-4 w-[1.33rem]";
  return (
    <img
      src={src}
      alt={title ?? ""}
      title={title}
      width={size === "lg" ? 48 : size === "md" ? 27 : 21}
      height={size === "lg" ? 36 : size === "md" ? 20 : 16}
      className={`${box} shrink-0 overflow-hidden rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,39,68,0.12)]`}
      onError={(e) => {
        if (e.currentTarget.dataset.fallback === "1") return;
        e.currentTarget.dataset.fallback = "1";
        e.currentTarget.src = fallback;
      }}
    />
  );
}
