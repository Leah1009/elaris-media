"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";

const QA: { qKey: DictKey; aKey: DictKey }[] = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
];

export default function FaqSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="bg-cream-deep px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-12">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("faq.eyebrow")}</span>
          <h2
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            dangerouslySetInnerHTML={{ __html: t("faq.headline") }}
          />
        </Reveal>

        <div className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
          {QA.map((qa, i) => (
            <Reveal key={qa.qKey} delay={(i % 4) * 0.05}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base text-ink marker:content-none">
                  {t(qa.qKey)}
                  <span className="shrink-0 text-lg text-gold-deep transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/65">{t(qa.aKey)}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
