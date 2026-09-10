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

  const { data: location, error } = await supabase
    .from("locations")
    .insert({
      business_id: ctx.business.id,
      name: data.name,
      address_line1: data.addressLine1,
      city: data.city,
      state: data.state,
      zip: data.zip,
      phone: data.phone || null,
      is_primary: (count ?? 0) === 0,
    })
    .select("id")
    .single();

  if (error || !location) {
    return { error: error?.message ?? "Could not create location." };
  }

  // Every location needs all 7 business_hours rows to exist up front —
  // updateBusinessHours only ever updates existing rows, so a location
  // seeded with none would silently ignore any hours a business sets for
  // it. register_business seeds these the same way for a business's first
  // (auto-created) location; this is the same seed for every one after it.
  await supabase.from("business_hours").insert(
    Array.from({ length: 7 }, (_, day) => ({
      location_id: location.id,
      day_of_week: day,
      open_time: day >= 1 && day <= 5 ? "09:00" : null,
      close_time: day >= 1 && day <= 5 ? "17:00" : null,
      closed: day === 0 || day === 6,
    })),
  );

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

  const rows = Array.from({ length: 7 }, (_, day) => {
    const closed = formData.get(`closed_${day}`) === "on";
    const open = String(formData.get(`open_${day}`) ?? "");
    const close = String(formData.get(`close_${day}`) ?? "");
    return {
      location_id: locationId,
      day_of_week: day,
      closed,
      open_time: closed ? null : open || null,
      close_time: closed ? null : close || null,
    };
  });

  // Upsert rather than update-only: a location created before this row
  // existed (or missing a day for any other reason) would otherwise have
  // its hours silently ignored instead of saved.
  await supabase.from("business_hours").upsert(rows, { onConflict: "location_id,day_of_week" });

  revalidatePath("/dashboard/settings/locations");
  redirect("/dashboard/settings/locations");
}
