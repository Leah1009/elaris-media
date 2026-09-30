"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import { waLink } from "@/lib/constants";

export default function PortfolioReviewsSection() {
  const { t, lang } = useLanguage();

  const examplesMsg =
    lang === "es"
      ? "Hola Elaris Media! ¿Puedo ver algunos ejemplos de su trabajo?"
      : "Hi Elaris Media! Can I see some examples of your work?";

  return (
    <>
      <section className="bg-cream-deep px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("portfolio.eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">{t("portfolio.headline")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink/70">{t("portfolio.body")}</p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-lg rounded-lg border border-dashed border-ink/20 bg-cream-soft/60 p-10">
            <h3 className="font-display text-lg text-ink">{t("portfolio.pendingT")}</h3>
            <p className="mt-2 text-sm text-ink/60">{t("portfolio.pendingS")}</p>
            <a
              href={waLink(examplesMsg)}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] text-cream-soft transition hover:bg-gold-deep"
            >
              {t("portfolio.pendingCta")}
            </a>
          </Reveal>
        </div>
      </section>

      <section id="reviews" className="bg-cream px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("reviews.eyebrow")}</span>
            <h2
              className="mt-3 font-display text-3xl text-ink md:text-4xl"
              dangerouslySetInnerHTML={{ __html: t("reviews.headline") }}
            />
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink/70">{t("reviews.body")}</p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-lg rounded-lg border border-dashed border-ink/20 bg-cream-deep/50 p-10">
            <h3 className="font-display text-lg text-ink">{t("reviews.pendingT")}</h3>
            <p className="mt-2 text-sm text-ink/60">{t("reviews.pendingS")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
