import Link from "next/link";
import type { LegalSection } from "@/lib/luxora/privacy-content";
import { LEGAL_CONFIG } from "@/lib/luxora/legal-config";
import { t, type Locale } from "@/lib/luxora/i18n";
import { SiteFooter } from "@/components/marketing/site-footer";
import { BackButton } from "@/components/back-button";

export function LegalPage({
  locale,
  title,
  sections,
}: {
  locale: Locale;
  title: string;
  sections: LegalSection[];
}) {
  const hasPendingSections = sections.some((s) => s.pendingReview);

  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <BackButton lang={locale} />
        <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
          Luxore
        </Link>
        <h1 className="mt-6 font-display text-4xl text-charcoal">{title}</h1>
        <p className="mt-2 text-xs uppercase tracking-wide text-ink/50">
          {t(locale, "legal_last_updated")}: {LEGAL_CONFIG.lastUpdated}
        </p>

        {hasPendingSections ? (
          <div className="mt-6 rounded-sm border border-gold-deep/50 bg-cream-deep/50 p-4 text-sm text-charcoal">
            {t(locale, "legal_review_notice")}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title.en}>
              <h2 className="font-display text-lg text-charcoal">
                {section.title[locale]}
                {section.pendingReview ? (
                  <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide text-gold-deep">
                    {t(locale, "pending_legal_review")}
                  </span>
                ) : null}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">{section.body[locale]}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
