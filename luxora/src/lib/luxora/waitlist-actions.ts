"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const AddSchema = z.object({
  fullName: z.string().min(1, "Name is required."),
  phone: z.string().optional(),
  email: z.union([z.email(), z.literal("")]).optional(),
  serviceId: z.string().optional(),
  preferredStaffId: z.string().optional(),
  preferredDateStart: z.string().optional(),
  preferredDateEnd: z.string().optional(),
  notes: z.string().optional(),
});

export async function addToWaitlist(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = AddSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("waitlist").insert({
    business_id: ctx.business.id,
    full_name: data.fullName,
    phone: data.phone || null,
    email: data.email || null,
    service_id: data.serviceId || null,
    preferred_staff_id: data.preferredStaffId || null,
    preferred_date_start: data.preferredDateStart || null,
    preferred_date_end: data.preferredDateEnd || null,
    notes: data.notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/waitlist");
  redirect("/dashboard/waitlist");
}

export async function updateWaitlistStatus(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const waitlistId = String(formData.get("waitlistId"));
  const status = String(formData.get("status"));
  if (!["waiting", "notified", "booked", "cancelled"].includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("waitlist")
    .update({ status })
    .eq("id", waitlistId)
    .eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/waitlist");
}
