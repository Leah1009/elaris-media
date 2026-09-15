"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requirePlatformAdmin } from "@/lib/luxora/platform-admin";
import type { ActionState } from "@/lib/luxora/actions";

export async function markRewardIssued(rewardId: string): Promise<void> {
  await requirePlatformAdmin();
  const supabase = await createClient();

  await supabase
    .from("referral_rewards")
    .update({ status: "issued", issued_at: new Date().toISOString() })
    .eq("id", rewardId)
    .eq("status", "qualified");

  revalidatePath("/admin/referrals");
}

export async function rejectReward(formData: FormData): Promise<void> {
  await requirePlatformAdmin();
  const rewardId = String(formData.get("rewardId"));
  const reason = String(formData.get("reason") ?? "").trim();
  const supabase = await createClient();

  await supabase
    .from("referral_rewards")
    .update({ status: "rejected", notes: reason || null })
    .eq("id", rewardId);

  revalidatePath("/admin/referrals");
}

const SettingsSchema = z.object({
  programActive: z.string().optional(),
  rewardAmountDollars: z.coerce.number().min(0),
  rewardType: z.enum(["gift_card", "account_credit", "cash"]),
});

export async function updateReferralProgramSettings(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePlatformAdmin();
  const parsed = SettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("referral_program_settings")
    .update({
      program_active: data.programActive === "on",
      reward_amount_cents: Math.round(data.rewardAmountDollars * 100),
      reward_type: data.rewardType,
    })
    .eq("id", true);
  if (error) return { error: error.message };

  revalidatePath("/admin/referrals");
  return { success: true };
}
