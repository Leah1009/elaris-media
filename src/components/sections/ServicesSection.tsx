"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";

const ICONS: Record<string, string> = {
  s1: "M3 3h18v18H3zM12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M17.5 6.5h.01",
  s2: "M4 5h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 5l8 6 8-6",
  s3: "M4 6h13v12H4zM17 9l4-2v10l-4-2",
  s4: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  s5: "M4 20l4-1 11-11-3-3L5 16l-1 4zM13 6l3 3",
  s6: "M12 2l2.6 6.2L21 9l-5 4.6L17.4 20 12 16.6 6.6 20 8 13.6 3 9l6.4-.8Z",
  s7: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.3-4.3",
  s8: "M2 4h20v14H2zM8 21h8M12 18v3",
  s9: "M4 4h16v4H4zM4 11h16v9H4z",
  s10: "M12 2l9 5v10l-9 5-9-5V7z",
  s11: "M4 8h3l2-3h6l2 3h3v11H4zM12 13.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0",
  s12: "M3 17l6-6 4 4 8-8M21 7v6",
};

const SERVICES: { id: string; titleKey: DictKey; bodyKey: DictKey }[] = [
  { id: "s1", titleKey: "services.s1.title", bodyKey: "services.s1.body" },
  { id: "s2", titleKey: "services.s2.title", bodyKey: "services.s2.body" },
  { id: "s3", titleKey: "services.s3.title", bodyKey: "services.s3.body" },
  { id: "s4", titleKey: "services.s4.title", bodyKey: "services.s4.body" },
  { id: "s5", titleKey: "services.s5.title", bodyKey: "services.s5.body" },
  { id: "s6", titleKey: "services.s6.title", bodyKey: "services.s6.body" },
  { id: "s7", titleKey: "services.s7.title", bodyKey: "services.s7.body" },
  { id: "s8", titleKey: "services.s8.title", bodyKey: "services.s8.body" },
  { id: "s9", titleKey: "services.s9.title", bodyKey: "services.s9.body" },
  { id: "s10", titleKey: "services.s10.title", bodyKey: "services.s10.body" },
  { id: "s11", titleKey: "services.s11.title", bodyKey: "services.s11.body" },
  { id: "s12", titleKey: "services.s12.title", bodyKey: "services.s12.body" },
];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="bg-cream px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("services.eyebrow")}</span>
          <h2
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            dangerouslySetInnerHTML={{ __html: t("services.headline") }}
          />
          <p className="mt-4 text-sm text-ink/70">{t("services.body")}</p>
        </Reveal>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 0.06}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                className="mb-3 h-6 w-6 text-gold-deep"
              >
                <path d={ICONS[service.id]} />
              </svg>
              <h3 className="font-display text-base text-ink">{t(service.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{t(service.bodyKey)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
