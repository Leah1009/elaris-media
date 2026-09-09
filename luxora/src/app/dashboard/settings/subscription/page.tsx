import { createClient } from "@/lib/supabase/server";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function SubscriptionSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("id, key, name, price_monthly_cents, badge")
    .eq("is_active", true)
    .order("display_order");

  const remaining = daysRemaining(ctx.access.trialEndsAt);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Subscription</h1>
        <p className="mt-1 text-sm text-ink">
          Status:{" "}
          <span className="font-medium text-charcoal">
            {ctx.access.subscriptionStatus === "trialing"
              ? remaining > 0
                ? `Free trial — ${remaining} ${remaining === 1 ? "day" : "days"} remaining`
                : "Free trial ended"
              : ctx.access.subscriptionStatus}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans?.map((plan) => (
          <div key={plan.id} className="relative rounded-sm border border-border bg-white p-6">
            {plan.badge === "MOST_POPULAR" ? (
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Most Popular
              </span>
            ) : null}
            <h2 className="font-display text-xl text-charcoal">{plan.name}</h2>
            <p className="mt-2 font-display text-3xl text-charcoal">
              {formatPrice(plan.price_monthly_cents)}
              <span className="text-sm font-normal text-ink"> /month</span>
            </p>
            <button
              type="button"
              disabled
              title="Billing arrives in a later release"
              className="mt-6 w-full rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-ink/50"
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
