import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { getAppUrl } from "@/lib/luxora/app-url";

export type ReferralSummary = {
  programActive: boolean;
  rewardAmountCents: number;
  rewardType: string;
  referralLink: string;
  totalReferrals: number;
  qualifiedCount: number;
  totalEarnedCents: number;
  activity: { id: string; status: string; createdAt: string; rewardStatus: string | null }[];
};

/**
 * Everything the Dashboard referral card and the Subscription page's
 * referral section need — one query set, real numbers only. No referred
 * business's name/details are exposed (per Part 20 of the spec), just
 * status and reward outcome.
 */
export async function getReferralSummary(
  supabase: SupabaseClient<Database>,
  businessId: string,
  referralCode: string,
): Promise<ReferralSummary> {
  const [{ data: settings }, { data: referrals }] = await Promise.all([
    supabase.from("referral_program_settings").select("program_active, reward_amount_cents, reward_type").eq("id", true).maybeSingle(),
    supabase
      .from("referrals")
      .select("id, status, created_at, referral_rewards(status, amount_cents)")
      .eq("referrer_business_id", businessId)
      .order("created_at", { ascending: false }),
  ]);

  const appUrl = await getAppUrl();
  const rows = referrals ?? [];
  const qualifiedCount = rows.filter((r) => r.status === "qualified").length;
  const totalEarnedCents = rows.reduce((sum, r) => {
    const reward = r.referral_rewards as unknown as { status: string; amount_cents: number } | null;
    return reward && (reward.status === "qualified" || reward.status === "issued") ? sum + reward.amount_cents : sum;
  }, 0);

  return {
    programActive: settings?.program_active ?? false,
    rewardAmountCents: settings?.reward_amount_cents ?? 5000,
    rewardType: settings?.reward_type ?? "gift_card",
    referralLink: `${appUrl}/r/${referralCode}`,
    totalReferrals: rows.length,
    qualifiedCount,
    totalEarnedCents,
    activity: rows.map((r) => ({
      id: r.id,
      status: r.status,
      createdAt: r.created_at,
      rewardStatus: (r.referral_rewards as unknown as { status: string } | null)?.status ?? null,
    })),
  };
}
