"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const StaffSchema = z.object({
  fullName: z.string().min(1, "Name is required."),
  title: z.string().optional(),
  email: z.union([z.email("Enter a valid email."), z.literal("")]).optional(),
  phone: z.string().optional(),
  active: z.string().optional(),
});

function getMultiValues(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String).filter(Boolean);
}

export async function createStaff(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = StaffSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: staff, error } = await supabase
    .from("staff")
    .insert({
      business_id: ctx.business.id,
      full_name: data.fullName,
      title: data.title || null,
      email: data.email || null,
      phone: data.phone || null,
      active: data.active !== "off",
    })
    .select("id")
    .single();

  if (error || !staff) {
    return { error: error?.message ?? "Could not create staff member." };
  }

  await syncStaffAssignments(staff.id, getMultiValues(formData, "serviceIds"), getMultiValues(formData, "locationIds"));

  revalidatePath("/dashboard/staff");
  redirect("/dashboard/staff");
}

export async function updateStaff(
  staffId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = StaffSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("staff")
    .update({
      full_name: data.fullName,
      title: data.title || null,
      email: data.email || null,
      phone: data.phone || null,
      active: data.active !== "off",
    })
    .eq("id", staffId)
    .eq("business_id", ctx.business.id);

  if (error) {
    return { error: error.message };
  }

  await syncStaffAssignments(staffId, getMultiValues(formData, "serviceIds"), getMultiValues(formData, "locationIds"));

  revalidatePath("/dashboard/staff");
  redirect("/dashboard/staff");
}

async function syncStaffAssignments(staffId: string, serviceIds: string[], locationIds: string[]) {
  const supabase = await createClient();

  await supabase.from("staff_services").delete().eq("staff_id", staffId);
  if (serviceIds.length > 0) {
    await supabase
      .from("staff_services")
      .insert(serviceIds.map((service_id) => ({ staff_id: staffId, service_id })));
  }

  await supabase.from("staff_locations").delete().eq("staff_id", staffId);
  if (locationIds.length > 0) {
    await supabase
      .from("staff_locations")
      .insert(locationIds.map((location_id) => ({ staff_id: staffId, location_id })));
  }
}
