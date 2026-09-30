"use client";

import CapabilityListSection from "./CapabilityListSection";

const ITEMS = [
  { titleKey: "dental.c1.title", bodyKey: "dental.c1.body" },
  { titleKey: "dental.c2.title", bodyKey: "dental.c2.body" },
  { titleKey: "dental.c3.title", bodyKey: "dental.c3.body" },
  { titleKey: "dental.c4.title", bodyKey: "dental.c4.body" },
  { titleKey: "dental.c5.title", bodyKey: "dental.c5.body" },
  { titleKey: "dental.c6.title", bodyKey: "dental.c6.body" },
] as const;

export default function DentalBillingSection() {
  return (
    <CapabilityListSection
      id="dental-billing"
      eyebrowKey="dental.eyebrow"
      headlineKey="dental.headline"
      bodyKey="dental.body"
      items={[...ITEMS]}
      ctaKey="dental.cta"
      tone="cream"
    />
  );
}
