"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getStripeClient, isStripeConfigured, StripeNotConfiguredError } from "@/lib/luxora/stripe";
import { getAppUrl } from "@/lib/luxora/app-url";

export type StripeActionState = { error?: string } | null;

/**
 * Creates (or resumes) the business's Stripe Connect Express account and
 * sends the owner to Stripe's own hosted onboarding. Luxore never collects
 * or stores bank details, SSNs, or KYC documents itself — Stripe does, and
 * only the account id + a few status booleans come back to us. Funds this
 * account receives go straight to the business's own bank via Stripe,
 * never through a Luxore-owned account.
 */
export async function startStripeOnboarding(): Promise<StripeActionState> {
  if (!isStripeConfigured()) {
    return { error: "Stripe is not connected to Luxore yet. This will be available soon." };
  }

  const ctx = await getBusinessContext();
  if (ctx.role !== "owner" && ctx.role !== "manager") {
    return { error: "Only an owner or manager can connect Stripe." };
  }

  const supabase = await createClient();
  const stripe = getStripeClient();
  const appUrl = await getAppUrl();

  const { data: existing } = await supabase
    .from("stripe_connected_accounts")
    .select("stripe_account_id")
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  let accountId = existing?.stripe_account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      business_profile: { name: ctx.business.name },
      metadata: { luxora_business_id: ctx.business.id },
    });
    accountId = account.id;

    await supabase.from("stripe_connected_accounts").insert({
      business_id: ctx.business.id,
      stripe_account_id: accountId,
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/dashboard/settings/payments`,
    return_url: `${appUrl}/dashboard/settings/payments`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}

/**
 * Pulls current charges_enabled/payouts_enabled/details_submitted from
 * Stripe on demand (e.g. right after the owner returns from onboarding) —
 * the webhook handler keeps this current on an ongoing basis, this is just
 * for an immediate refresh without waiting on the webhook.
 */
export async function refreshStripeAccountStatus(): Promise<void> {
  if (!isStripeConfigured()) return;

  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: connected } = await supabase
    .from("stripe_connected_accounts")
    .select("stripe_account_id")
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!connected) return;

  try {
    const stripe = getStripeClient();
    const account = await stripe.accounts.retrieve(connected.stripe_account_id);
    await supabase
      .from("stripe_connected_accounts")
      .update({
        charges_enabled: account.charges_enabled ?? false,
        payouts_enabled: account.payouts_enabled ?? false,
        details_submitted: account.details_submitted ?? false,
      })
      .eq("business_id", ctx.business.id);
  } catch (err) {
    if (!(err instanceof StripeNotConfiguredError)) throw err;
  }
}
