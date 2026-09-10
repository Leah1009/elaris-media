import { createClient } from "@/lib/supabase/server";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

const FEATURE_ROWS: { key: string; label: string; format: (v: { boolean: boolean | null; integer: number | null; text: string | null }) => string }[] = [
  { key: "staff_limit", label: "Staff members", format: (v) => (v.integer != null ? String(v.integer) : "—") },
  { key: "location_limit", label: "Locations", format: (v) => (v.integer != null ? String(v.integer) : "—") },
  { key: "sms_monthly_limit", label: "SMS messages / month", format: (v) => (v.integer != null ? v.integer.toLocaleString() : "—") },
  { key: "feature_two_way_messaging", label: "Two-way messaging", format: (v) => (v.boolean ? "✓" : "—") },
  { key: "feature_advanced_reports", label: "Advanced reports", format: (v) => (v.boolean ? "✓" : "—") },
  { key: "feature_multi_location", label: "Multi-location support", format: (v) => (v.boolean ? "✓" : "—") },
];

export default async function SubscriptionSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: plans }, { data: entitlementRows }, { data: subscription }] = await Promise.all([
    supabase.from("plans").select("id, key, name, price_monthly_cents, badge").eq("is_active", true).order("display_order"),
    supabase.from("plan_entitlements").select("plan_id, key, value_boolean, value_integer, value_text"),
    supabase.from("subscriptions").select("plan_id, status, current_period_end").eq("business_id", ctx.business.id).maybeSingle(),
  ]);

  const entitlementsByPlan = new Map<string, Map<string, { boolean: boolean | null; integer: number | null; text: string | null }>>();
  for (const row of entitlementRows ?? []) {
    if (!entitlementsByPlan.has(row.plan_id)) entitlementsByPlan.set(row.plan_id, new Map());
    entitlementsByPlan.get(row.plan_id)!.set(row.key, { boolean: row.value_boolean, integer: row.value_integer, text: row.value_text });
  }

  const remaining = daysRemaining(ctx.access.trialEndsAt);
  const isTrialing = ctx.access.subscriptionStatus === "trialing";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Subscription</h1>
        <p className="mt-1 text-sm text-ink">
          Status:{" "}
          <span className="font-medium text-charcoal">
            {isTrialing
              ? remaining > 0
                ? `Free trial — ${remaining} ${remaining === 1 ? "day" : "days"} remaining`
                : "Free trial ended"
              : ctx.access.subscriptionStatus}
          </span>
        </p>
        {subscription?.current_period_end && !isTrialing ? (
          <p className="mt-1 text-xs text-ink/60">
            Current period ends {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans?.map((plan) => {
          const isCurrent = subscription?.plan_id === plan.id;
          const entitlements = entitlementsByPlan.get(plan.id) ?? new Map();
          return (
            <div
              key={plan.id}
              className={`relative rounded-sm border bg-white p-6 ${isCurrent ? "border-gold-deep ring-1 ring-gold-deep" : "border-border"}`}
            >
              {isCurrent ? (
                <span className="absolute -top-3 right-6 rounded-full bg-charcoal px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Current Plan
                </span>
              ) : plan.badge === "MOST_POPULAR" ? (
                <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              ) : null}
              <h2 className="font-display text-xl text-charcoal">{plan.name}</h2>
              <p className="mt-2 font-display text-3xl text-charcoal">
                {formatPrice(plan.price_monthly_cents)}
                <span className="text-sm font-normal text-ink"> /month</span>
              </p>

              <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                {FEATURE_ROWS.map((row) => (
                  <div key={row.key} className="flex items-center justify-between">
                    <dt className="text-ink/70">{row.label}</dt>
                    <dd className="font-medium text-charcoal">{row.format(entitlements.get(row.key) ?? { boolean: null, integer: null, text: null })}</dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                disabled
                title={
                  isCurrent
                    ? "This is your current plan."
                    : "Self-service plan changes aren't available yet — your Luxore account manager can switch your plan for you."
                }
                className={`mt-6 w-full rounded-sm border px-4 py-2.5 text-sm font-medium ${
                  isCurrent ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-ink/50"
                }`}
              >
                {isCurrent ? "Current Plan" : "Choose Plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
