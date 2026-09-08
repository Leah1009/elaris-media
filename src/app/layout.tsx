import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
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
  title: "Elaris Media — Marketing, Web & Business Support for Small Businesses",
  description:
    "Elaris Media helps small businesses grow with strategy, content, web development, Meta & Google Ads, dental billing and administrative support — built around your business and your budget.",
  keywords: [
    "marketing agency Miami",
    "small business marketing",
    "social media management",
    "Meta ads",
    "Google ads",
    "web development",
    "dental billing services",
    "administrative support",
    "Elaris Media",
  ],
  alternates: { canonical: SITE_URL },
  // Flip to index:true once this rebuild replaces the live site.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Elaris Media",
    title: "Elaris Media — Big Brand Presence for Small Business",
    description:
      "Strategy, content, web development, ads and business support built around your goals, your business and your budget.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elaris Media — Big Brand Presence for Small Business",
    description: "Strategy, content, web development, ads and business support built around your business.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MarketingAgency",
  name: "Elaris Media",
  description:
    "Marketing agency helping small businesses grow with strategy, content, web development, digital ads, dental billing and administrative support.",
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
