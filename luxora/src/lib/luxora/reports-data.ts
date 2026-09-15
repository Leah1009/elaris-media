import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { dateStrInTimeZone } from "@/lib/luxora/timezone";
import { METHOD_LABELS } from "@/lib/luxora/payments";

export type ReportsPeriodKey = "7" | "30" | "90" | "365" | "all" | "custom";

export const PERIODS: { key: ReportsPeriodKey; days: number | null }[] = [
  { key: "7", days: 7 },
  { key: "30", days: 30 },
  { key: "90", days: 90 },
  { key: "365", days: 365 },
  { key: "all", days: null },
];

export type ReportsFilters = {
  periodKey: ReportsPeriodKey;
  from: string | null;
  to: string | null;
  locationId: string | null;
};

function isValidDateStr(s: string | undefined | null): s is string {
  return Boolean(s) && /^\d{4}-\d{2}-\d{2}$/.test(s!);
}

/**
 * Resolves the raw filters from URL search params into a concrete UTC
 * window. Custom range wins over a period key; "all" means no lower bound.
 */
export function resolveReportsFilters(searchParams: {
  tab?: string;
  period?: string;
  from?: string;
  to?: string;
  location?: string;
}): { periodStart: string | null; periodEnd: string | null; filters: ReportsFilters; spanDays: number | null } {
  const isCustomRange = isValidDateStr(searchParams.from) && isValidDateStr(searchParams.to);
  const period = PERIODS.find((p) => p.key === searchParams.period) ?? PERIODS[1];

  const periodStart = isCustomRange
    ? new Date(`${searchParams.from}T00:00:00.000Z`).toISOString()
    : period.days
      ? new Date(Date.now() - period.days * 86_400_000).toISOString()
      : null;
  const periodEnd = isCustomRange ? new Date(`${searchParams.to}T23:59:59.999Z`).toISOString() : null;

  const spanDays = periodStart
    ? Math.round((new Date(periodEnd ?? Date.now()).getTime() - new Date(periodStart).getTime()) / 86_400_000)
    : null;

  return {
    periodStart,
    periodEnd,
    spanDays,
    filters: {
      periodKey: isCustomRange ? "custom" : period.key,
      from: isCustomRange ? searchParams.from! : null,
      to: isCustomRange ? searchParams.to! : null,
      locationId: searchParams.location && searchParams.location !== "all" ? searchParams.location : null,
    },
  };
}

export type ChartBucket = { key: string; label: string; cents: number; count: number };

/** day for short/typical windows, week for 90-day-ish, month for a year or more. */
function pickGranularity(spanDays: number | null): "day" | "week" | "month" {
  if (spanDays === null) return "month";
  if (spanDays <= 35) return "day";
  if (spanDays <= 150) return "week";
  return "month";
}

