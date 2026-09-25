"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";

const CHANNELS = [
  { key: "meta", icon: "M", widthPct: 82 },
  { key: "google", icon: "G", widthPct: 64 },
  { key: "analytics", icon: "A", widthPct: 46 },
] as const;

export default function AdsAnalyticsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const target = bar.dataset.width;
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.1,
            delay: 0.15 * i,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream-deep px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div data-reveal className="mb-14 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("ads.eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">{t("ads.headline")}</h2>
          <p className="mt-4 text-sm text-ink/70">{t("ads.body")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {(
            [
              { titleKey: "ads.meta.title", bodyKey: "ads.meta.body" },
              { titleKey: "ads.google.title", bodyKey: "ads.google.body" },
              { titleKey: "ads.analytics.title", bodyKey: "ads.analytics.body" },
            ] satisfies { titleKey: DictKey; bodyKey: DictKey }[]
          ).map((card) => (
            <div
              key={card.titleKey}
              data-reveal
              className="rounded-lg border border-ink/10 bg-cream-soft p-7"
            >
              <h3 className="font-display text-lg text-ink">{t(card.titleKey)}</h3>
              <p className="mt-2 text-sm text-ink/60">{t(card.bodyKey)}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-14 rounded-lg border border-ink/10 bg-cream-soft p-8">
          <div className="flex flex-col gap-5">
            {CHANNELS.map((c, i) => (
              <div key={c.key} className="flex items-center gap-4">
                <span className="w-6 shrink-0 font-display text-sm text-gold-deep">{c.icon}</span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
                  <div
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    data-width={c.widthPct}
                    className="h-full rounded-full bg-gold-deep"
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-ink/40">{t("ads.chartLabel")}</p>
        </div>
      </div>
    </section>
  );
}
