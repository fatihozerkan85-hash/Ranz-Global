import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Noto_Sans_Arabic, Noto_Sans_SC } from "next/font/google";
import { Providers } from "@/components/providers";
import { OrganizationJsonLd } from "@/components/json-ld";
import { EngagementTracker } from "@/components/engagement-tracker";
import { SITE } from "@/lib/cms";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
});

const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const chinese = Noto_Sans_SC({
  variable: "--font-zh",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ranz Global · Travel & Visa",
    template: "%s · Ranz Global",
  },
  description:
    "Schengen, ABD, BAE, Çin, Rusya, İngiltere ve Kanada vize danışmanlığı. Evrak yükleme ve dosya takibi. Ranz Global Travel & Visa.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Ranz Global",
    images: [{ url: "/logo.jpg", width: 1200, height: 1200, alt: "Ranz Global" }],
  },
  icons: { icon: "/logo.jpg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable} ${arabic.variable} ${chinese.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Providers>
          <OrganizationJsonLd />
          <EngagementTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
