import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { AppointmentForm } from "@/components/appointment-form";
import { updateAppointment } from "@/lib/luxora/appointments-actions";
import { dateStrInTimeZone, formatInTimeZone } from "@/lib/luxora/timezone";

export default async function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: appointment }, { data: clients }, { data: services }, { data: staff }, { data: locations }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("id, client_id, staff_id, location_id, start_at, status, notes, deposit_amount_cents")
        .eq("id", id)
        .eq("business_id", ctx.business.id)
        .maybeSingle(),
      supabase.from("clients").select("id, full_name").eq("business_id", ctx.business.id).order("full_name"),
      supabase
        .from("services")
        .select("id, name, duration_minutes, price_cents")
        .eq("business_id", ctx.business.id)
        .eq("active", true)
        .order("name"),
      supabase.from("staff").select("id, full_name").eq("business_id", ctx.business.id).eq("active", true).order("full_name"),
      supabase.from("locations").select("id, name").eq("business_id", ctx.business.id).order("name"),
    ]);

  if (!appointment) notFound();

  const { data: apptServices } = await supabase
    .from("appointment_services")
    .select("service_id")
    .eq("appointment_id", id);

  const tz = ctx.business.timezone;
  const startAt = new Date(appointment.start_at);
  const defaultDate = dateStrInTimeZone(startAt, tz);
  const defaultTime = formatInTimeZone(startAt, tz, { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Edit Appointment</h1>
      <div className="mt-6">
        <AppointmentForm
          clients={clients ?? []}
          services={services ?? []}
          staff={staff ?? []}
          locations={locations ?? []}
          defaultDate={defaultDate}
          action={updateAppointment.bind(null, id)}
          submitLabel="Save Changes"
          pendingLabel="Saving…"
          defaultValues={{
            clientId: appointment.client_id,
            serviceIds: (apptServices ?? []).map((s) => s.service_id),
            staffId: appointment.staff_id,
            locationId: appointment.location_id,
            time: defaultTime,
            status: appointment.status,
            notes: appointment.notes ?? "",
            depositAmount: appointment.deposit_amount_cents > 0 ? (appointment.deposit_amount_cents / 100).toFixed(2) : "",
          }}
        />
      </div>
    </div>
  );
}
