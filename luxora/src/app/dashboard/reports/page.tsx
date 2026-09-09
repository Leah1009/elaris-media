import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";

const PERIODS = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "365", label: "1 year", days: 365 },
  { key: "all", label: "All time", days: null },
];

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-sm border border-border bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-ink/60">{label}</p>
      <p className="mt-1 font-display text-2xl text-charcoal">{value}</p>
      {sub ? <p className="mt-1 text-xs text-ink/60">{sub}</p> : null}
    </div>
  );
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period = PERIODS.find((p) => p.key === periodParam) ?? PERIODS[1];
  const periodStart = period.days ? new Date(new Date().getTime() - period.days * 86_400_000).toISOString() : null;

  const ctx = await getBusinessContext();
  const supabase = await createClient();

  let paymentsQuery = supabase
    .from("payments")
    .select("id, total_cents, status, method, created_at, appointment_id, client_id")
    .eq("business_id", ctx.business.id)
    .in("status", ["succeeded", "refunded", "partially_refunded"]);
  if (periodStart) paymentsQuery = paymentsQuery.gte("created_at", periodStart);

  let refundsQuery = supabase
    .from("refunds")
    .select("amount_cents, payment_id")
    .eq("business_id", ctx.business.id);
  if (periodStart) refundsQuery = refundsQuery.gte("created_at", periodStart);

  let appointmentsQuery = supabase
    .from("appointments")
    .select("id, staff_id, status, start_at, client_id, staff:staff_id(full_name)")
    .eq("business_id", ctx.business.id);
  if (periodStart) appointmentsQuery = appointmentsQuery.gte("start_at", periodStart);

  let newClientsQuery = supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("business_id", ctx.business.id);
  if (periodStart) newClientsQuery = newClientsQuery.gte("first_visit_at", periodStart);

  const [{ data: payments }, { data: refunds }, { data: appointments }, { count: newClientCount }] =
    await Promise.all([paymentsQuery, refundsQuery, appointmentsQuery, newClientsQuery]);

  const appointmentIds = (appointments ?? []).map((a) => a.id);
  const { data: appointmentServices } = appointmentIds.length
    ? await supabase
        .from("appointment_services")
        .select("service_id, price_cents, appointment_id, service:service_id(name)")
        .in("appointment_id", appointmentIds)
    : { data: [] };

  const grossRevenueCents = (payments ?? []).reduce((sum, p) => sum + p.total_cents, 0);
  const refundedCents = (refunds ?? []).reduce((sum, r) => sum + r.amount_cents, 0);
  const netRevenueCents = grossRevenueCents - refundedCents;
  const transactionCount = payments?.length ?? 0;
  const averageTicketCents = transactionCount > 0 ? Math.round(grossRevenueCents / transactionCount) : 0;

  const statusCounts = new Map<string, number>();
  for (const a of appointments ?? []) {
    statusCounts.set(a.status, (statusCounts.get(a.status) ?? 0) + 1);
  }

  const staffRevenue = new Map<string, { name: string; cents: number; count: number }>();
  const appointmentById = new Map((appointments ?? []).map((a) => [a.id, a]));
  for (const p of payments ?? []) {
    if (!p.appointment_id) continue;
    const appt = appointmentById.get(p.appointment_id);
    if (!appt?.staff_id) continue;
    const key = appt.staff_id;
    const existing = staffRevenue.get(key) ?? { name: appt.staff?.full_name ?? "Staff", cents: 0, count: 0 };
    existing.cents += p.total_cents;
    existing.count += 1;
    staffRevenue.set(key, existing);
  }
  const topStaff = [...staffRevenue.values()].sort((a, b) => b.cents - a.cents).slice(0, 5);

  const serviceRevenue = new Map<string, { name: string; cents: number; count: number }>();
  for (const row of appointmentServices ?? []) {
    const appt = appointmentById.get(row.appointment_id);
    if (appt?.status !== "completed") continue;
    const key = row.service_id;
    const existing = serviceRevenue.get(key) ?? { name: row.service?.name ?? "Service", cents: 0, count: 0 };
    existing.cents += row.price_cents;
    existing.count += 1;
    serviceRevenue.set(key, existing);
  }
  const topServices = [...serviceRevenue.values()].sort((a, b) => b.cents - a.cents).slice(0, 5);

  const distinctClientIds = new Set((appointments ?? []).filter((a) => a.status === "completed").map((a) => a.client_id));
  const returningClientCount = Math.max(0, distinctClientIds.size - (newClientCount ?? 0));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Reports</h1>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <Link
              key={p.key}
              href={`/dashboard/reports?period=${p.key}`}
              className={`rounded-sm border px-3 py-1.5 text-xs ${
                p.key === period.key ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Gross Revenue" value={formatCents(grossRevenueCents)} />
        <StatCard label="Refunds" value={formatCents(refundedCents)} />
        <StatCard label="Net Revenue" value={formatCents(netRevenueCents)} />
        <StatCard label="Avg Ticket" value={formatCents(averageTicketCents)} sub={`${transactionCount} transactions`} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="New Clients" value={String(newClientCount ?? 0)} />
        <StatCard label="Returning Clients" value={String(returningClientCount)} />
        <StatCard label="Completed" value={String(statusCounts.get("completed") ?? 0)} />
        <StatCard label="No-Shows" value={String(statusCounts.get("no_show") ?? 0)} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section>
          <h2 className="font-display text-lg text-charcoal">Top Services</h2>
          <div className="mt-3 overflow-x-auto rounded-sm border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Count</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((s, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-charcoal">{s.name}</td>
                    <td className="px-4 py-3 text-ink">{s.count}</td>
                    <td className="px-4 py-3 text-ink">{formatCents(s.cents)}</td>
                  </tr>
                ))}
                {topServices.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-ink/60">
                      No completed appointments in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg text-charcoal">Top Staff</h2>
          <div className="mt-3 overflow-x-auto rounded-sm border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Payments</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topStaff.map((s, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-charcoal">{s.name}</td>
                    <td className="px-4 py-3 text-ink">{s.count}</td>
                    <td className="px-4 py-3 text-ink">{formatCents(s.cents)}</td>
                  </tr>
                ))}
                {topStaff.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-ink/60">
                      No payments tied to staff in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
