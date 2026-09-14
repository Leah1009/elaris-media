import type { TranslationKey } from "@/lib/luxora/i18n";

/**
 * Marketing-site hardware categories. Deliberately generic — no payment
 * provider, model, price or availability has been finalized yet, so nothing
 * here should read as a real SKU. This is the seam a future
 * `/hardware` page and `Dashboard → Settings → Hardware` would read from
 * instead of a database table, so swapping in real data later means
 * changing this list, not the components that render it. Copy lives in the
 * i18n dictionary (headlineKey/bodyKey/ctaKey) so it stays translated.
 */
export type HardwareCategory = {
  key: string;
  index: string;
  headlineKey: TranslationKey;
  bodyKey: TranslationKey;
  ctaKey: TranslationKey;
  status: "coming_soon";
};

export const HARDWARE_CATALOG: HardwareCategory[] = [
  { key: "tap-to-pay", index: "01", headlineKey: "hardware_tap_headline", bodyKey: "hardware_tap_body", ctaKey: "hardware_cta", status: "coming_soon" },
  { key: "card-reader", index: "02", headlineKey: "hardware_card_headline", bodyKey: "hardware_card_body", ctaKey: "hardware_cta", status: "coming_soon" },
  { key: "smart-terminal", index: "03", headlineKey: "hardware_terminal_headline", bodyKey: "hardware_terminal_body", ctaKey: "hardware_cta", status: "coming_soon" },
];
