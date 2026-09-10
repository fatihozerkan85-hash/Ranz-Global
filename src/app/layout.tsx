import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import { OrganizationJsonLd } from "@/components/json-ld";
import { EngagementTracker } from "@/components/engagement-tracker";
import { SITE } from "@/lib/cms";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ranz Global · Travel & Visa",
    template: "%s · Ranz Global",
  },
  description:
    "Avrupa ve Amerika vizeleri için evrak yükleme, danışman incelemesi ve dosya takibi. Ranz Global Travel & Visa.",
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
    <html lang="tr" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
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
