"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getStripeClient, isStripeConfigured } from "@/lib/luxora/stripe";
import { getAppUrl } from "@/lib/luxora/app-url";
import { dollarsToCents } from "@/lib/luxora/money";
import { computeTax, computeTotal } from "@/lib/luxora/payments";
import type { ActionState } from "@/lib/luxora/actions";

const CheckoutSchema = z.object({
  appointmentId: z.uuid(),
  discount: z.string().optional(),
  tip: z.string().optional(),
});

/**
 * Card payment for a web app with no Terminal hardware and no native
 * mobile app: a direct charge on the business's own connected account via
 * Stripe Checkout. The staff opens this at the front desk and hands the
 * screen to the customer (or shares the link) — no card data ever touches
 * Luxora's server. Terminal and Tap to Pay need hardware/a native app this
 * product doesn't have yet, so they aren't wired even once Stripe is
 * connected (see checkout-form.tsx).
 */
export async function createCardCheckoutSession(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isStripeConfigured()) {
    return { error: "Card payments aren't available yet." };
  }

  const ctx = await getBusinessContext();
  const parsed = CheckoutSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Invalid checkout request." };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: connectedAccount } = await supabase
    .from("stripe_connected_accounts")
    .select("stripe_account_id, charges_enabled")
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!connectedAccount?.charges_enabled) {
    return { error: "Connect Stripe in Settings → Payments before accepting cards." };
  }

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client_id")
    .eq("id", data.appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!appointment) return { error: "Appointment not found." };

  const { data: lineItems } = await supabase
    .from("appointment_services")
    .select("price_cents, service:service_id(name)")
    .eq("appointment_id", appointment.id);

  const servicesCents = (lineItems ?? []).reduce((sum, i) => sum + i.price_cents, 0);
  const discountCents = dollarsToCents(data.discount ?? "0");
  const tipCents = dollarsToCents(data.tip ?? "0");
  const taxCents = computeTax(servicesCents - discountCents, ctx.business.tax_rate_percent ?? 0);
  const totalCents = computeTotal({ servicesCents, discountCents, taxCents, tipCents });

  if (totalCents <= 0) return { error: "Nothing to charge." };

  const stripe = getStripeClient();
  const appUrl = await getAppUrl();

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: totalCents,
            product_data: { name: `Appointment — ${ctx.business.name}` },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/checkout/${appointment.id}/receipt`,
      cancel_url: `${appUrl}/dashboard/checkout/${appointment.id}`,
      metadata: { appointment_id: appointment.id, business_id: ctx.business.id },
    },
    { stripeAccount: connectedAccount.stripe_account_id },
  );

  if (!session.payment_intent || typeof session.payment_intent !== "string") {
    return { error: "Could not start card checkout." };
  }

  const { error: insertError } = await supabase.from("payments").insert({
    business_id: ctx.business.id,
    appointment_id: appointment.id,
    client_id: appointment.client_id,
    services_cents: servicesCents,
    discount_cents: discountCents,
    tax_cents: taxCents,
    tip_cents: tipCents,
    total_cents: totalCents,
    method: "card",
    status: "pending",
    stripe_payment_intent_id: session.payment_intent,
  });

  if (insertError) return { error: insertError.message };
  if (!session.url) return { error: "Could not start card checkout." };

  redirect(session.url);
}
