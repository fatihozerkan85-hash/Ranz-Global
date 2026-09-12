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
  const src = FLAGS[code] ?? FLAGS.eu;
  const box = size === "lg" ? "h-10 w-14" : size === "md" ? "h-5 w-7" : "h-4 w-[1.35rem]";
  return (
    <img
      src={src}
      alt={title ?? ""}
      title={title}
      className={`${box} shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(15,39,68,0.12)]`}
    />
  );
}
