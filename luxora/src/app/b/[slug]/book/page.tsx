import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";
import { BookingWizard, type FormOption } from "@/components/booking-wizard";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBookableBusinessBySlug(slug);
  if (!business) notFound();

  if (!business.online_booking_enabled) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">
          {business.name}
        </span>
        <h1 className="mt-2 font-display text-3xl text-charcoal">Book an Appointment</h1>
        <p className="mt-6 text-sm text-ink">
          Online booking isn&apos;t available right now — please contact {business.name} directly to
          schedule.
        </p>
      </main>
    );
  }

  const supabase = await createClient();

  const [{ data: services }, { data: staff }, { data: staffServices }, { data: forms }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, duration_minutes, price_cents, deposit_required")
      .eq("business_id", business.id)
      .eq("active", true)
      .order("name"),
    supabase.from("staff").select("id, full_name, title").eq("business_id", business.id).eq("active", true).order("full_name"),
    supabase.from("staff_services").select("staff_id, service_id"),
    supabase
      .from("client_forms")
      .select("id, name, service_id, trigger, form_fields(id, label, field_type, options, required, sort_order)")
      .eq("business_id", business.id)
      .eq("is_active", true)
      .in("trigger", ["first_visit_only", "every_appointment"]),
  ]);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">
        {business.name}
      </span>
      <h1 className="mt-2 font-display text-3xl text-charcoal">Book an Appointment</h1>

      <div className="mt-8">
        <BookingWizard
          slug={slug}
          services={services ?? []}
          staff={staff ?? []}
          staffServices={staffServices ?? []}
          forms={(forms ?? []) as unknown as FormOption[]}
          bookingWindowDays={business.booking_window_days}
        />
      </div>
    </main>
  );
}
