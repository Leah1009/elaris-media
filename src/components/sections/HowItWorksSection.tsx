"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";

const ICONS: Record<string, string> = {
  s1: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  s2: "M6 2h9l3 3v17H6zM15 2v3h3M8 11h8M8 15h8M8 7h4",
  s3: "M3 17l6-6 4 4 8-8M21 7v6",
};

const STEPS: { titleKey: DictKey; bodyKey: DictKey; chipTitleKey: DictKey; chipSubKey: DictKey; icon: string }[] = [
  { titleKey: "hiw.s1.title", bodyKey: "hiw.s1.body", chipTitleKey: "hiw.s1.chipTitle", chipSubKey: "hiw.s1.chipSub", icon: "s1" },
  { titleKey: "hiw.s2.title", bodyKey: "hiw.s2.body", chipTitleKey: "hiw.s2.chipTitle", chipSubKey: "hiw.s2.chipSub", icon: "s2" },
  { titleKey: "hiw.s3.title", bodyKey: "hiw.s3.body", chipTitleKey: "hiw.s3.chipTitle", chipSubKey: "hiw.s3.chipSub", icon: "s3" },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-cream px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("hiw.eyebrow")}</span>
          </Reveal>
          <MaskReveal
            as="h2"
            delay={0.08}
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            html={t("hiw.headline")}
          />
          <Reveal delay={0.2}>
            <p className="mt-4 text-sm text-ink/70">{t("hiw.body")}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.titleKey} delay={i * 0.1}>
              <div className="flex items-center gap-3 rounded-xl border border-rule bg-cream-soft px-4 py-3 shadow-[0_18px_34px_-22px_rgba(21,18,13,0.3)]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4 text-gold-deep">
                    <path d={ICONS[step.icon]} />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{t(step.chipTitleKey)}</p>
                  <p className="text-[11px] text-ink/45">{t(step.chipSubKey)}</p>
                </div>
              </div>

              <span className="mt-6 block font-display text-3xl text-gold-light">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-lg text-ink">{t(step.titleKey)}</h3>
              <p className="mt-2 text-sm text-ink/60">{t(step.bodyKey)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
