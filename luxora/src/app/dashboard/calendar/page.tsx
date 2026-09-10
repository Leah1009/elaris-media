import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getWeekDates, addDays, todayDateStr, weekdayLabel, dayLabel } from "@/lib/luxora/calendar";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";
import { CalendarDayGrid, type CalendarAppointment, type CalendarStaff } from "@/components/calendar-day-grid";
import { t } from "@/lib/luxora/i18n";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const anchor = date ?? todayDateStr();
  const weekDates = getWeekDates(anchor);
  const tz = ctx.business.timezone;

  const supabase = await createClient();

  const { data: locations } = await supabase
    .from("locations")
    .select("id, is_primary")
    .eq("business_id", ctx.business.id)
    .order("is_primary", { ascending: false });
  const primaryLocation = locations?.[0] ?? null;

  const dayOfWeek = new Date(`${anchor}T00:00:00Z`).getUTCDay();
  const { data: hours } = primaryLocation
    ? await supabase
        .from("business_hours")
        .select("open_time, close_time, closed")
        .eq("location_id", primaryLocation.id)
        .eq("day_of_week", dayOfWeek)
        .maybeSingle()
    : { data: null };

  const { data: staff } = await supabase
    .from("staff")
    .select("id, full_name")
    .eq("business_id", ctx.business.id)
    .eq("active", true)
    .order("full_name");

  const dayStart = zonedTimeToUtc(anchor, "00:00", tz);
  const dayEnd = zonedTimeToUtc(addDays(anchor, 1), "00:00", tz);

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `id, start_at, end_at, status, notes, staff_id,
       deposit_status, deposit_amount_cents, deposit_paid_cents,
       client:client_id(id, full_name, phone, email, sms_consent, email_consent),
       appointment_services(service:service_id(name, color))`,
    )
    .eq("business_id", ctx.business.id)
    .gte("start_at", dayStart.toISOString())
    .lt("start_at", dayEnd.toISOString())
    .order("start_at");

  const appointmentIds = (appointments ?? []).map((a) => a.id);
  const { data: messages } = appointmentIds.length
    ? await supabase
        .from("message_log")
        .select("id, appointment_id, channel, body, status, created_at")
        .in("appointment_id", appointmentIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const calendarAppointments: CalendarAppointment[] = (appointments ?? []).map((a) => {
    const client = a.client as unknown as {
      id: string;
      full_name: string;
      phone: string | null;
      email: string | null;
      sms_consent: boolean;
      email_consent: boolean;
    } | null;
    const services = (a.appointment_services as unknown as { service: { name: string; color: string } | null }[]) ?? [];
    return {
      id: a.id,
      startAt: a.start_at,
      endAt: a.end_at,
      status: a.status,
      notes: a.notes,
      staffId: a.staff_id,
      depositStatus: a.deposit_status,
      depositAmountCents: a.deposit_amount_cents,
      depositPaidCents: a.deposit_paid_cents,
      client,
      services: services.map((s) => s.service).filter((s): s is { name: string; color: string } => Boolean(s)),
      messages: (messages ?? [])
        .filter((m) => m.appointment_id === a.id)
        .map((m) => ({ id: m.id, channel: m.channel, body: m.body, status: m.status, createdAt: m.created_at })),
    };
  });

  const calendarStaff: CalendarStaff[] = staff ?? [];

  const prevDay = addDays(anchor, -1);
  const nextDay = addDays(anchor, 1);
  const today = todayDateStr();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-charcoal">{t(lang, "calendar_title")}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/calendar?date=${prevDay}`}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
          >
            ← {t(lang, "prev")}
          </Link>
          <Link
            href={`/dashboard/calendar?date=${today}`}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
          >
            {t(lang, "today")}
          </Link>
          <Link
            href={`/dashboard/calendar?date=${nextDay}`}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
          >
            {t(lang, "next")} →
          </Link>
          <Link
            href={`/dashboard/calendar/new?date=${anchor}`}
            className="rounded-sm bg-charcoal px-4 py-1.5 text-sm font-medium text-white hover:bg-charcoal-soft"
          >
            {t(lang, "new_appointment")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDates.map((day) => (
          <Link
            key={day}
            href={`/dashboard/calendar?date=${day}`}
            className={`flex flex-col items-center rounded-sm border px-1 py-2 text-center transition ${
              day === anchor
                ? "border-gold-deep bg-gold/10 text-charcoal"
                : "border-border bg-white text-ink hover:border-gold-deep"
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-ink/60">{weekdayLabel(day)}</span>
            <span className="text-sm font-medium">{dayLabel(day)}</span>
          </Link>
        ))}
      </div>

      {hours?.closed ? (
        <p className="rounded-sm border border-border bg-cream-deep p-3 text-sm text-charcoal">
          This location is closed on {weekdayLabel(anchor)}s. Any appointments below were booked outside regular
          hours.
        </p>
      ) : !hours ? (
        <p className="rounded-sm border border-border bg-cream-deep p-3 text-sm text-charcoal">
          No business hours configured for this day yet — showing a default 8 AM–8 PM window.{" "}
          <Link href="/dashboard/settings/locations" className="underline underline-offset-2">
            Set business hours
          </Link>
        </p>
      ) : null}

      <CalendarDayGrid
        openTime={hours && !hours.closed ? hours.open_time : null}
        closeTime={hours && !hours.closed ? hours.close_time : null}
        staff={calendarStaff}
        appointments={calendarAppointments}
        timezone={tz}
        date={anchor}
      />
    </div>
  );
}
