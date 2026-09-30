"use client";

import CapabilityListSection from "./CapabilityListSection";

const ITEMS = [
  { titleKey: "admin.c1.title", bodyKey: "admin.c1.body" },
  { titleKey: "admin.c2.title", bodyKey: "admin.c2.body" },
  { titleKey: "admin.c3.title", bodyKey: "admin.c3.body" },
  { titleKey: "admin.c4.title", bodyKey: "admin.c4.body" },
  { titleKey: "admin.c5.title", bodyKey: "admin.c5.body" },
  { titleKey: "admin.c6.title", bodyKey: "admin.c6.body" },
] as const;

export default function AdminServicesSection() {
  return (
    <CapabilityListSection
      id="admin-services"
      eyebrowKey="admin.eyebrow"
      headlineKey="admin.headline"
      bodyKey="admin.body"
      items={[...ITEMS]}
      ctaKey="admin.cta"
      tone="deep"
    />
  );
}
