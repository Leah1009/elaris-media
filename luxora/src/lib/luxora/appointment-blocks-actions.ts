"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";
import type { ActionState } from "@/lib/luxora/actions";

const BlockSchema = z.object({
  locationId: z.uuid("Choose a location."),
  staffId: z.string().optional(),
  date: z.string().min(1, "Choose a date."),
  startTime: z.string().min(1, "Choose a start time."),
  endTime: z.string().min(1, "Choose an end time."),
  reason: z.string().optional(),
});

export async function createAppointmentBlock(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = BlockSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const startAt = zonedTimeToUtc(data.date, data.startTime, ctx.business.timezone);
  const endAt = zonedTimeToUtc(data.date, data.endTime, ctx.business.timezone);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    return { error: "Invalid date or time." };
  }
  if (endAt <= startAt) {
    return { error: "End time must be after the start time." };
  }

  const { error } = await supabase.from("appointment_blocks").insert({
    business_id: ctx.business.id,
    location_id: data.locationId,
    staff_id: data.staffId || null,
    start_at: startAt.toISOString(),
    end_at: endAt.toISOString(),
    reason: data.reason || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/calendar");
  return null;
}

export async function deleteAppointmentBlock(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const blockId = String(formData.get("blockId"));
  const supabase = await createClient();

  await supabase.from("appointment_blocks").delete().eq("id", blockId).eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/calendar");
}
