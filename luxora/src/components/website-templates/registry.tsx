import type { ReactElement } from "react";
import { MinimalLuxuryTemplate, MINIMAL_LUXURY_SLOTS } from "@/components/website-templates/minimal-luxury-template";
import { ModernDarkTemplate, MODERN_DARK_SLOTS } from "@/components/website-templates/modern-dark-template";
import { SoftBeautyTemplate, SOFT_BEAUTY_SLOTS } from "@/components/website-templates/soft-beauty-template";
import type { WebsiteTemplateProps, ImageSlotSpec } from "@/components/website-templates/types";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

export const WEBSITE_TEMPLATES: {
  key: WebsiteTemplate;
  name: string;
  description: string;
  Component: (props: WebsiteTemplateProps) => ReactElement;
  slots: ImageSlotSpec[];
}[] = [
  {
    key: "minimal_luxury",
    name: "Minimal Luxury",
    description: "Editorial, elegant, cream & muted gold, large whitespace, serif type.",
    Component: MinimalLuxuryTemplate,
    slots: MINIMAL_LUXURY_SLOTS,
  },
  {
    key: "modern_dark",
    name: "Modern Dark",
    description: "Contemporary, dramatic, near-black with warm white & gold accents.",
    Component: ModernDarkTemplate,
    slots: MODERN_DARK_SLOTS,
  },
  {
    key: "soft_beauty",
    name: "Soft Beauty",
    description: "Warm, soft, photography-forward boutique aesthetic in cream & beige.",
    Component: SoftBeautyTemplate,
    slots: SOFT_BEAUTY_SLOTS,
  },
];

export function getWebsiteTemplate(key: string) {
  return WEBSITE_TEMPLATES.find((t) => t.key === key) ?? WEBSITE_TEMPLATES[0];
}
