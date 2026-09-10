/**
 * Marketing-site hardware categories. Deliberately generic — no payment
 * provider, model, price or availability has been finalized yet, so nothing
 * here should read as a real SKU. This is the seam a future
 * `/hardware` page and `Dashboard → Settings → Hardware` would read from
 * instead of a database table, so swapping in real data later means
 * changing this list, not the components that render it.
 */
export type HardwareCategory = {
  key: string;
  index: string;
  title: string;
  headline: string;
  body: string;
  cta: string;
  status: "coming_soon";
};

export const HARDWARE_CATALOG: HardwareCategory[] = [
  {
    key: "tap-to-pay",
    index: "01",
    title: "Tap to Pay",
    headline: "Your phone can be your checkout.",
    body: "Accept eligible contactless payments directly from a compatible phone — no countertop terminal required.",
    cta: "Learn More",
    status: "coming_soon",
  },
  {
    key: "card-reader",
    index: "02",
    title: "Card Reader",
    headline: "Simple payments, anywhere.",
    body: "A compact, Luxore-compatible card reader for beauty professionals who need a portable checkout.",
    cta: "Explore Hardware",
    status: "coming_soon",
  },
  {
    key: "smart-terminal",
    index: "03",
    title: "Smart Terminal",
    headline: "A better front desk.",
    body: "A modern countertop terminal concept connected directly to Luxore checkout.",
    cta: "Explore Hardware",
    status: "coming_soon",
  },
];
