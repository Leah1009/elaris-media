"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";

const STEPS: { titleKey: DictKey; bodyKey: DictKey }[] = [
  { titleKey: "hiw.s1.title", bodyKey: "hiw.s1.body" },
  { titleKey: "hiw.s2.title", bodyKey: "hiw.s2.body" },
  { titleKey: "hiw.s3.title", bodyKey: "hiw.s3.body" },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-cream px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("hiw.eyebrow")}</span>
          <h2
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            dangerouslySetInnerHTML={{ __html: t("hiw.headline") }}
          />
          <p className="mt-4 text-sm text-ink/70">{t("hiw.body")}</p>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.titleKey} delay={i * 0.1}>
              <span className="font-display text-3xl text-gold-light">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-lg text-ink">{t(step.titleKey)}</h3>
              <p className="mt-2 text-sm text-ink/60">{t(step.bodyKey)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
