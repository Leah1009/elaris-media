import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { AppointmentForm } from "@/components/appointment-form";
import { todayDateStr } from "@/lib/luxora/calendar";

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; time?: string; staffId?: string; locationId?: string }>;
}) {
  const { date, time, staffId, locationId } = await searchParams;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: clients }, { data: services }, { data: staff }, { data: locations }] = await Promise.all([
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

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">New Appointment</h1>
      {(!clients || clients.length === 0) ? (
        <p className="mt-6 rounded-sm border border-border bg-white p-6 text-sm text-ink">
          Add a client first before booking an appointment.
        </p>
      ) : (!services || services.length === 0) ? (
        <p className="mt-6 rounded-sm border border-border bg-white p-6 text-sm text-ink">
          Add a service first before booking an appointment.
        </p>
      ) : (!staff || staff.length === 0) ? (
        <p className="mt-6 rounded-sm border border-border bg-white p-6 text-sm text-ink">
          Add a staff member first before booking an appointment.
        </p>
      ) : (
        <div className="mt-6">
          <AppointmentForm
            clients={clients}
            services={services}
            staff={staff}
            locations={locations ?? []}
            defaultDate={date ?? todayDateStr()}
            defaultValues={{ time, staffId, locationId }}
          />
        </div>
      )}
    </div>
  );
}
