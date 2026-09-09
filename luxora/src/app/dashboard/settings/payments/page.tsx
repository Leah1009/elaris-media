import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { isStripeConfigured } from "@/lib/luxora/stripe";
import { refreshStripeAccountStatus } from "@/lib/luxora/stripe-actions";
import { ConnectStripeButton } from "@/components/connect-stripe-button";

export default async function PaymentsSettingsPage() {
  const ctx = await getBusinessContext();

  if (isStripeConfigured()) {
    await refreshStripeAccountStatus();
  }

  const supabase = await createClient();
  const { data: account } = await supabase
    .from("stripe_connected_accounts")
    .select("charges_enabled, payouts_enabled, details_submitted")
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Payments</h1>
      <p className="mt-1 text-sm text-ink">
        Connect Stripe to accept cards, Tap to Pay and Terminal payments. Funds go directly to
        your own bank account through Stripe — Luxora never holds your money.
      </p>

      <div className="mt-6 rounded-sm border border-border bg-white p-6">
        {!isStripeConfigured() ? (
          <p className="text-sm text-ink">
            Online card payments are coming soon — cash, Zelle, Cash App and other manual methods
            already work today from Checkout.
          </p>
        ) : !account ? (
          <>
            <p className="text-sm text-charcoal">Not connected yet.</p>
            <div className="mt-4">
              <ConnectStripeButton label="Connect with Stripe" />
            </div>
          </>
        ) : account.charges_enabled ? (
          <p className="text-sm font-medium text-charcoal">✓ Stripe connected — ready to accept cards.</p>
        ) : (
          <>
            <p className="text-sm text-charcoal">
              Stripe account created — finish onboarding to start accepting cards.
            </p>
            <div className="mt-4">
              <ConnectStripeButton label="Finish Stripe Setup" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
