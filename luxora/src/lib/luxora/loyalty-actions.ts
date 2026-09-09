"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

const SettingsSchema = z.object({
  enabled: z.string().optional(),
  centsSpentPerPoint: z.coerce.number().min(1, "Must be at least 1 cent."),
  pointValueCents: z.coerce.number().min(1, "Must be at least 1 cent."),
  minRedeemPoints: z.coerce.number().min(0),
});

export async function updateLoyaltyProgram(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = SettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("loyalty_programs").upsert({
    business_id: ctx.business.id,
    enabled: data.enabled === "on",
    cents_spent_per_point: data.centsSpentPerPoint,
    point_value_cents: data.pointValueCents,
    min_redeem_points: data.minRedeemPoints,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/loyalty");
  return null;
}

/**
 * Awards points for a completed payment. Called from the checkout action
 * after the payment row exists — mirrors recordClientVisit's role for
 * appointment stats. A no-op when the program isn't enabled.
 */
export async function earnLoyaltyPoints(
  supabase: SupabaseClient<Database>,
  businessId: string,
  clientId: string,
  totalCents: number,
  paymentId: string,
): Promise<number> {
  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("enabled, cents_spent_per_point")
    .eq("business_id", businessId)
    .maybeSingle();

  if (!program?.enabled || totalCents <= 0) return 0;

  const points = Math.floor(totalCents / program.cents_spent_per_point);
  if (points <= 0) return 0;

  await supabase.from("loyalty_transactions").insert({
    business_id: businessId,
    client_id: clientId,
    type: "earn",
    points_delta: points,
    payment_id: paymentId,
  });

  const { data: balanceRow } = await supabase
    .from("client_loyalty_points")
    .select("points_balance")
    .eq("client_id", clientId)
    .maybeSingle();

  if (balanceRow) {
    await supabase
      .from("client_loyalty_points")
      .update({ points_balance: balanceRow.points_balance + points })
      .eq("client_id", clientId);
  } else {
    await supabase
      .from("client_loyalty_points")
      .insert({ client_id: clientId, business_id: businessId, points_balance: points });
  }

  return points;
}

/**
 * Redeems points against a payment that's already been created — same
 * check-then-update shape (and the same single-checkout-at-a-time
 * assumption) as redeemGiftCardForPayment.
 */
export async function redeemLoyaltyPointsForPayment(
  supabase: SupabaseClient<Database>,
  businessId: string,
  clientId: string,
  pointsToRedeem: number,
  paymentId: string,
): Promise<{ pointsRedeemed: number } | { error: string }> {
  if (pointsToRedeem <= 0) return { pointsRedeemed: 0 };

  const [{ data: program }, { data: balanceRow }] = await Promise.all([
    supabase
      .from("loyalty_programs")
      .select("enabled, point_value_cents, min_redeem_points")
      .eq("business_id", businessId)
      .maybeSingle(),
    supabase.from("client_loyalty_points").select("points_balance").eq("client_id", clientId).maybeSingle(),
  ]);

  if (!program?.enabled) return { error: "Loyalty program is not enabled." };
  if (pointsToRedeem < program.min_redeem_points) {
    return { error: `Minimum redemption is ${program.min_redeem_points} points.` };
  }
  if (!balanceRow || balanceRow.points_balance < pointsToRedeem) {
    return { error: "Not enough loyalty points." };
  }

  await supabase
    .from("client_loyalty_points")
    .update({ points_balance: balanceRow.points_balance - pointsToRedeem })
    .eq("client_id", clientId);

  await supabase.from("loyalty_transactions").insert({
    business_id: businessId,
    client_id: clientId,
    type: "redeem",
    points_delta: -pointsToRedeem,
    payment_id: paymentId,
  });

  return { pointsRedeemed: pointsToRedeem };
}
