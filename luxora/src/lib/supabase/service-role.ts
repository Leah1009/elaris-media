import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Bypasses RLS entirely. Only for trusted server-to-server contexts that
 * have no Supabase user session to act as — today that's just the Stripe
 * webhook handler, which authenticates the request via Stripe's signature
 * instead of a Supabase session. Never import this into anything reachable
 * from a user request without its own independent authentication check.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
