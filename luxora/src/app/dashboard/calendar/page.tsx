import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getWeekDates, addDays, todayDateStr, weekdayLabel, dayLabel } from "@/lib/luxora/calendar";
import { zonedTimeToUtc, dateStrInTimeZone, formatInTimeZone } from "@/lib/luxora/timezone";
import { AppointmentStatusForm } from "@/components/appointment-status-form";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-cream-deep text-charcoal",
  confirmed: "bg-gold/20 text-gold-deep",
  completed: "bg-charcoal text-white",
  cancelled: "border border-border text-ink/50 line-through",
  no_show: "border border-danger text-danger",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const ctx = await getBusinessContext();
  const anchor = date ?? todayDateStr();
  const weekDates = getWeekDates(anchor);
  const tz = ctx.business.timezone;

  const rangeStart = zonedTimeToUtc(weekDates[0], "00:00", tz);
  const rangeEnd = zonedTimeToUtc(addDays(weekDates[6], 1), "00:00", tz);

  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      "id, start_at, end_at, status, notes, client:client_id(full_name), staff:staff_id(full_name)",
    )
    .eq("business_id", ctx.business.id)
    .gte("start_at", rangeStart.toISOString())
    .lt("start_at", rangeEnd.toISOString())
    .order("start_at");

  const byDay = new Map<string, typeof appointments>();
  for (const day of weekDates) byDay.set(day, []);
  for (const appt of appointments ?? []) {
    const day = dateStrInTimeZone(new Date(appt.start_at), tz);
    byDay.get(day)?.push(appt);
  }

  const prevWeek = addDays(weekDates[0], -7);
  const nextWeek = addDays(weekDates[0], 7);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-charcoal">Calendar</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/calendar?date=${prevWeek}`}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
          >
            ← Prev
          </Link>
          <Link
            href={`/dashboard/calendar?date=${todayDateStr()}`}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
          >
            Today
          </Link>
          <Link
            href={`/dashboard/calendar?date=${nextWeek}`}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
          >
            Next →
          </Link>
          <Link
            href={`/dashboard/calendar/new?date=${anchor}`}
            className="rounded-sm bg-charcoal px-4 py-1.5 text-sm font-medium text-white hover:bg-charcoal-soft"
          >
            New Appointment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-7">
        {weekDates.map((day) => (
          <div key={day} className="rounded-sm border border-border bg-white p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/60">
              {weekdayLabel(day)} <span className="text-charcoal">{dayLabel(day)}</span>
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {(byDay.get(day) ?? []).length === 0 ? (
                <p className="text-xs text-ink/40">—</p>
              ) : (
                byDay.get(day)!.map((appt) => (
                  <div key={appt.id} className="rounded-sm border border-border p-2">
                    <p className="text-xs font-medium text-charcoal">
                      {formatInTimeZone(new Date(appt.start_at), tz, { hour: "numeric", minute: "2-digit" })}
                    </p>
                    <p className="mt-0.5 text-xs text-ink">
                      {(appt.client as unknown as { full_name: string } | null)?.full_name}
                    </p>
                    <p className="text-[11px] text-ink/60">
                      {(appt.staff as unknown as { full_name: string } | null)?.full_name}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] capitalize ${STATUS_STYLES[appt.status] ?? ""}`}
                    >
                      {appt.status.replace("_", " ")}
                    </span>
                    <AppointmentStatusForm appointmentId={appt.id} currentStatus={appt.status} />
                    <Link
                      href={`/dashboard/checkout/${appt.id}`}
                      className="mt-1 block text-[11px] font-medium text-gold-deep underline underline-offset-2"
                    >
                      Checkout
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
