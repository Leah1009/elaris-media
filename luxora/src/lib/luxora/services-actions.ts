"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { dollarsToCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

const ServiceSchema = z.object({
  name: z.string().min(1, "Name is required."),
  category: z.string().optional(),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().int().min(5, "Duration must be at least 5 minutes."),
  price: z.coerce.number().min(0, "Price can't be negative."),
  depositRequired: z.string().optional(),
  depositAmount: z.string().optional(),
  active: z.string().optional(),
  color: z.union([z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #a97142."), z.literal("")]).optional(),
});

export async function createService(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ServiceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("services").insert({
    business_id: ctx.business.id,
    name: data.name,
    category: data.category || null,
    description: data.description || null,
    duration_minutes: data.durationMinutes,
    price_cents: dollarsToCents(String(data.price)),
    deposit_required: data.depositRequired === "on",
    deposit_cents: data.depositRequired === "on" ? dollarsToCents(data.depositAmount ?? "0") : null,
    active: data.active !== "off",
    color: data.color || "#a97142",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}

export async function updateService(
  serviceId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ServiceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({
      name: data.name,
      category: data.category || null,
      description: data.description || null,
      duration_minutes: data.durationMinutes,
      price_cents: dollarsToCents(String(data.price)),
      deposit_required: data.depositRequired === "on",
      deposit_cents: data.depositRequired === "on" ? dollarsToCents(data.depositAmount ?? "0") : null,
      active: data.active !== "off",
      color: data.color || "#a97142",
    })
    .eq("id", serviceId)
    .eq("business_id", ctx.business.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}