function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function monthLabel(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(`${dateStr}T00:00:00Z`));
}
function dayLabel(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${dateStr}T00:00:00Z`));
}

/**
 * Buckets already-fetched rows (with a real cents amount and a UTC
 * timestamp) into day/week/month buckets in the business's own timezone —
 * zero-filled across the full requested window so gaps read as "$0 that
 * day", a real data point, not a missing one. "All time" only buckets by
 * month and only emits months that actually have data, since there's no
 * natural lower bound to zero-fill from.
 */
export function bucketByPeriod(
  rows: { created_at: string; cents: number }[],
  opts: { periodStart: string | null; periodEnd: string | null; timezone: string; locale: string },
): ChartBucket[] {
  const granularity = pickGranularity(
    opts.periodStart
      ? Math.round((new Date(opts.periodEnd ?? Date.now()).getTime() - new Date(opts.periodStart).getTime()) / 86_400_000)
      : null,
  );

  if (opts.periodStart === null) {
    // All time: only real months with data.
    const byMonth = new Map<string, { cents: number; count: number }>();
    for (const r of rows) {
      const day = dateStrInTimeZone(new Date(r.created_at), opts.timezone);
      const monthKey = day.slice(0, 7);
      const existing = byMonth.get(monthKey) ?? { cents: 0, count: 0 };
      existing.cents += r.cents;
      existing.count += 1;
      byMonth.set(monthKey, existing);
    }
    return [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, v]) => ({ key: monthKey, label: monthLabel(`${monthKey}-01`, opts.locale), cents: v.cents, count: v.count }));
  }

  const startDay = dateStrInTimeZone(new Date(opts.periodStart), opts.timezone);
  const endDay = dateStrInTimeZone(new Date(opts.periodEnd ?? Date.now()), opts.timezone);

  if (granularity === "day") {
    const buckets = new Map<string, { cents: number; count: number }>();
    for (let d = startDay; d <= endDay; d = addDaysStr(d, 1)) buckets.set(d, { cents: 0, count: 0 });
    for (const r of rows) {
      const day = dateStrInTimeZone(new Date(r.created_at), opts.timezone);
      if (buckets.has(day)) {
        const b = buckets.get(day)!;
        b.cents += r.cents;
        b.count += 1;
      }
    }
    return [...buckets.entries()].map(([day, v]) => ({ key: day, label: dayLabel(day, opts.locale), cents: v.cents, count: v.count }));
  }

  if (granularity === "week") {
    const buckets = new Map<string, { cents: number; count: number; label: string }>();
    for (let d = startDay; d <= endDay; d = addDaysStr(d, 7)) {
      buckets.set(d, { cents: 0, count: 0, label: dayLabel(d, opts.locale) });
    }
    const weekStarts = [...buckets.keys()].sort();
    for (const r of rows) {
      const day = dateStrInTimeZone(new Date(r.created_at), opts.timezone);
      let bucketKey = weekStarts[0];
      for (const ws of weekStarts) {
        if (day >= ws) bucketKey = ws;
        else break;
      }
      const b = buckets.get(bucketKey);
      if (b) {
        b.cents += r.cents;
        b.count += 1;
      }
    }
    return [...buckets.entries()].map(([key, v]) => ({ key, label: v.label, cents: v.cents, count: v.count }));
  }

  // month
  const buckets = new Map<string, { cents: number; count: number }>();
  let cursor = startDay.slice(0, 7);
  const endMonth = endDay.slice(0, 7);
  while (cursor <= endMonth) {
    buckets.set(cursor, { cents: 0, count: 0 });
    const [y, m] = cursor.split("-").map(Number);
    const next = new Date(Date.UTC(y, m, 1));
    cursor = next.toISOString().slice(0, 7);
  }
  for (const r of rows) {
    const day = dateStrInTimeZone(new Date(r.created_at), opts.timezone);
    const monthKey = day.slice(0, 7);
    if (buckets.has(monthKey)) {
      const b = buckets.get(monthKey)!;
      b.cents += r.cents;
      b.count += 1;
    }
  }
  return [...buckets.entries()].map(([monthKey, v]) => ({
    key: monthKey,
    label: monthLabel(`${monthKey}-01`, opts.locale),
    cents: v.cents,
    count: v.count,
  }));
}

/**
 * A trend requires a real prior period of equal length to compare against
 * — there is no such thing for "all time" or a custom range with no fixed
 * length assumption, so this returns null rather than fabricate one.
 */
export async function getPreviousPeriodGrossRevenue(
  supabase: SupabaseClient<Database>,
  businessId: string,
  periodStart: string | null,
  periodEnd: string | null,
  locationId: string | null,
): Promise<number | null> {
  if (!periodStart) return null;
  const end = periodEnd ? new Date(periodEnd) : new Date();
  const spanMs = end.getTime() - new Date(periodStart).getTime();
  const prevStart = new Date(new Date(periodStart).getTime() - spanMs).toISOString();
  const prevEnd = periodStart;

  const { data: prevPayments } = await supabase
    .from("payments")
    .select("total_cents, appointment_id")
    .eq("business_id", businessId)
    .in("status", ["succeeded", "refunded", "partially_refunded"])
    .gte("created_at", prevStart)
    .lt("created_at", prevEnd);

  let rows = prevPayments ?? [];
  if (locationId) {
    const { data: prevAppointments } = await supabase
      .from("appointments")
      .select("id")
      .eq("business_id", businessId)
      .eq("location_id", locationId)
      .gte("start_at", prevStart)
      .lt("start_at", prevEnd);
    const allowed = new Set((prevAppointments ?? []).map((a) => a.id));
    rows = rows.filter((p) => p.appointment_id && allowed.has(p.appointment_id));
  }

  const prevGrossCents = rows.reduce((sum, p) => sum + p.total_cents, 0);
  return prevGrossCents > 0 ? prevGrossCents : null;
}

export type ReportsData = {
  grossRevenueCents: number;
  refundedCents: number;
  netRevenueCents: number;
  transactionCount: number;
  averageTicketCents: number;
  depositsCollectedCents: number;
  newClientCount: number;
  returningClientCount: number;
  clientsServedCount: number;
  totalAppointments: number;
  statusCounts: Record<string, number>;
  cancellationRate: number;
  revenueBuckets: ChartBucket[];
  paymentMethodBreakdown: { method: string; label: string; cents: number; count: number }[];
  dayOfWeekCounts: number[]; // index 0 = Sunday
  hourOfDayCounts: { hour: number; count: number }[];
  topServices: { id: string; name: string; count: number; cents: number }[];
  totalServiceRevenueCents: number;
  topStaff: { id: string; name: string; count: number; cents: number; tipsCents: number; averageTicketCents: number }[];
  topClientsBySpend: { id: string; name: string; cents: number; visitCount: number }[];
  inactiveClients: { id: string; name: string; lastVisitAt: string | null }[];
  locations: { id: string; name: string }[];
};

/**
 * Single source of truth for every Reports metric — Overview and every tab
 * read from the same window, so numbers never disagree across the page.
 *
 * Definitions (documented once, here, rather than re-derived per tab):
 * - Gross Revenue: sum of payments.total_cents for payments with status in
 *   (succeeded, refunded, partially_refunded), by payment created_at.
 * - Refunds: sum of refunds.amount_cents, by refund created_at.
 * - Net Revenue: Gross Revenue − Refunds.
 * - Average Ticket: Gross Revenue ÷ number of payments in the window.
 * - Deposits Collected: sum of appointments.deposit_paid_cents for
 *   appointments starting in the window.
 * - New Client: a client whose clients.first_visit_at falls in the window.
 * - Returning Client: a client with a completed appointment in the window
 *   whose clients.total_visits > 1 (this wasn't their only visit ever) —
 *   avoids the "new count subtracted from served count" trap, which can
 *   misclassify a client whose first visit was in a prior window.
 * - Cancellation Rate: cancelled appointments ÷ total appointments in the
 *   window (appointments counted by start_at).
 */
export async function getReportsData(
  supabase: SupabaseClient<Database>,
  businessId: string,
  timezone: string,
  locale: string,
  opts: { periodStart: string | null; periodEnd: string | null; locationId: string | null },
): Promise<ReportsData> {
  const { periodStart, periodEnd, locationId } = opts;

  let appointmentsQuery = supabase
    .from("appointments")
    .select("id, staff_id, status, start_at, client_id, deposit_paid_cents, location_id, staff:staff_id(full_name)")
    .eq("business_id", businessId);
  if (periodStart) appointmentsQuery = appointmentsQuery.gte("start_at", periodStart);
  if (periodEnd) appointmentsQuery = appointmentsQuery.lte("start_at", periodEnd);
  if (locationId) appointmentsQuery = appointmentsQuery.eq("location_id", locationId);

  const [{ data: appointments }, { count: newClientCount }, { data: locations }] = await Promise.all([
    appointmentsQuery,
    (() => {
      let q = supabase.from("clients").select("id", { count: "exact", head: true }).eq("business_id", businessId);
      if (periodStart) q = q.gte("first_visit_at", periodStart);
      if (periodEnd) q = q.lte("first_visit_at", periodEnd);
      return q;
    })(),
    supabase.from("locations").select("id, name").eq("business_id", businessId).eq("active", true).order("is_primary", { ascending: false }),
  ]);

  const appointmentIds = (appointments ?? []).map((a) => a.id);
  const allowedAppointmentIds = locationId ? new Set(appointmentIds) : null;

  let paymentsQuery = supabase
    .from("payments")
    .select("id, total_cents, tip_cents, status, method, created_at, appointment_id, client_id")
    .eq("business_id", businessId)
    .in("status", ["succeeded", "refunded", "partially_refunded"]);
  if (periodStart) paymentsQuery = paymentsQuery.gte("created_at", periodStart);
  if (periodEnd) paymentsQuery = paymentsQuery.lte("created_at", periodEnd);

  let refundsQuery = supabase.from("refunds").select("amount_cents, payment_id, created_at").eq("business_id", businessId);
  if (periodStart) refundsQuery = refundsQuery.gte("created_at", periodStart);
  if (periodEnd) refundsQuery = refundsQuery.lte("created_at", periodEnd);

  const [{ data: paymentsRaw }, { data: refunds }] = await Promise.all([paymentsQuery, refundsQuery]);
  const payments = allowedAppointmentIds
    ? (paymentsRaw ?? []).filter((p) => p.appointment_id && allowedAppointmentIds.has(p.appointment_id))
    : (paymentsRaw ?? []);

  const { data: appointmentServices } = appointmentIds.length
    ? await supabase
        .from("appointment_services")
        .select("service_id, price_cents, appointment_id, service:service_id(id, name)")
        .in("appointment_id", appointmentIds)
    : { data: [] };

  const grossRevenueCents = payments.reduce((sum, p) => sum + p.total_cents, 0);
  const refundedCents = (refunds ?? []).reduce((sum, r) => sum + r.amount_cents, 0);
  const netRevenueCents = grossRevenueCents - refundedCents;
  const transactionCount = payments.length;
  const averageTicketCents = transactionCount > 0 ? Math.round(grossRevenueCents / transactionCount) : 0;

  const statusCounts: Record<string, number> = {};
  const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0];
  const hourBuckets = new Map<number, number>();
  for (const a of appointments ?? []) {
    statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1;
    const localDateStr = dateStrInTimeZone(new Date(a.start_at), timezone);
    const localDay = new Date(`${localDateStr}T00:00:00Z`).getUTCDay();
    dayOfWeekCounts[localDay] += 1;
    const localHour = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hourCycle: "h23" }).format(new Date(a.start_at)),
    );
    hourBuckets.set(localHour, (hourBuckets.get(localHour) ?? 0) + 1);
  }
  const totalAppointments = appointments?.length ?? 0;
  const cancelledCount = statusCounts.cancelled ?? 0;
  const cancellationRate = totalAppointments > 0 ? Math.round((cancelledCount / totalAppointments) * 100) : 0;
  const depositsCollectedCents = (appointments ?? []).reduce((sum, a) => sum + a.deposit_paid_cents, 0);
  const hourOfDayCounts = [...hourBuckets.entries()].sort(([a], [b]) => a - b).map(([hour, count]) => ({ hour, count }));

  const appointmentById = new Map((appointments ?? []).map((a) => [a.id, a]));

  const staffRevenue = new Map<string, { name: string; cents: number; tipsCents: number; count: number }>();
  for (const p of payments) {
    if (!p.appointment_id) continue;
    const appt = appointmentById.get(p.appointment_id);
    if (!appt?.staff_id) continue;
    const existing = staffRevenue.get(appt.staff_id) ?? { name: appt.staff?.full_name ?? "Staff", cents: 0, tipsCents: 0, count: 0 };
    existing.cents += p.total_cents;
    existing.tipsCents += p.tip_cents;
    existing.count += 1;
    staffRevenue.set(appt.staff_id, existing);
  }
  const topStaff = [...staffRevenue.entries()]
    .map(([id, v]) => ({ id, ...v, averageTicketCents: v.count > 0 ? Math.round(v.cents / v.count) : 0 }))
    .sort((a, b) => b.cents - a.cents)
    .slice(0, 10);

  const serviceRevenue = new Map<string, { name: string; cents: number; count: number }>();
  for (const row of appointmentServices ?? []) {
    const appt = appointmentById.get(row.appointment_id);
    if (appt?.status !== "completed") continue;
    const existing = serviceRevenue.get(row.service_id) ?? { name: row.service?.name ?? "Service", cents: 0, count: 0 };
    existing.cents += row.price_cents;
    existing.count += 1;
    serviceRevenue.set(row.service_id, existing);
  }
  const totalServiceRevenueCents = [...serviceRevenue.values()].reduce((sum, v) => sum + v.cents, 0);
  const topServices = [...serviceRevenue.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.cents - a.cents)
    .slice(0, 10);

  const servedClientIds = [...new Set((appointments ?? []).filter((a) => a.status === "completed").map((a) => a.client_id))];
  const { data: servedClients } = servedClientIds.length
    ? await supabase
        .from("clients")
        .select("id, full_name, total_visits, lifetime_spend_cents, last_visit_at")
        .in("id", servedClientIds)
    : { data: [] };
  const returningClientCount = (servedClients ?? []).filter((c) => c.total_visits > 1).length;
  const clientsServedCount = servedClientIds.length;

  const topClientsBySpend = [...(servedClients ?? [])]
    .sort((a, b) => b.lifetime_spend_cents - a.lifetime_spend_cents)
    .slice(0, 10)
    .map((c) => ({ id: c.id, name: c.full_name, cents: c.lifetime_spend_cents, visitCount: c.total_visits }));

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000).toISOString();
  const { data: inactiveClientsRaw } = await supabase
    .from("clients")
    .select("id, full_name, last_visit_at")
    .eq("business_id", businessId)
    .not("last_visit_at", "is", null)
    .lt("last_visit_at", ninetyDaysAgo)
    .order("last_visit_at", { ascending: false })
    .limit(10);

  const revenueBuckets = bucketByPeriod(
    payments.map((p) => ({ created_at: p.created_at, cents: p.total_cents })),
    { periodStart, periodEnd, timezone, locale },
  );

  const methodTotals = new Map<string, { cents: number; count: number }>();
  for (const p of payments) {
    const existing = methodTotals.get(p.method) ?? { cents: 0, count: 0 };
    existing.cents += p.total_cents;
    existing.count += 1;
    methodTotals.set(p.method, existing);
  }
  const paymentMethodBreakdown = [...methodTotals.entries()]
    .map(([method, v]) => ({ method, label: METHOD_LABELS[method] ?? method, ...v }))
    .sort((a, b) => b.cents - a.cents);

  return {
    grossRevenueCents,
    refundedCents,
    netRevenueCents,
    transactionCount,
    averageTicketCents,
    depositsCollectedCents,
    newClientCount: newClientCount ?? 0,
    returningClientCount,
    clientsServedCount,
    totalAppointments,
    statusCounts,
    cancellationRate,
    revenueBuckets,
    paymentMethodBreakdown,
    dayOfWeekCounts,
    hourOfDayCounts,
    topServices,
    totalServiceRevenueCents,
    topStaff,
    topClientsBySpend,
    inactiveClients: (inactiveClientsRaw ?? []).map((c) => ({ id: c.id, name: c.full_name, lastVisitAt: c.last_visit_at })),
    locations: locations ?? [],
  };
}
