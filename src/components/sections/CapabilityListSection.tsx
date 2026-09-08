"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";

type CapabilityListSectionProps = {
  id: string;
  eyebrowKey: DictKey;
  headlineKey: DictKey;
  bodyKey: DictKey;
  items: { titleKey: DictKey; bodyKey: DictKey }[];
  ctaKey: DictKey;
  tone?: "cream" | "deep";
};

export default function CapabilityListSection({
  id,
  eyebrowKey,
  headlineKey,
  bodyKey,
  items,
  ctaKey,
  tone = "cream",
}: CapabilityListSectionProps) {
  const { t } = useLanguage();

  return (
    <section id={id} className={`px-6 py-28 ${tone === "deep" ? "bg-cream-deep" : "bg-cream"}`}>
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t(eyebrowKey)}</span>
          <h2
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            dangerouslySetInnerHTML={{ __html: t(headlineKey) }}
          />
          <p className="mt-4 text-sm text-ink/70">{t(bodyKey)}</p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.titleKey}
              delay={(i % 3) * 0.06}
              className="rounded-lg border border-ink/10 bg-cream-soft p-6"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-gold-deep" />
              <h3 className="mt-3 font-display text-base text-ink">{t(item.titleKey)}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{t(item.bodyKey)}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <a
            href="#contact"
            className="inline-block rounded-full bg-ink px-7 py-3 text-[12px] uppercase tracking-[0.14em] text-cream-soft transition hover:bg-gold-deep"
          >
            {t(ctaKey)}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
