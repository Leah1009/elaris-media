"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";

type Panel = {
  id: string;
  eyebrowKey: DictKey;
  headlineKey: DictKey;
  bodyKey: DictKey;
  items: { titleKey: DictKey; bodyKey: DictKey }[];
  ctaKey: DictKey;
};

const DENTAL_ITEMS: Panel["items"] = [
  { titleKey: "dental.c1.title", bodyKey: "dental.c1.body" },
  { titleKey: "dental.c2.title", bodyKey: "dental.c2.body" },
  { titleKey: "dental.c3.title", bodyKey: "dental.c3.body" },
  { titleKey: "dental.c4.title", bodyKey: "dental.c4.body" },
  { titleKey: "dental.c5.title", bodyKey: "dental.c5.body" },
  { titleKey: "dental.c6.title", bodyKey: "dental.c6.body" },
];

const ADMIN_ITEMS: Panel["items"] = [
  { titleKey: "admin.c1.title", bodyKey: "admin.c1.body" },
  { titleKey: "admin.c2.title", bodyKey: "admin.c2.body" },
  { titleKey: "admin.c3.title", bodyKey: "admin.c3.body" },
  { titleKey: "admin.c4.title", bodyKey: "admin.c4.body" },
  { titleKey: "admin.c5.title", bodyKey: "admin.c5.body" },
  { titleKey: "admin.c6.title", bodyKey: "admin.c6.body" },
];

const PANELS: Panel[] = [
  {
    id: "dental-billing",
    eyebrowKey: "dental.eyebrow",
    headlineKey: "dental.headline",
    bodyKey: "dental.body",
    items: DENTAL_ITEMS,
    ctaKey: "dental.cta",
  },
  {
    id: "admin-services",
    eyebrowKey: "admin.eyebrow",
    headlineKey: "admin.headline",
    bodyKey: "admin.body",
    items: ADMIN_ITEMS,
    ctaKey: "admin.cta",
  },
];

function PanelBlock({ panel }: { panel: Panel }) {
  const { t } = useLanguage();

  return (
    <div id={panel.id} className="scroll-mt-24 rounded-2xl border border-rule bg-cream-soft p-8 md:p-10">
      <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t(panel.eyebrowKey)}</span>
      <h3
        className="mt-3 font-display text-2xl text-ink md:text-[28px]"
        dangerouslySetInnerHTML={{ __html: t(panel.headlineKey) }}
      />
      <p className="mt-3 text-sm text-ink/70">{t(panel.bodyKey)}</p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {panel.items.map((item) => (
          <li key={item.titleKey} className="border-t border-rule pt-4">
            <span className="block h-1.5 w-1.5 rounded-full bg-gold-deep" />
            <h4 className="mt-2.5 font-display text-[15px] text-ink">{t(item.titleKey)}</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{t(item.bodyKey)}</p>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="mt-9 inline-block rounded-full bg-ink px-7 py-3 text-[12px] uppercase tracking-[0.14em] text-cream-soft transition hover:bg-gold-deep"
      >
        {t(panel.ctaKey)}
      </a>
    </div>
  );
}

export default function SpecializedSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-cream-deep px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("specialized.eyebrow")}</span>
          <h2
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            dangerouslySetInnerHTML={{ __html: t("specialized.headline") }}
          />
          <p className="mt-4 text-sm text-ink/70">{t("specialized.body")}</p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {PANELS.map((panel, i) => (
            <Reveal key={panel.id} delay={i * 0.08}>
              <PanelBlock panel={panel} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
