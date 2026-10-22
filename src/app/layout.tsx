import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const SITE_URL = "https://www.elarismedia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Elaris Media — Marketing & Web for Small Businesses",
  description:
    "Elaris Media helps small businesses grow with strategy, content, web development and Meta & Google Ads — built around your business and your budget.",
  keywords: [
    "marketing agency Miami",
    "small business marketing",
    "social media management",
    "Meta ads",
    "Google ads",
    "web development",
    "Elaris Media",
  ],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Elaris Media",
    title: "Elaris Media — Big Brand Presence for Small Business",
    description:
      "Strategy, content, web development and ads built around your goals, your business and your budget.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elaris Media — Big Brand Presence for Small Business",
    description: "Strategy, content, web development and ads built around your business.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  name: "Elaris Media",
  description:
    "Marketing agency helping small businesses grow with strategy, content, web development and digital ads.",
  telephone: "+1-786-765-9267",
  email: "elarismediaservices@gmail.com",
  areaServed: "Miami, FL",
  sameAs: ["https://instagram.com/elaris.media"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <CustomCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
