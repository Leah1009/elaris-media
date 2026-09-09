"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

const PromotionSchema = z.object({
  code: z.string().min(2, "Enter a code.").max(30),
  description: z.string().optional(),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.coerce.number().positive("Enter a value greater than 0."),
  maxUses: z.string().optional(),
  perClientLimit: z.string().optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

export async function createPromotion(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = PromotionSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  if (data.discountType === "percent" && data.discountValue > 100) {
    return { fieldErrors: { discountValue: ["A percentage discount can't exceed 100."] } };
  }
  const supabase = await createClient();

  const { error } = await supabase.from("promotions").insert({
    business_id: ctx.business.id,
    code: data.code.trim().toUpperCase(),
    description: data.description || null,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    max_uses: data.maxUses ? Number(data.maxUses) : null,
    per_client_limit: data.perClientLimit ? Number(data.perClientLimit) : null,
    valid_from: data.validFrom || null,
    valid_to: data.validTo || null,
  });

  if (error) {
    if (error.code === "23505") return { fieldErrors: { code: ["This code is already in use."] } };
    return { error: error.message };
  }

  revalidatePath("/dashboard/promotions");
  redirect("/dashboard/promotions");
}

export async function setPromotionActive(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const promotionId = String(formData.get("promotionId"));
  const active = formData.get("active") === "true";

  const supabase = await createClient();
  await supabase.from("promotions").update({ active }).eq("id", promotionId).eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/promotions");
}

/**
 * Validates a promo code and atomically claims one use of it via the
 * redeem_promotion RPC (see migration 035) — called before the payment row
 * is created so the discount can be folded into the total up front. If the
 * payment insert fails afterward for an unrelated reason, this use isn't
 * refunded; that's an accepted, rare edge case, same tier as the
 * gift-card/loyalty check-then-update flows below.
 */
export async function resolvePromotionDiscount(
  supabase: SupabaseClient<Database>,
  businessId: string,
  code: string,
  clientId: string | null,
  subtotalCents: number,
): Promise<{ promotionId: string; discountCents: number } | { error: string }> {
  const { data, error } = await supabase
    .rpc("redeem_promotion", { p_business_id: businessId, p_code: code, p_client_id: clientId })
    .maybeSingle();

  if (error || !data) return { error: error?.message ?? "Promo code not found or inactive." };

  const rawDiscountCents =
    data.discount_type === "percent"
      ? Math.round((subtotalCents * Number(data.discount_value)) / 100)
      : Math.round(Number(data.discount_value) * 100);

  return { promotionId: data.id, discountCents: Math.min(rawDiscountCents, subtotalCents) };
}
