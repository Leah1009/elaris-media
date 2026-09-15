import { createClient } from "@/lib/supabase/server";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";
import { getReferralSummary } from "@/lib/luxora/referrals-data";
import { t, type Locale } from "@/lib/luxora/i18n";
import { TrialCard } from "@/components/subscription/trial-card";
import { PlanCards } from "@/components/subscription/plan-cards";
import { BillingSection } from "@/components/subscription/billing-section";
import { ReferralSection } from "@/components/subscription/referral-section";

export default async function SubscriptionSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();
  const locale: Locale = ctx.business.preferred_language;

  const [{ data: plans }, { data: entitlementRows }, { data: subscription }, referralSummary] = await Promise.all([
    supabase.from("plans").select("id, key, name, price_monthly_cents, badge").eq("is_active", true).order("display_order"),
    supabase.from("plan_entitlements").select("plan_id, key, value_boolean, value_integer, value_text"),
    supabase.from("subscriptions").select("plan_id, status, current_period_end").eq("business_id", ctx.business.id).maybeSingle(),
    getReferralSummary(supabase, ctx.business.id, ctx.business.referral_code),
  ]);

  const entitlementsByPlan: Record<string, Map<string, { boolean: boolean | null; integer: number | null; text: string | null }>> = {};
  for (const row of entitlementRows ?? []) {
    if (!entitlementsByPlan[row.plan_id]) entitlementsByPlan[row.plan_id] = new Map();
    entitlementsByPlan[row.plan_id].set(row.key, { boolean: row.value_boolean, integer: row.value_integer, text: row.value_text });
  }

  const isTrialing = ctx.access.subscriptionStatus === "trialing";
  const isActiveSubscriber = ctx.access.subscriptionStatus === "active";
  const remaining = daysRemaining(ctx.access.trialEndsAt);
  const selectedPlan = plans?.find((p) => p.id === subscription?.plan_id) ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">{t(locale, "subscription_title")}</h1>
        <p className="mt-1 text-sm text-ink/70">{t(locale, "subscription_subtitle")}</p>
      </div>

      {isTrialing ? (
        <TrialCard locale={locale} remaining={remaining} trialEndsAt={ctx.access.trialEndsAt} selectedPlanName={selectedPlan?.name ?? null} />
      ) : null}

      <PlanCards
        locale={locale}
        plans={plans ?? []}
        entitlementsByPlan={entitlementsByPlan}
        currentPlanId={subscription?.plan_id ?? null}
        isActiveSubscriber={isActiveSubscriber}
      />

      <BillingSection
        locale={locale}
        isTrialing={isTrialing}
        trialEndsAt={ctx.access.trialEndsAt}
        selectedPlanName={selectedPlan?.name ?? null}
        currentPlanName={isActiveSubscriber ? (selectedPlan?.name ?? null) : null}
        currentPlanPriceCents={isActiveSubscriber ? (selectedPlan?.price_monthly_cents ?? null) : null}
        subscriptionStatus={ctx.access.subscriptionStatus}
        currentPeriodEnd={subscription?.current_period_end ?? null}
      />

      {referralSummary.programActive ? <ReferralSection locale={locale} summary={referralSummary} /> : null}
    </div>
  );
}
