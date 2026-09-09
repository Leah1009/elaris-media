"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getEntitlement } from "@/lib/luxora/entitlements";
import type { ActionState } from "@/lib/luxora/actions";

const LocationSchema = z.object({
  name: z.string().min(1, "Name is required."),
  addressLine1: z.string().min(1, "Address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  zip: z.string().min(1, "ZIP is required."),
  phone: z.string().optional(),
});

export async function createLocation(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { count } = await supabase
    .from("locations")
    .select("id", { count: "exact", head: true })
    .eq("business_id", ctx.business.id);

  const limit = await getEntitlement(ctx.business.id, "location_limit");
  if (limit?.type === "integer" && typeof limit.value === "number" && (count ?? 0) >= limit.value) {
    return { error: `Your plan includes up to ${limit.value} location(s). Upgrade to add more.` };
  }

  const parsed = LocationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;

  const { error } = await supabase.from("locations").insert({
    business_id: ctx.business.id,
    name: data.name,
    address_line1: data.addressLine1,
    city: data.city,
    state: data.state,
    zip: data.zip,
    phone: data.phone || null,
    is_primary: (count ?? 0) === 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/settings/locations");
  redirect("/dashboard/settings/locations");
}

const HoursSchema = z.object({
  locationId: z.string().uuid(),
});

export async function updateBusinessHours(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsedLocation = HoursSchema.safeParse({ locationId: formData.get("locationId") });
  if (!parsedLocation.success) {
    return { error: "Invalid location." };
  }
  const { locationId } = parsedLocation.data;
  const supabase = await createClient();

  const { data: location } = await supabase
    .from("locations")
    .select("id")
    .eq("id", locationId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!location) notFound();

  for (let day = 0; day <= 6; day++) {
    const closed = formData.get(`closed_${day}`) === "on";
    const open = String(formData.get(`open_${day}`) ?? "");
    const close = String(formData.get(`close_${day}`) ?? "");

    await supabase
      .from("business_hours")
      .update({
        closed,
        open_time: closed ? null : open || null,
        close_time: closed ? null : close || null,
      })
      .eq("location_id", locationId)
      .eq("day_of_week", day);
  }

  revalidatePath("/dashboard/settings/locations");
  redirect("/dashboard/settings/locations");
}
