import type { WebsiteRenderData } from "@/lib/luxora/website-data";
import type { Locale } from "@/lib/luxora/i18n";

export type WebsiteBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  website_tagline: string | null;
  instagram_url: string | null;
  logo_url: string | null;
  brand_color: string | null;
  show_team: boolean;
  show_reviews: boolean;
};

export type WebsiteTemplateProps = {
  business: WebsiteBusiness;
  data: WebsiteRenderData;
  images: Record<string, string>;
  devMode: boolean;
  locale?: Locale;
};

export type ImageSlotSpec = {
  key: string;
  label: string;
  subject: string;
  aspect: "16:9" | "4:5" | "1:1" | "3:4" | "9:16";
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const CATEGORY_ICON: Record<string, string> = {
  hair: "M12 3c-3 0-5 2.5-5 5.5 0 2 1 3.5 1 5.5 0 2-1.5 3-1.5 5 0 1.5 1.5 2 2.5 1 .5-.5.5-1.5 1-1.5s.5 1 1 1.5c1 1 2.5.5 2.5-1 0-2-1.5-3-1.5-5 0-2 1-3.5 1-5.5C17 5.5 15 3 12 3z",
  nails: "M7 21l1-8 2-9 2 9-1 8M12 21l1-9 2-8 2 8-1 9M17 21l1-7 1-6",
  lashes: "M4 14c2-4 5-6 8-6s6 2 8 6M6 14l-1.5 3M10 12.5L9 16M14 12.5l1 3.5M18 14l1.5 3",
  brows: "M4 12c2-3 5-4 7-4s3 1 3 1M14 12c2-3 5-4 7-4",
  makeup: "M9 3v6l-3 3v9h12v-9l-3-3V3M9 3h6",
  skincare: "M12 3c4 3 7 6 7 10a7 7 0 11-14 0c0-4 3-7 7-10z",
};

export function categoryIconPath(category: string): string {
  const key = category.toLowerCase();
  for (const name of Object.keys(CATEGORY_ICON)) {
    if (key.includes(name)) return CATEGORY_ICON[name];
  }
  return "M12 3l2.5 6.5H21l-5.5 4 2 6.5-5.5-4-5.5 4 2-6.5L3 9.5h6.5z";
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
