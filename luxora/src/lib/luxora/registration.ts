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

  return { businessId, justCreated: true };
}
