import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";

export function BillingSection({
  locale,
  isTrialing,
  trialEndsAt,
  selectedPlanName,
  currentPlanName,
  currentPlanPriceCents,
  subscriptionStatus,
  currentPeriodEnd,
}: {
  locale: Locale;
  isTrialing: boolean;
  trialEndsAt: string | null;
  selectedPlanName: string | null;
  currentPlanName: string | null;
  currentPlanPriceCents: number | null;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
}) {
  const dateLocale = locale === "es" ? "es-ES" : "en-US";

  return (
    <section className="rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">{t(locale, "billing_section_title")}</h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isTrialing ? (
          <>
            <Field label={t(locale, "billing_status")} value={t(locale, "status_free_trial")} />
            <Field label={t(locale, "trial_ends_field")} value={trialEndsAt ? new Date(trialEndsAt).toLocaleDateString(dateLocale) : "—"} />
            <Field label={t(locale, "selected_plan_label")} value={selectedPlanName ?? t(locale, "not_selected")} />
            <Field label={t(locale, "billing_payment_method")} value={t(locale, "billing_not_set_up")} />
          </>
        ) : (
          <>
            <Field label={t(locale, "billing_plan")} value={currentPlanName ?? "—"} />
            <Field label="Price" value={currentPlanPriceCents !== null ? `${formatCents(currentPlanPriceCents)}${t(locale, "per_month")}` : "—"} />
            <Field label={t(locale, "billing_status")} value={subscriptionStatus} />
            <Field label={t(locale, "billing_cycle")} value={t(locale, "billing_monthly")} />
            <Field label={t(locale, "billing_next_date")} value={currentPeriodEnd ? new Date(currentPeriodEnd).toLocaleDateString(dateLocale) : "—"} />
            <Field label={t(locale, "billing_payment_method")} value={t(locale, "billing_not_set_up")} />
          </>
        )}
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          title={t(locale, "choose_plan_unavailable_tooltip")}
          className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink/50"
        >
          {t(locale, "billing_manage")}
        </button>
        <button
          type="button"
          disabled
          title={t(locale, "choose_plan_unavailable_tooltip")}
          className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink/50"
        >
          {t(locale, "billing_change_plan")}
        </button>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/60">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium capitalize text-charcoal">{value}</dd>
    </div>
  );
}
