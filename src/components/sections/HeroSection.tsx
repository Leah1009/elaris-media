"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import DeviceMockup from "@/components/DeviceMockup";
import Parallax from "@/components/Parallax";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-cream px-6 pb-24 pt-40 md:pt-48">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("hero.eyebrow")}</span>
          </Reveal>
          <MaskReveal
            as="h1"
            delay={0.08}
            className="mt-5 font-display text-[42px] leading-[1.08] text-ink sm:text-5xl lg:text-[56px]"
            html={t("hero.headline")}
          />
          <Reveal delay={0.2}>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">{t("hero.body")}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-ink px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-cream-soft transition hover:bg-gold-deep"
            >
              {t("hero.ctaPrimary")}
            </a>
            <a
              href="#portfolio"
              className="rounded-full border border-ink/15 px-7 py-3.5 text-[12px] uppercase tracking-[0.14em] text-ink transition hover:border-ink/40"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
         <Parallax amount={20}>
          <DeviceMockup
            browser={
              <div className="flex h-full flex-col bg-cream-deep/30 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-ink">
                    E<span className="text-gold-deep">M</span>
                  </span>
                  <div className="flex gap-3">
                    <span className="h-1 w-8 rounded-full bg-ink/15" />
                    <span className="h-1 w-8 rounded-full bg-ink/15" />
                    <span className="h-1 w-8 rounded-full bg-ink/15" />
                  </div>
                </div>
                <div className="mt-auto">
                  <span className="block h-2.5 w-3/4 rounded-full bg-ink/70" />
                  <span className="mt-2 block h-2.5 w-1/2 rounded-full bg-ink/70" />
                  <span className="mt-4 block h-2 w-2/3 rounded-full bg-ink/20" />
                  <span className="mt-5 inline-block rounded-full bg-gold-deep px-5 py-1.5 text-[9px] uppercase tracking-[0.1em] text-cream-soft">
                    {t("hero.ctaPrimary")}
                  </span>
                </div>
              </div>
            }
            phone={
              <div className="flex h-full flex-col gap-3 bg-cream-deep/40 p-3 pt-5">
                <span className="mx-auto h-1 w-7 rounded-full bg-ink/20" />
                <span className="block h-10 w-full rounded-md bg-gold/30" />
                <span className="block h-2 w-3/4 rounded-full bg-ink/60" />
                <span className="block h-2 w-1/2 rounded-full bg-ink/30" />
                <span className="mt-auto block h-7 w-full rounded-full bg-ink" />
              </div>
            }
          />
         </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
