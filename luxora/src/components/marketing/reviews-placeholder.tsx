import { t, type Locale } from "@/lib/luxora/i18n";

export function ReviewsPlaceholder({ locale }: { locale: Locale }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-md border border-dashed border-border bg-cream-deep/30 p-6">
          <div className="flex gap-1 text-border">
            {"★★★★★".split("").map((_, s) => (
              <span key={s}>★</span>
            ))}
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-charcoal/10" />
          <div className="mt-2 h-2 w-2/3 rounded-full bg-charcoal/10" />
          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-ink/40">{t(locale, "reviews_coming_soon")}</p>
        </div>
      ))}
      <p className="col-span-full text-center text-sm text-ink/60">{t(locale, "reviews_placeholder_note")}</p>
      <div className="col-span-full flex justify-center">
        <a
          href="#"
          className="rounded-sm border border-border px-6 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold-deep"
        >
          {t(locale, "leave_a_review_cta")}
        </a>
      </div>
    </div>
  );
}
