import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Moves a referral (and its reward) to "qualified" the moment a business's
 * subscription actually becomes active — never earlier. Called from
 * updateSubscription (platform-admin-actions.ts), the one real place a
 * subscription transitions to 'active' today, since there is no
 * self-service Stripe Billing charge flow yet for Luxore's own
 * subscription fees. Idempotent: does nothing if there's no referral, or
 * it's already past 'trialing'.
 */
export async function qualifyReferralForBusiness(
  supabase: SupabaseClient<Database>,
  referredBusinessId: string,
): Promise<void> {
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, status")
    .eq("referred_business_id", referredBusinessId)
    .maybeSingle();
  if (!referral || referral.status === "qualified" || referral.status === "rejected") return;

  const now = new Date().toISOString();
  await supabase.from("referrals").update({ status: "qualified", qualified_at: now }).eq("id", referral.id);
  await supabase
    .from("referral_rewards")
    .update({ status: "qualified", qualified_at: now })
    .eq("referral_id", referral.id)
    .eq("status", "pending");
}
