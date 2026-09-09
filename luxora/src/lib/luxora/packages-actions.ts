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
  serviceId: z.string().optional(),
  price: z.coerce.number().min(0),
  totalSessions: z.coerce.number().int().min(1, "Must include at least 1 session."),
});

export async function createPackagePlan(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = PlanSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("package_plans").insert({
    business_id: ctx.business.id,
    name: data.name,
    service_id: data.serviceId || null,
    price_cents: dollarsToCents(String(data.price)),
    total_sessions: data.totalSessions,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/packages");
  redirect("/dashboard/packages");
}

const SellSchema = z.object({
  packagePlanId: z.uuid(),
  clientId: z.uuid(),
  method: z.enum(["cash", "zelle", "cash_app", "other"]),
});

export async function sellPackageToClient(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = SellSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Invalid request." };
  const data = parsed.data;
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("package_plans")
    .select("id, name, price_cents, total_sessions")
    .eq("id", data.packagePlanId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!plan) return { error: "Package plan not found." };

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      business_id: ctx.business.id,
      client_id: data.clientId,
      services_cents: plan.price_cents,
      total_cents: plan.price_cents,
      method: data.method,
      status: "succeeded",
      notes: `Package purchase — ${plan.name}`,
    })
    .select("id")
    .single();
  if (paymentError || !payment) return { error: paymentError?.message ?? "Could not record payment." };

  const { error: packageError } = await supabase.from("client_packages").insert({
    business_id: ctx.business.id,
    client_id: data.clientId,
    package_plan_id: plan.id,
    sessions_remaining: plan.total_sessions,
    payment_id: payment.id,
  });
  if (packageError) return { error: packageError.message };

  revalidatePath("/dashboard/packages");
  revalidatePath(`/dashboard/clients/${data.clientId}`);
  redirect(`/dashboard/clients/${data.clientId}`);
}

export async function usePackageSession(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const clientPackageId = String(formData.get("clientPackageId"));
  const appointmentId = formData.get("appointmentId") ? String(formData.get("appointmentId")) : null;
  const supabase = await createClient();

  const { data: clientPackage } = await supabase
    .from("client_packages")
    .select("id, sessions_remaining, client_id, package_plan_id")
    .eq("id", clientPackageId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!clientPackage || clientPackage.sessions_remaining <= 0) return;

  await supabase
    .from("client_packages")
    .update({
      sessions_remaining: clientPackage.sessions_remaining - 1,
      status: clientPackage.sessions_remaining - 1 === 0 ? "expired" : "active",
    })
    .eq("id", clientPackage.id);

  await supabase.from("package_usages").insert({
    client_package_id: clientPackage.id,
    appointment_id: appointmentId,
  });

  revalidatePath(`/dashboard/clients/${clientPackage.client_id}`);
}
