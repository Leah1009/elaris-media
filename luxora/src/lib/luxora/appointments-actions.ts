"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";
import type { ActionState } from "@/lib/luxora/actions";

const EXCLUSION_VIOLATION = "23P01";

const AppointmentSchema = z.object({
  clientId: z.uuid("Choose a client."),
  staffId: z.uuid("Choose a staff member."),
  locationId: z.uuid("Choose a location."),
  date: z.string().min(1, "Choose a date."),
  time: z.string().min(1, "Choose a time."),
  status: z.enum(["pending", "confirmed"]),
  notes: z.string().optional(),
});

function getServiceIds(formData: FormData): string[] {
  return formData.getAll("serviceIds").map(String).filter(Boolean);
}

export async function createAppointment(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = AppointmentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const serviceIds = getServiceIds(formData);
  if (serviceIds.length === 0) {
    return { error: "Select at least one service." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, duration_minutes, price_cents")
    .eq("business_id", ctx.business.id)
    .in("id", serviceIds);

  if (servicesError || !services || services.length === 0) {
    return { error: "Could not load the selected services." };
  }

  const totalMinutes = services.reduce((sum, s) => sum + s.duration_minutes, 0);
  const startAt = zonedTimeToUtc(data.date, data.time, ctx.business.timezone);
  if (Number.isNaN(startAt.getTime())) {
    return { error: "Invalid date or time." };
  }
  const endAt = new Date(startAt.getTime() + totalMinutes * 60_000);

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      business_id: ctx.business.id,
      location_id: data.locationId,
      client_id: data.clientId,
      staff_id: data.staffId,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      status: data.status,
      notes: data.notes || null,
      source: "manual",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === EXCLUSION_VIOLATION) {
      return { error: "This staff member already has an appointment that overlaps this time." };
    }
    return { error: error.message };
  }

  await supabase.from("appointment_services").insert(
    services.map((s) => ({
      appointment_id: appointment.id,
      service_id: s.id,
      price_cents: s.price_cents,
      duration_minutes: s.duration_minutes,
    })),
  );

  revalidatePath("/dashboard/calendar");
  redirect(`/dashboard/calendar?date=${data.date}`);
}

const STATUS_VALUES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;

export async function updateAppointmentStatus(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const appointmentId = String(formData.get("appointmentId"));
  const status = String(formData.get("status"));

  if (!STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) return;

  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client_id, start_at, status")
    .eq("id", appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!appointment) return;

  await supabase.from("appointments").update({ status }).eq("id", appointmentId);

  if (status === "completed" && appointment.status !== "completed") {
    await recordClientVisit(supabase, appointment.client_id, appointment.start_at);
  }

  revalidatePath("/dashboard/calendar");
}

/**
 * Shared by manual status updates and checkout: marking an appointment
 * completed always advances the client's visit stats the same way,
 * whether that happens from the calendar or from taking payment.
 */
export async function recordClientVisit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clientId: string,
  visitAt: string,
) {
  const { data: client } = await supabase
    .from("clients")
    .select("id, total_visits, first_visit_at")
    .eq("id", clientId)
    .maybeSingle();

  if (!client) return;

  await supabase
    .from("clients")
    .update({
      total_visits: client.total_visits + 1,
      first_visit_at: client.first_visit_at ?? visitAt,
      last_visit_at: visitAt,
    })
    .eq("id", client.id);
}
