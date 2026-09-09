"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { recordClientVisit } from "@/lib/luxora/appointments-actions";
import { dollarsToCents } from "@/lib/luxora/money";
import { computeTax, computeTotal, MANUAL_METHODS } from "@/lib/luxora/payments";
import type { ActionState } from "@/lib/luxora/actions";

const CheckoutSchema = z.object({
  appointmentId: z.uuid(),
  discount: z.string().optional(),
  tip: z.string().optional(),
  method: z.enum(MANUAL_METHODS),
  notes: z.string().optional(),
});

/**
 * Records a checkout paid by cash, Zelle, Cash App, or "other" — these are
 * manual/offline payment methods per the spec, so there's no Stripe
 * dependency here at all: this works today. Card/Terminal/Tap to Pay are a
 * separate action (see stripe-actions.ts) gated on the business having
 * completed Stripe Connect onboarding.
 */
export async function recordManualPayment(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = CheckoutSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client_id, start_at, status")
    .eq("id", data.appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!appointment) {
    return { error: "Appointment not found." };
  }

  const { data: lineItems } = await supabase
    .from("appointment_services")
    .select("price_cents")
    .eq("appointment_id", appointment.id);

  const servicesCents = (lineItems ?? []).reduce((sum, i) => sum + i.price_cents, 0);
  const discountCents = dollarsToCents(data.discount ?? "0");
  const tipCents = dollarsToCents(data.tip ?? "0");
  const taxCents = computeTax(servicesCents - discountCents, ctx.business.tax_rate_percent ?? 0);
  const totalCents = computeTotal({ servicesCents, discountCents, taxCents, tipCents });

  const { error } = await supabase.from("payments").insert({
    business_id: ctx.business.id,
    appointment_id: appointment.id,
    client_id: appointment.client_id,
    services_cents: servicesCents,
    discount_cents: discountCents,
    tax_cents: taxCents,
    tip_cents: tipCents,
    total_cents: totalCents,
    method: data.method,
    status: "succeeded",
    notes: data.notes || null,
  });

  if (error) {
    return { error: error.message };
  }

  if (appointment.status !== "completed") {
    await supabase.from("appointments").update({ status: "completed" }).eq("id", appointment.id);
    await recordClientVisit(supabase, appointment.client_id, appointment.start_at);
  }

  const { data: client } = await supabase
    .from("clients")
    .select("lifetime_spend_cents")
    .eq("id", appointment.client_id)
    .maybeSingle();
  if (client) {
    await supabase
      .from("clients")
      .update({ lifetime_spend_cents: client.lifetime_spend_cents + totalCents })
      .eq("id", appointment.client_id);
  }

  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard/payments");
  redirect(`/dashboard/checkout/${appointment.id}/receipt`);
}

const RefundSchema = z.object({
  paymentId: z.uuid(),
  amount: z.string().min(1),
  reason: z.string().optional(),
});

export async function refundManualPayment(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = RefundSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const amountCents = dollarsToCents(data.amount);
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("id, total_cents, status, method")
    .eq("id", data.paymentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!payment) return { error: "Payment not found." };
  if (amountCents <= 0 || amountCents > payment.total_cents) {
    return { error: "Invalid refund amount." };
  }
  if (payment.method === "card" || payment.method === "terminal" || payment.method === "tap_to_pay") {
    return { error: "Card refunds require Stripe to be connected — use the Stripe refund action." };
  }

  const { error: refundError } = await supabase.from("refunds").insert({
    business_id: ctx.business.id,
    payment_id: payment.id,
    amount_cents: amountCents,
    reason: data.reason || null,
  });
  if (refundError) return { error: refundError.message };

  const newStatus = amountCents === payment.total_cents ? "refunded" : "partially_refunded";
  await supabase.from("payments").update({ status: newStatus }).eq("id", payment.id);

  revalidatePath("/dashboard/payments");
  return null;
}
