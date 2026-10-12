"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-cream px-6 pb-24 pt-40 md:pt-48">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("hero.eyebrow")}</span>
          <h1
            className="mt-5 font-display text-[42px] leading-[1.08] text-ink sm:text-5xl lg:text-[56px]"
            dangerouslySetInnerHTML={{ __html: t("hero.headline") }}
          />
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">{t("hero.body")}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-ink px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-cream-soft transition hover:bg-gold-deep"
            >
              {t("hero.ctaPrimary")}
            </a>
            <a
              href="#services"
              className="rounded-full border border-ink/15 px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-ink transition hover:border-ink/40"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-rule bg-cream-deep/70">
            <div className="absolute inset-5 flex items-center justify-center rounded-xl border border-dashed border-gold/40">
              <span className="text-[11px] uppercase tracking-[0.3em] text-ink/35">{t("hero.mediaLabel")}</span>
            </div>
            <span className="absolute left-5 top-5 h-2 w-2 rounded-full border border-gold/50" />
            <span className="absolute bottom-5 right-5 h-2 w-2 rounded-full border border-gold/50" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
