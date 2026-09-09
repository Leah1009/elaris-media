"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getStripeClient, isStripeConfigured } from "@/lib/luxora/stripe";
import { dollarsToCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

const RefundSchema = z.object({
  paymentId: z.uuid(),
  amount: z.string().min(1),
  reason: z.string().optional(),
});

export async function refundCardPayment(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isStripeConfigured()) {
    return { error: "Stripe is not connected." };
  }

  const ctx = await getBusinessContext();
  const parsed = RefundSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Invalid refund request." };
  }
  const data = parsed.data;
  const amountCents = dollarsToCents(data.amount);
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("id, total_cents, stripe_payment_intent_id, method")
    .eq("id", data.paymentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!payment || !payment.stripe_payment_intent_id) {
    return { error: "Payment not found." };
  }
  if (amountCents <= 0 || amountCents > payment.total_cents) {
    return { error: "Invalid refund amount." };
  }

  const { data: connectedAccount } = await supabase
    .from("stripe_connected_accounts")
    .select("stripe_account_id")
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!connectedAccount) return { error: "Stripe is not connected." };

  const stripe = getStripeClient();
  const refund = await stripe.refunds.create(
    { payment_intent: payment.stripe_payment_intent_id, amount: amountCents },
    { stripeAccount: connectedAccount.stripe_account_id },
  );

  const { error: insertError } = await supabase.from("refunds").insert({
    business_id: ctx.business.id,
    payment_id: payment.id,
    amount_cents: amountCents,
    reason: data.reason || null,
    stripe_refund_id: refund.id,
  });
  if (insertError) return { error: insertError.message };

  const newStatus = amountCents === payment.total_cents ? "refunded" : "partially_refunded";
  await supabase.from("payments").update({ status: newStatus }).eq("id", payment.id);

  revalidatePath("/dashboard/payments");
  return null;
}
