"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";

const PILLARS: { titleKey: DictKey; subKey: DictKey }[] = [
  { titleKey: "about.p1.title", subKey: "about.p1.sub" },
  { titleKey: "about.p2.title", subKey: "about.p2.sub" },
  { titleKey: "about.p3.title", subKey: "about.p3.sub" },
  { titleKey: "about.p4.title", subKey: "about.p4.sub" },
];

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-cream-deep px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("about.eyebrow")}</span>
          <h2
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            dangerouslySetInnerHTML={{ __html: t("about.headline") }}
          />
          <p className="mt-4 text-sm text-ink/70">{t("about.body")}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.titleKey} delay={i * 0.08} className="border-t border-ink/15 pt-5">
              <h3 className="font-display text-lg text-ink">{t(p.titleKey)}</h3>
              <p className="mt-1 font-display text-sm italic text-gold-deep">{t(p.subKey)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
