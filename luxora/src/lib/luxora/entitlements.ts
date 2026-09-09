import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Reads a plan limit/feature flag for a business from plan_entitlements —
 * never hard-coded in application code, per the plan/entitlement
 * architecture (Section 7 of the spec).
 */
export async function getEntitlement(
  businessId: string,
  key: string,
): Promise<{ type: "boolean" | "integer" | "text"; value: boolean | number | string | null } | null> {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("business_id", businessId)
    .maybeSingle();

  if (!subscription) return null;

  const { data: entitlement } = await supabase
    .from("plan_entitlements")
    .select("value_type, value_boolean, value_integer, value_text")
    .eq("plan_id", subscription.plan_id)
    .eq("key", key)
    .maybeSingle();

  if (!entitlement) return null;

  if (entitlement.value_type === "boolean") return { type: "boolean", value: entitlement.value_boolean };
  if (entitlement.value_type === "integer") return { type: "integer", value: entitlement.value_integer };
  return { type: "text", value: entitlement.value_text };
}
