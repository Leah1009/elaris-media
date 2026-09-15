import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import type { BusinessTypeValue } from "@/lib/luxora/business-types";

export type PendingBusiness = {
  name: string;
  business_type: BusinessTypeValue;
  business_type_other: string | null;
  phone: string;
  email: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  description: string | null;
  slug: string;
  preferred_language: "en" | "es";
  referral_code: string | null;
};

/**
 * Business creation always happens through the register_business RPC
 * (SECURITY DEFINER, server-side trial + entitlement setup) so the client
 * can never fabricate a trial window or skip owner membership. Supabase
 * email confirmation may delay when a session first exists, so this runs
 * lazily the first time an authenticated user with no business reaches the
 * dashboard, using the registration payload stashed in their user metadata
 * at signup time.
 */
export async function completeBusinessRegistrationIfNeeded(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<{ businessId: string | null; justCreated: boolean }> {
  const { data: existingMembership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingMembership) {
    return { businessId: existingMembership.business_id, justCreated: false };
  }

  const pending = user.user_metadata?.pending_business as PendingBusiness | undefined;
  if (!pending) {
    return { businessId: null, justCreated: false };
  }

  const { data: businessId, error } = await supabase.rpc("register_business", {
    p_name: pending.name,
    p_business_type: pending.business_type,
    p_business_type_other: pending.business_type_other,
    p_phone: pending.phone,
    p_email: pending.email,
    p_address_line1: pending.address_line1,
    p_city: pending.city,
    p_state: pending.state,
    p_zip: pending.zip,
    p_description: pending.description,
    p_slug: pending.slug,
  });

  if (error) {
    console.error("register_business failed", error);
    return { businessId: null, justCreated: false };
  }

  if (businessId) {
    await supabase.from("businesses").update({ preferred_language: pending.preferred_language }).eq("id", businessId);
    if (pending.referral_code) {
      await attributeReferral(supabase, businessId, pending.referral_code, pending.email, pending.phone);
    }
  }

  return { businessId, justCreated: true };
}

/**
 * Records referral attribution server-side at the moment the referred
 * business is created — never trusts a cookie/query-param alone as the
 * authoritative relationship. Rejects (silently, without blocking
 * registration) an obvious self-referral: the same contact email or phone
 * used for both businesses. Qualification into an actual reward only
 * happens later, when a platform admin activates the subscription (see
 * updateSubscription in platform-admin-actions.ts) — never at signup.
 */
async function attributeReferral(
  supabase: SupabaseClient<Database>,
  referredBusinessId: string,
  referralCode: string,
  referredEmail: string,
  referredPhone: string,
): Promise<void> {
  const { data: settings } = await supabase.from("referral_program_settings").select("program_active, reward_amount_cents, reward_type").eq("id", true).maybeSingle();
  if (!settings?.program_active) return;

  const { data: referrer } = await supabase
    .from("businesses")
    .select("id, email, phone")
    .eq("referral_code", referralCode)
    .maybeSingle();
  if (!referrer || referrer.id === referredBusinessId) return;

  const isSelfReferral =
    (referrer.email && referrer.email.toLowerCase() === referredEmail.toLowerCase()) ||
    (referrer.phone && referrer.phone === referredPhone);
  if (isSelfReferral) return;

  const { data: referral } = await supabase
    .from("referrals")
    .insert({
      referrer_business_id: referrer.id,
      referred_business_id: referredBusinessId,
      referral_code: referralCode,
      status: "trialing",
    })
    .select("id")
    .maybeSingle();
  if (!referral) return;

  await supabase.from("referral_rewards").insert({
    referral_id: referral.id,
    referrer_business_id: referrer.id,
    amount_cents: settings.reward_amount_cents,
    reward_type: settings.reward_type,
    status: "pending",
  });
}
