"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";
import { sendMessage } from "@/lib/luxora/messaging";
import { dollarsToCents, formatCents } from "@/lib/luxora/money";
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
  depositAmount: z.string().optional(),
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
  const depositAmountCents = dollarsToCents(data.depositAmount ?? "0");
  const depositDueAt = depositAmountCents > 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

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
      deposit_status: depositAmountCents > 0 ? "required" : "none",
      deposit_amount_cents: depositAmountCents,
      deposit_due_at: depositDueAt?.toISOString() ?? null,
    })
    .select("id, client_id")
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

  if (depositAmountCents > 0) {
    const { data: client } = await supabase
      .from("clients")
      .select("phone, email, sms_consent, email_consent")
      .eq("id", appointment.client_id)
      .maybeSingle();

    if (client) {
      const channel = client.sms_consent ? "sms" : "email";
      await sendMessage(supabase, {
        businessId: ctx.business.id,
        clientId: appointment.client_id,
        appointmentId: appointment.id,
        channel,
        toAddress: channel === "sms" ? client.phone : client.email,
        body: `A deposit of ${formatCents(depositAmountCents)} is required to hold your appointment. Please pay within 24 hours or it will be automatically cancelled.`,
        consentGiven: channel === "sms" ? client.sms_consent : client.email_consent,
      });
    }
  }

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

export async function updateAppointment(
  appointmentId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
  const depositAmountCents = dollarsToCents(data.depositAmount ?? "0");

  const { error } = await supabase
    .from("appointments")
    .update({
      location_id: data.locationId,
      client_id: data.clientId,
      staff_id: data.staffId,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      status: data.status,
      notes: data.notes || null,
      deposit_amount_cents: depositAmountCents,
      deposit_status: depositAmountCents > 0 ? "required" : "none",
    })
    .eq("id", appointmentId)
    .eq("business_id", ctx.business.id);

  if (error) {
    if (error.code === EXCLUSION_VIOLATION) {
      return { error: "This staff member already has an appointment that overlaps this time." };
    }
    return { error: error.message };
  }

  await supabase.from("appointment_services").delete().eq("appointment_id", appointmentId);
  await supabase.from("appointment_services").insert(
    services.map((s) => ({
      appointment_id: appointmentId,
      service_id: s.id,
      price_cents: s.price_cents,
      duration_minutes: s.duration_minutes,
    })),
  );

  revalidatePath("/dashboard/calendar");
  redirect(`/dashboard/calendar?date=${data.date}`);
}

export async function deleteAppointment(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const appointmentId = String(formData.get("appointmentId"));

  const supabase = await createClient();
  await supabase.from("appointments").delete().eq("id", appointmentId).eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/calendar");
  redirect("/dashboard/calendar");
}

const DepositPaymentSchema = z.object({
  appointmentId: z.uuid(),
  amount: z.string().min(1, "Enter an amount."),
  method: z.enum(["cash", "zelle", "cash_app", "other"]),
});

export async function recordDepositPayment(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = DepositPaymentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const amountCents = dollarsToCents(data.amount);
  if (amountCents <= 0) return { error: "Enter a valid amount." };

  const supabase = await createClient();
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client_id, deposit_amount_cents, deposit_paid_cents")
    .eq("id", data.appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!appointment) return { error: "Appointment not found." };

  const newPaidCents = appointment.deposit_paid_cents + amountCents;

  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      business_id: ctx.business.id,
      appointment_id: appointment.id,
      client_id: appointment.client_id,
      services_cents: 0,
      products_cents: 0,
      deposit_applied_cents: amountCents,
      total_cents: amountCents,
      method: data.method,
      status: "succeeded",
      notes: "Deposit payment",
    })
    .select("id")
    .single();

  if (error || !payment) return { error: error?.message ?? "Could not record deposit payment." };

  await supabase
    .from("appointments")
    .update({
      deposit_paid_cents: newPaidCents,
      deposit_status: newPaidCents >= appointment.deposit_amount_cents ? "paid" : "required",
    })
    .eq("id", appointment.id);

  revalidatePath("/dashboard/calendar");
  return null;
}

export async function sendAppointmentConfirmation(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const appointmentId = String(formData.get("appointmentId"));

  const supabase = await createClient();
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client_id, start_at, client:client_id(phone, email, sms_consent, email_consent)")
    .eq("id", appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!appointment?.client) return;

  const channel = appointment.client.sms_consent ? "sms" : "email";
  await sendMessage(supabase, {
    businessId: ctx.business.id,
    clientId: appointment.client_id,
    appointmentId: appointment.id,
    channel,
    toAddress: channel === "sms" ? appointment.client.phone : appointment.client.email,
    body: `Your appointment on ${new Date(appointment.start_at).toLocaleString()} is confirmed. See you then!`,
    consentGiven: channel === "sms" ? appointment.client.sms_consent : appointment.client.email_consent,
  });

  revalidatePath("/dashboard/calendar");
}
