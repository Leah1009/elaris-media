"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const SettingsSchema = z.object({
  onlineBookingEnabled: z.string().optional(),
  bookingWindowDays: z.coerce.number().int().min(1, "Must be at least 1 day."),
  minNoticeHours: z.coerce.number().int().min(0),
  bufferMinutes: z.coerce.number().int().min(0),
});

export async function updateOnlineBookingSettings(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = SettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("businesses")
    .update({
      online_booking_enabled: data.onlineBookingEnabled === "on",
      booking_window_days: data.bookingWindowDays,
      min_notice_hours: data.minNoticeHours,
      buffer_minutes: data.bufferMinutes,
    })
    .eq("id", ctx.business.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings/online-booking");
  return null;
}
