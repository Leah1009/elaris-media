import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getWeekDates, addDays, todayDateStr, weekdayLabel, dayLabel, getMonthGrid } from "@/lib/luxora/calendar";
import { zonedTimeToUtc } from "@/lib/luxora/timezone";
import { CalendarDayGrid } from "@/components/calendar-day-grid";
import { CalendarWeekGrid, type DayHours } from "@/components/calendar-week-grid";
import { CalendarMonthGrid, type MonthDayAppointment } from "@/components/calendar-month-grid";
import { CalendarFiltersForm } from "@/components/calendar-filters-form";
import type { CalendarAppointment, CalendarBlock } from "@/components/calendar-types";
import { t } from "@/lib/luxora/i18n";

type View = "day" | "week" | "month";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    view?: string;
    staffId?: string;
    serviceId?: string;
    status?: string;
    locationId?: string;
  }>;
}) {
  const { date, view: viewParam, staffId, serviceId, status, locationId: locationIdParam } = await searchParams;
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const view: View = viewParam === "day" || viewParam === "month" ? viewParam : "week";
  const anchor = date ?? todayDateStr();
  const tz = ctx.business.timezone;
  const today = todayDateStr();

  const supabase = await createClient();

  const { data: locations } = await supabase
    .from("locations")
    .select("id, name, is_primary")
    .eq("business_id", ctx.business.id)
    .order("is_primary", { ascending: false });
  const primaryLocation = locations?.find((l) => l.id === locationIdParam) ?? locations?.[0] ?? null;

  const { data: staffRows } = await supabase
    .from("staff")
    .select("id, full_name")
    .eq("business_id", ctx.business.id)
    .eq("active", true)
    .order("full_name");
  const allStaff = staffRows ?? [];
  const filteredStaff = staffId ? allStaff.filter((s) => s.id === staffId) : allStaff;

  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .eq("business_id", ctx.business.id)
    .order("name");

  let matchingAppointmentIds: string[] | null = null;
  if (serviceId) {
    const { data: rows } = await supabase
      .from("appointment_services")
      .select("appointment_id")
      .eq("service_id", serviceId);
    matchingAppointmentIds = (rows ?? []).map((r) => r.appointment_id);
  }

  async function fetchAppointments(rangeStart: Date, rangeEnd: Date) {
    let query = supabase
      .from("appointments")
      .select(
        `id, start_at, end_at, status, notes, staff_id, location_id,
         deposit_status, deposit_amount_cents, deposit_paid_cents,
         client:client_id(id, full_name, phone, email, sms_consent, email_consent),
         appointment_services(service:service_id(name, color))`,
      )
      .eq("business_id", ctx.business.id)
      .gte("start_at", rangeStart.toISOString())
      .lt("start_at", rangeEnd.toISOString())
      .order("start_at");

    if (primaryLocation) query = query.eq("location_id", primaryLocation.id);
    if (staffId) query = query.eq("staff_id", staffId);
    if (status) query = query.eq("status", status);
    if (matchingAppointmentIds) query = query.in("id", matchingAppointmentIds);

    const { data } = await query;
    return data ?? [];
  }

  async function fetchBlocks(rangeStart: Date, rangeEnd: Date): Promise<CalendarBlock[]> {
    let query = supabase
      .from("appointment_blocks")
      .select("id, start_at, end_at, staff_id, reason")
      .eq("business_id", ctx.business.id)
      .lt("start_at", rangeEnd.toISOString())
      .gt("end_at", rangeStart.toISOString());
    if (primaryLocation) query = query.eq("location_id", primaryLocation.id);
    if (staffId) query = query.or(`staff_id.eq.${staffId},staff_id.is.null`);

    const { data } = await query;
    return (data ?? []).map((b) => ({ id: b.id, startAt: b.start_at, endAt: b.end_at, staffId: b.staff_id, reason: b.reason }));
  }

  function enrichAppointments(rows: Awaited<ReturnType<typeof fetchAppointments>>): CalendarAppointment[] {
    return rows.map((a) => {
      const client = a.client as unknown as CalendarAppointment["client"];
      const svcRows = (a.appointment_services as unknown as { service: { name: string; color: string } | null }[]) ?? [];
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
        services: svcRows.map((s) => s.service).filter((s): s is { name: string; color: string } => Boolean(s)),
        messages: [],
      };
    });
  }

  async function fetchDayHours(dateStr: string) {
    if (!primaryLocation) return null;
    const dayOfWeek = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
    const { data } = await supabase
      .from("business_hours")
      .select("open_time, close_time, closed")
      .eq("location_id", primaryLocation.id)
      .eq("day_of_week", dayOfWeek)
      .maybeSingle();
    return data;
  }

  const filterBar = (
    <CalendarFiltersForm
      view={view}
      date={anchor}
      locations={locations ?? []}
      staff={allStaff}
      services={services ?? []}
      selected={{ locationId: primaryLocation?.id, staffId, serviceId, status }}
    />
  );

  const viewSwitcher = (
    <div className="flex rounded-sm border border-border bg-white">
      {(["day", "week", "month"] as View[]).map((v) => (
        <Link
          key={v}
          href={buildHref({ view: v, date: anchor, staffId, serviceId, status, locationId: primaryLocation?.id })}
          className={`px-3 py-1.5 text-xs font-medium capitalize transition ${
            view === v ? "bg-charcoal text-white" : "text-charcoal hover:bg-cream-deep"
          }`}
        >
          {v}
        </Link>
      ))}
    </div>
  );

  const navControls = (
    <div className="flex items-center gap-2">
      <Link
        href={buildHref({ view, date: shiftDate(anchor, view, -1), staffId, serviceId, status, locationId: primaryLocation?.id })}
        className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
      >
        ← {t(lang, "prev")}
      </Link>
      <Link
        href={buildHref({ view, date: today, staffId, serviceId, status, locationId: primaryLocation?.id })}
        className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
      >
        {t(lang, "today")}
      </Link>
      <Link
        href={buildHref({ view, date: shiftDate(anchor, view, 1), staffId, serviceId, status, locationId: primaryLocation?.id })}
        className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal hover:border-gold-deep"
      >
        {t(lang, "next")} →
      </Link>
      {viewSwitcher}
      <Link
        href={`/dashboard/calendar/new?date=${anchor}`}
        className="rounded-sm bg-charcoal px-4 py-1.5 text-sm font-medium text-white hover:bg-charcoal-soft"
      >
        + {t(lang, "new_appointment")}
      </Link>
    </div>
  );

  if (view === "month") {
    const m = Number(anchor.split("-")[1]);
    const weeks = getMonthGrid(anchor);
    const rangeStart = zonedTimeToUtc(weeks[0][0], "00:00", tz);
    const rangeEnd = zonedTimeToUtc(addDays(weeks[weeks.length - 1][6], 1), "00:00", tz);
    const rows = await fetchAppointments(rangeStart, rangeEnd);

    const appointmentsByDay = new Map<string, MonthDayAppointment[]>();
    for (const a of rows) {
      const dayKey = a.start_at.slice(0, 10);
      const client = a.client as unknown as { full_name: string } | null;
      const svcRows = (a.appointment_services as unknown as { service: { name: string; color: string } | null }[]) ?? [];
      const color = svcRows[0]?.service?.color || "#a97142";
      const list = appointmentsByDay.get(dayKey) ?? [];
      list.push({ id: a.id, label: client?.full_name ?? "Client", color });
      appointmentsByDay.set(dayKey, list);
    }

    const closedDays = new Set<string>();
    if (primaryLocation) {
      const { data: hoursRows } = await supabase
        .from("business_hours")
        .select("day_of_week, closed")
        .eq("location_id", primaryLocation.id);
      const closedByDow = new Set((hoursRows ?? []).filter((h) => h.closed).map((h) => h.day_of_week));
      for (const week of weeks) {
        for (const day of week) {
          const dow = new Date(`${day}T00:00:00Z`).getUTCDay();
          if (closedByDow.has(dow)) closedDays.add(day);
        }
      }
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl text-charcoal">
            {t(lang, "calendar_title")} · {monthLabel(anchor)}
          </h1>
          {navControls}
        </div>
        {filterBar}
        <CalendarMonthGrid weeks={weeks} currentMonth={m} today={today} appointmentsByDay={appointmentsByDay} closedDays={closedDays} />
      </div>
    );
  }

  if (view === "week") {
    const weekDates = getWeekDates(anchor);
    const rangeStart = zonedTimeToUtc(weekDates[0], "00:00", tz);
    const rangeEnd = zonedTimeToUtc(addDays(weekDates[6], 1), "00:00", tz);
    const [rows, blocks] = await Promise.all([fetchAppointments(rangeStart, rangeEnd), fetchBlocks(rangeStart, rangeEnd)]);
    const appointments = enrichAppointments(rows);

    const hoursByDay: DayHours[] = await Promise.all(
      weekDates.map(async (d) => {
        const hours = await fetchDayHours(d);
        if (!hours) return { openMinutes: null, closeMinutes: null, closed: false };
        return {
          openMinutes: hours.open_time ? toMinutes(hours.open_time) : null,
          closeMinutes: hours.close_time ? toMinutes(hours.close_time) : null,
          closed: hours.closed,
        };
      }),
    );

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl text-charcoal">{t(lang, "calendar_title")}</h1>
          {navControls}
        </div>
        {filterBar}
        <CalendarWeekGrid
          weekDates={weekDates}
          weekdayLabels={weekDates.map((d) => weekdayLabel(d))}
          hoursByDay={hoursByDay}
          appointments={appointments}
          blocks={blocks}
          staff={filteredStaff}
          locations={locations ?? []}
          timezone={tz}
          defaultLocationId={primaryLocation?.id}
        />
      </div>
    );
  }

  // Day view
  const dayStart = zonedTimeToUtc(anchor, "00:00", tz);
  const dayEnd = zonedTimeToUtc(addDays(anchor, 1), "00:00", tz);
  const [rows, blocks, hours] = await Promise.all([
    fetchAppointments(dayStart, dayEnd),
    fetchBlocks(dayStart, dayEnd),
    fetchDayHours(anchor),
  ]);
  const appointments = enrichAppointments(rows);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-charcoal">{t(lang, "calendar_title")}</h1>
        {navControls}
      </div>
      {filterBar}

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {getWeekDates(anchor).map((day) => (
          <Link
            key={day}
            href={buildHref({ view: "day", date: day, staffId, serviceId, status, locationId: primaryLocation?.id })}
            className={`flex flex-col items-center rounded-sm border px-1 py-2 text-center transition ${
              day === anchor ? "border-gold-deep bg-gold/10 text-charcoal" : "border-border bg-white text-ink hover:border-gold-deep"
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-ink/60">{weekdayLabel(day)}</span>
            <span className="text-sm font-medium">{dayLabel(day)}</span>
          </Link>
        ))}
      </div>

      {hours?.closed ? (
        <p className="rounded-sm border border-border bg-cream-deep p-3 text-sm text-charcoal">
          This location is closed on {weekdayLabel(anchor)}s. Any appointments below were booked outside regular hours.
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
        staff={filteredStaff}
        appointments={appointments}
        blocks={blocks}
        timezone={tz}
        date={anchor}
        locations={locations ?? []}
        defaultLocationId={primaryLocation?.id}
      />
    </div>
  );
}

function toMinutes(t: string): number {
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

function shiftDate(dateStr: string, view: View, direction: 1 | -1): string {
  if (view === "week") return addDays(dateStr, 7 * direction);
  if (view === "month") {
    const [y, m, d] = dateStr.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1 + direction, d));
    return next.toISOString().slice(0, 10);
  }
  return addDays(dateStr, direction);
}

function monthLabel(dateStr: string): string {
  const [y, m] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function buildHref(params: {
  view: View;
  date: string;
  staffId?: string;
  serviceId?: string;
  status?: string;
  locationId?: string;
}): string {
  const qs = new URLSearchParams({ view: params.view, date: params.date });
  if (params.staffId) qs.set("staffId", params.staffId);
  if (params.serviceId) qs.set("serviceId", params.serviceId);
  if (params.status) qs.set("status", params.status);
  if (params.locationId) qs.set("locationId", params.locationId);
  return `/dashboard/calendar?${qs.toString()}`;
}
