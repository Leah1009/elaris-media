"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import { waLink } from "@/lib/constants";
import DeviceMockup from "@/components/DeviceMockup";

export default function PortfolioReviewsSection() {
  const { t, lang } = useLanguage();

  const reviewMsg =
    lang === "es"
      ? "Hola Elaris Media! Me encantaría dejarles una reseña."
      : "Hi Elaris Media! I'd love to leave you a review.";

  return (
    <>
      <section id="portfolio" className="bg-cream-deep px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <Reveal>
              <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("portfolio.eyebrow")}</span>
            </Reveal>
            <MaskReveal
              as="h2"
              delay={0.08}
              className="mt-3 font-display text-3xl text-ink md:text-4xl"
            >
              {t("portfolio.headline")}
            </MaskReveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-sm text-ink/70">{t("portfolio.body")}</p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Reveal delay={0.1}>
              <DeviceMockup
                browser={
                  <div className="flex h-full flex-col justify-center gap-2 bg-cream-deep/30 p-8 pr-[40%]">
                    <h3 className="font-display text-base text-ink">{t("portfolio.pendingT")}</h3>
                    <p className="max-w-xs text-[12px] text-ink/55">{t("portfolio.pendingS")}</p>
                  </div>
                }
                phone={
                  <div className="flex h-full items-center justify-center bg-cream-deep/40 p-3">
                    <span className="font-display text-sm text-ink/30">E</span>
                  </div>
                }
              />
            </Reveal>

            <div className="flex flex-col gap-6">
              {(
                [
                  { icon: "M3 3h18v18H3zM12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", labelKey: "portfolio.cat1" },
                  { icon: "M4 8h3l2-3h6l2 3h3v11H4zM12 13.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0", labelKey: "portfolio.cat2" },
                  { icon: "M4 5h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 5l8 6 8-6", labelKey: "portfolio.cat3" },
                ] as const
              ).map((cat, i) => (
                <Reveal
                  key={cat.labelKey}
                  delay={0.15 + i * 0.08}
                  className="flex flex-1 items-center gap-4 rounded-xl border border-dashed border-ink/20 bg-cream-soft/50 px-6 py-7"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-6 w-6 shrink-0 text-gold-deep">
                    <path d={cat.icon} />
                  </svg>
                  <div>
                    <p className="font-display text-sm text-ink">{t(cat.labelKey)}</p>
                    <p className="text-[11px] uppercase tracking-[0.1em] text-ink/60">{t("portfolio.catPending")}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-cream px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("reviews.eyebrow")}</span>
          </Reveal>
          <MaskReveal
            as="h2"
            delay={0.08}
            className="mt-3 font-display text-3xl text-ink md:text-4xl"
            html={t("reviews.headline")}
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink/70">{t("reviews.body")}</p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-lg rounded-lg border border-dashed border-ink/20 bg-cream-deep/50 p-10">
            <h3 className="font-display text-lg text-ink">{t("reviews.pendingT")}</h3>
            <p className="mt-2 text-sm text-ink/60">{t("reviews.pendingS")}</p>
            <a
              href={waLink(reviewMsg)}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] text-cream-soft transition hover:bg-gold-deep"
            >
              {t("reviews.pendingCta")}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
