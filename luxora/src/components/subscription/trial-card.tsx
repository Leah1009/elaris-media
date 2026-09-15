import { t, type Locale } from "@/lib/luxora/i18n";

export function TrialCard({
  locale,
  remaining,
  trialEndsAt,
  selectedPlanName,
}: {
  locale: Locale;
  remaining: number;
  trialEndsAt: string | null;
  selectedPlanName: string | null;
}) {
  const hasEnded = remaining <= 0;

  return (
    <div className={`rounded-sm border p-6 ${hasEnded ? "border-danger/30 bg-danger/5" : "border-gold-deep/40 bg-cream-deep"}`}>
      <h2 className="font-display text-lg text-charcoal">{t(locale, "trial_card_title")}</h2>
      {hasEnded ? (
        <p className="mt-2 text-sm font-medium text-danger">{t(locale, "trial_ended_title")}</p>
      ) : (
        <p className="mt-2 font-display text-2xl text-charcoal">
          {remaining} {t(locale, remaining === 1 ? "trial_day_remaining" : "trial_days_remaining")}
        </p>
      )}
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "status_label")}</dt>
          <dd className="mt-0.5 text-sm font-medium text-charcoal">{t(locale, "status_free_trial")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "trial_ends_field")}</dt>
          <dd className="mt-0.5 text-sm font-medium text-charcoal">
            {trialEndsAt ? new Date(trialEndsAt).toLocaleDateString(locale === "es" ? "es-ES" : "en-US") : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "selected_plan_label")}</dt>
          <dd className="mt-0.5 text-sm font-medium text-charcoal">{selectedPlanName ?? t(locale, "not_selected")}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-ink/70">{t(locale, hasEnded ? "trial_ended_prompt" : "trial_choose_plan_prompt")}</p>
    </div>
  );
}
