"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { dollarsToCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `LUX-${code}`;
}

const SellSchema = z.object({
  amount: z.coerce.number().min(1, "Enter an amount."),
  purchaserClientId: z.string().optional(),
  recipientName: z.string().optional(),
  recipientEmail: z.union([z.email(), z.literal("")]).optional(),
  method: z.enum(["cash", "zelle", "cash_app", "other"]),
});

export async function sellGiftCard(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = SellSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const amountCents = dollarsToCents(String(data.amount));
  const supabase = await createClient();

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      business_id: ctx.business.id,
      client_id: data.purchaserClientId || null,
      services_cents: 0,
      total_cents: amountCents,
      method: data.method,
      status: "succeeded",
      notes: "Gift card purchase",
    })
    .select("id")
    .single();

  if (paymentError || !payment) return { error: paymentError?.message ?? "Could not record payment." };

  let code = generateGiftCardCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error: giftCardError } = await supabase.from("gift_cards").insert({
      business_id: ctx.business.id,
      code,
      original_value_cents: amountCents,
      remaining_balance_cents: amountCents,
      purchaser_client_id: data.purchaserClientId || null,
      recipient_name: data.recipientName || null,
      recipient_email: data.recipientEmail || null,
    });
    if (!giftCardError) {
      const { data: giftCard } = await supabase
        .from("gift_cards")
        .select("id")
        .eq("business_id", ctx.business.id)
        .eq("code", code)
        .single();
      if (giftCard) {
        await supabase.from("gift_card_transactions").insert({
          business_id: ctx.business.id,
          gift_card_id: giftCard.id,
          type: "purchase",
          amount_cents: amountCents,
          payment_id: payment.id,
        });
      }
      revalidatePath("/dashboard/gift-cards");
      redirect(`/dashboard/gift-cards?sold=${code}`);
    }
    code = generateGiftCardCode();
  }

  return { error: "Could not generate a unique gift card code. Try again." };
}

/**
 * Applies (redeems) a gift card against a payment that's about to be
 * created. Used inside recordManualPayment's checkout flow. Never called
 * directly from the client — the caller already validated the payment
 * amount server-side.
 */
export async function redeemGiftCardForPayment(
  supabase: SupabaseClient<Database>,
  businessId: string,
  code: string,
  amountCents: number,
  paymentId: string,
): Promise<{ giftCardId: string } | { error: string }> {
  const { data: giftCard } = await supabase
    .from("gift_cards")
    .select("id, remaining_balance_cents, status")
    .eq("business_id", businessId)
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();

  if (!giftCard || giftCard.status !== "active") {
    return { error: "Gift card not found or inactive." };
  }
  if (amountCents > giftCard.remaining_balance_cents) {
    return { error: "Gift card balance is lower than the amount requested." };
  }

  const newBalance = giftCard.remaining_balance_cents - amountCents;
  await supabase
    .from("gift_cards")
    .update({ remaining_balance_cents: newBalance, status: newBalance === 0 ? "redeemed" : "active" })
    .eq("id", giftCard.id);

  await supabase.from("gift_card_transactions").insert({
    business_id: businessId,
    gift_card_id: giftCard.id,
    type: "redemption",
    amount_cents: -amountCents,
    payment_id: paymentId,
  });

  return { giftCardId: giftCard.id };
}
