"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { dollarsToCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

const PlanSchema = z.object({
  name: z.string().min(1, "Name is required."),
  price: z.coerce.number().min(0),
  billingInterval: z.enum(["monthly", "yearly"]),
});

export async function createMembershipPlan(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = PlanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: plan, error } = await supabase
    .from("membership_plans")
    .insert({
      business_id: ctx.business.id,
      name: data.name,
      price_cents: dollarsToCents(String(data.price)),
      billing_interval: data.billingInterval,
    })
    .select("id")
    .single();

  if (error || !plan) return { error: error?.message ?? "Could not create plan." };

  const serviceIds = formData.getAll("serviceIds").map(String).filter(Boolean);
  if (serviceIds.length > 0) {
    await supabase.from("membership_plan_services").insert(
      serviceIds.map((service_id) => ({
        membership_plan_id: plan.id,
        service_id,
        quantity_per_period: Math.max(1, Number(formData.get(`qty_${service_id}`)) || 1),
      })),
    );
  }

  revalidatePath("/dashboard/memberships");
  redirect("/dashboard/memberships");
}

const StartSchema = z.object({
  membershipPlanId: z.uuid(),
  clientId: z.uuid(),
  method: z.enum(["cash", "zelle", "cash_app", "other"]),
});

export async function startClientMembership(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = StartSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Invalid request." };
  const data = parsed.data;
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("membership_plans")
    .select("id, name, price_cents, billing_interval")
    .eq("id", data.membershipPlanId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!plan) return { error: "Membership plan not found." };

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      business_id: ctx.business.id,
      client_id: data.clientId,
      services_cents: plan.price_cents,
      total_cents: plan.price_cents,
      method: data.method,
      status: "succeeded",
      notes: `Membership — ${plan.name}`,
    })
    .select("id")
    .single();
  if (paymentError || !payment) return { error: paymentError?.message ?? "Could not record payment." };

  const now = new Date();
  const periodEnd = new Date(now);
  if (plan.billing_interval === "yearly") periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  else periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { error: membershipError } = await supabase.from("client_memberships").insert({
    business_id: ctx.business.id,
    client_id: data.clientId,
    membership_plan_id: plan.id,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
  });
  if (membershipError) return { error: membershipError.message };

  revalidatePath("/dashboard/memberships");
  revalidatePath(`/dashboard/clients/${data.clientId}`);
  redirect(`/dashboard/clients/${data.clientId}`);
}

export async function useMembershipService(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const clientMembershipId = String(formData.get("clientMembershipId"));
  const serviceId = String(formData.get("serviceId"));
  const appointmentId = formData.get("appointmentId") ? String(formData.get("appointmentId")) : null;
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("client_memberships")
    .select("id, client_id")
    .eq("id", clientMembershipId)
    .eq("business_id", ctx.business.id)
    .eq("status", "active")
    .maybeSingle();
  if (!membership) return;

  await supabase.from("membership_usages").insert({
    client_membership_id: membership.id,
    service_id: serviceId,
    appointment_id: appointmentId,
  });

  revalidatePath(`/dashboard/clients/${membership.client_id}`);
}
