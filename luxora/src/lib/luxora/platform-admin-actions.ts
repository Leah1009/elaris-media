"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/luxora/actions";

export async function setBusinessStatus(formData: FormData): Promise<void> {
  const businessId = String(formData.get("businessId"));
  const status = String(formData.get("status"));
  if (!["active", "locked", "suspended"].includes(status)) return;

  const supabase = await createClient();
  await supabase.rpc("admin_set_business_status", { p_business_id: businessId, p_status: status });

  revalidatePath("/admin/businesses");
  revalidatePath(`/admin/businesses/${businessId}`);
}

const ExtendTrialSchema = z.object({
  businessId: z.uuid(),
  newTrialEnd: z.string().min(1, "Choose a date."),
});

export async function extendTrial(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = ExtendTrialSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.rpc("admin_extend_trial", {
    p_business_id: data.businessId,
    p_new_trial_end: new Date(data.newTrialEnd).toISOString(),
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/businesses/${data.businessId}`);
  return null;
}

const UpdateSubscriptionSchema = z.object({
  businessId: z.uuid(),
  planId: z.uuid(),
  status: z.enum(["trialing", "active", "past_due", "canceled"]),
});

export async function updateSubscription(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = UpdateSubscriptionSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.rpc("admin_update_subscription", {
    p_business_id: data.businessId,
    p_plan_id: data.planId,
    p_status: data.status,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/businesses/${data.businessId}`);
  return null;
}

const UpdatePlanSchema = z.object({
  planId: z.uuid(),
  name: z.string().min(1, "Name is required."),
  priceMonthlyDollars: z.coerce.number().min(0),
  badge: z.string().optional(),
  active: z.string().optional(),
});

export async function updatePlan(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = UpdatePlanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.rpc("admin_update_plan", {
    p_plan_id: data.planId,
    p_name: data.name,
    p_price_monthly_cents: Math.round(data.priceMonthlyDollars * 100),
    p_badge: data.badge ?? "",
    p_is_active: data.active === "on",
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/plans");
  return null;
}

const UpsertEntitlementSchema = z.object({
  planId: z.uuid(),
  key: z.string().min(1, "Key is required."),
  valueType: z.enum(["boolean", "integer", "text"]),
  valueBoolean: z.string().optional(),
  valueInteger: z.string().optional(),
  valueText: z.string().optional(),
});

export async function upsertEntitlement(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = UpsertEntitlementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.rpc("admin_upsert_entitlement", {
    p_plan_id: data.planId,
    p_key: data.key.trim(),
    p_value_type: data.valueType,
    p_value_boolean: data.valueType === "boolean" ? data.valueBoolean === "on" : null,
    p_value_integer: data.valueType === "integer" ? Number(data.valueInteger) : null,
    p_value_text: data.valueType === "text" ? data.valueText || null : null,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/plans");
  return null;
}
