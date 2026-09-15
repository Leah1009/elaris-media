import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";
import {
  PERIODS,
  resolveReportsFilters,
  getReportsData,
  getPreviousPeriodGrossRevenue,
  type ReportsData,
} from "@/lib/luxora/reports-data";
import { BucketBarChart } from "@/components/reports/bucket-bar-chart";
import { BarList } from "@/components/reports/bar-list";

const TABS = ["overview", "revenue", "appointments", "clients", "services", "staff"] as const;
type Tab = (typeof TABS)[number];

const DAY_SHORT_KEYS = [
  "day_sun_short",
  "day_mon_short",
  "day_tue_short",
  "day_wed_short",
  "day_thu_short",
  "day_fri_short",
  "day_sat_short",
] as const;

function KpiCard({ label, value, sub, trendPct }: { label: string; value: string; sub?: string; trendPct?: number | null }) {
  return (
    <div className="rounded-sm border border-border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink/60">{label}</p>
      <p className="mt-1 font-display text-xl text-charcoal">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-ink/60">{sub}</p> : null}
      {trendPct !== undefined && trendPct !== null ? (
        <p className={`mt-0.5 text-xs font-medium ${trendPct >= 0 ? "text-emerald-600" : "text-danger"}`}>
          {trendPct >= 0 ? "+" : ""}
          {trendPct.toFixed(1)}%
        </p>
      ) : null}
    </div>
  );
}

function buildHref(base: Record<string, string | null | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) {
    if (v) qs.set(k, v);
  }
  const s = qs.toString();
  return `/dashboard/reports${s ? `?${s}` : ""}`;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; period?: string; from?: string; to?: string; location?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await getBusinessContext();
  const supabase = await createClient();
  const locale: Locale = ctx.business.preferred_language;
  const tz = ctx.business.timezone;
  const intlLocale = locale === "es" ? "es-ES" : "en-US";
  const tab: Tab = TABS.includes(sp.tab as Tab) ? (sp.tab as Tab) : "overview";

  const { periodStart, periodEnd, filters } = resolveReportsFilters(sp);
  const isCustomRange = filters.periodKey === "custom";

  const data = await getReportsData(supabase, ctx.business.id, tz, intlLocale, {
    periodStart,
    periodEnd,
    locationId: filters.locationId,
  });

  const prevGrossCents =
    tab === "overview"
      ? await getPreviousPeriodGrossRevenue(supabase, ctx.business.id, periodStart, periodEnd, filters.locationId)
      : null;
  const grossTrendPct = prevGrossCents ? ((data.grossRevenueCents - prevGrossCents) / prevGrossCents) * 100 : null;

  const commonParams = {
    period: isCustomRange ? undefined : filters.periodKey,
    from: isCustomRange ? filters.from : undefined,
    to: isCustomRange ? filters.to : undefined,
    location: filters.locationId,
  };
  const exportQs = new URLSearchParams();
  if (isCustomRange) {
    exportQs.set("from", filters.from!);
    exportQs.set("to", filters.to!);
  } else {
    exportQs.set("period", filters.periodKey);
  }
  if (filters.locationId) exportQs.set("location", filters.locationId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{t(locale, "nav_reports")}</h1>
          <p className="mt-1 text-sm text-ink/70">{t(locale, "reports_subtitle")}</p>
        </div>
        <a
          href={`/api/reports/export?${exportQs.toString()}`}
          className="rounded-sm border border-gold-deep px-4 py-2 text-sm font-medium text-gold-deep transition hover:bg-gold-deep hover:text-white"
        >
          {t(locale, "export_csv")}
        </a>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <Link
                key={p.key}
                href={buildHref({ tab, period: p.key, location: filters.locationId })}
                className={`rounded-sm border px-3 py-1.5 text-xs ${
                  !isCustomRange && p.key === filters.periodKey
                    ? "border-gold-deep bg-cream-deep text-charcoal"
                    : "border-border text-charcoal"
                }`}
              >
                {t(locale, `report_period_${p.key}` as Parameters<typeof t>[1])}
              </Link>
            ))}
          </div>

          <form className="flex items-center gap-2 text-sm" action="/dashboard/reports">
            <input type="hidden" name="tab" value={tab} />
            {filters.locationId ? <input type="hidden" name="location" value={filters.locationId} /> : null}
            <input
              type="date"
              name="from"
              defaultValue={isCustomRange ? filters.from! : undefined}
              className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal outline-none focus:border-gold-deep"
            />
            <span className="text-ink/50">–</span>
            <input
              type="date"
              name="to"
              defaultValue={isCustomRange ? filters.to! : undefined}
              className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal outline-none focus:border-gold-deep"
            />
            <button
              type="submit"
              className={`rounded-sm border px-3 py-1.5 text-xs font-medium ${
                isCustomRange ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
              }`}
            >
              {t(locale, "report_period_custom")}
            </button>
          </form>
        </div>

        {data.locations.length > 1 ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink/60">{t(locale, "location_label")}:</span>
            <div className="flex flex-wrap gap-1">
              <Link
                href={buildHref({ tab, ...commonParams, location: null })}
                className={`rounded-sm border px-3 py-1 text-xs ${
                  !filters.locationId ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
                }`}
              >
                {t(locale, "all_locations")}
              </Link>
              {data.locations.map((loc) => (
                <Link
                  key={loc.id}
                  href={buildHref({ tab, ...commonParams, location: loc.id })}
                  className={`rounded-sm border px-3 py-1 text-xs ${
                    filters.locationId === loc.id ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
                  }`}
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((tb) => (
          <Link
            key={tb}
            href={buildHref({ tab: tb, ...commonParams })}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === tb ? "border-gold-deep text-charcoal" : "border-transparent text-ink/60 hover:text-charcoal"
            }`}
          >
            {t(locale, `tab_${tb}`)}
          </Link>
        ))}
      </div>

      {tab === "overview" ? <OverviewTab data={data} locale={locale} grossTrendPct={grossTrendPct} /> : null}
      {tab === "revenue" ? <RevenueTab data={data} locale={locale} /> : null}
      {tab === "appointments" ? <AppointmentsTab data={data} locale={locale} /> : null}
      {tab === "clients" ? <ClientsTab data={data} locale={locale} /> : null}
      {tab === "services" ? <ServicesTab data={data} locale={locale} /> : null}
      {tab === "staff" ? <StaffTab data={data} locale={locale} /> : null}
    </div>
  );
}

function OverviewTab({ data, locale, grossTrendPct }: { data: ReportsData; locale: Locale; grossTrendPct: number | null }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label={t(locale, "kpi_gross_revenue")} value={formatCents(data.grossRevenueCents)} trendPct={grossTrendPct} />
        <KpiCard label={t(locale, "kpi_net_revenue")} value={formatCents(data.netRevenueCents)} />
        <KpiCard label={t(locale, "kpi_appointments")} value={String(data.totalAppointments)} />
        <KpiCard
          label={t(locale, "kpi_avg_ticket")}
          value={formatCents(data.averageTicketCents)}
          sub={`${data.transactionCount} ${t(locale, "kpi_transactions")}`}
        />
        <KpiCard label={t(locale, "kpi_new_clients")} value={String(data.newClientCount)} />
        <KpiCard label={t(locale, "kpi_returning_clients")} value={String(data.returningClientCount)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-sm border border-border bg-white p-5">
          <h2 className="font-display text-lg text-charcoal">{t(locale, "revenue_overview_title")}</h2>
          <div className="mt-4">
            <BucketBarChart
              buckets={data.revenueBuckets}
              grossLabel={t(locale, "chart_gross")}
              netLabel={t(locale, "chart_net")}
              emptyLabel={t(locale, "no_revenue_data")}
            />
          </div>
        </section>

        <section className="rounded-sm border border-border bg-white p-5">
          <h2 className="font-display text-lg text-charcoal">{t(locale, "appointments_overview_title")}</h2>
          <div className="mt-4">
            <BarList
              emptyLabel={t(locale, "no_appointments_data")}
              rows={[
                { label: t(locale, "appt_total"), value: data.totalAppointments, display: String(data.totalAppointments) },
                {
                  label: t(locale, "appt_completed"),
                  value: data.statusCounts.completed ?? 0,
                  display: String(data.statusCounts.completed ?? 0),
                },
                {
                  label: t(locale, "appt_cancelled"),
                  value: data.statusCounts.cancelled ?? 0,
                  display: String(data.statusCounts.cancelled ?? 0),
                },
                {
                  label: t(locale, "appt_no_show"),
                  value: data.statusCounts.no_show ?? 0,
                  display: String(data.statusCounts.no_show ?? 0),
                },
                {
                  label: t(locale, "appt_pending"),
                  value: data.statusCounts.pending ?? 0,
                  display: String(data.statusCounts.pending ?? 0),
                },
              ]}
            />
            <p className="mt-3 text-xs text-ink/60">
              {t(locale, "cancellation_rate_label")}: <span className="font-medium text-charcoal">{data.cancellationRate}%</span>
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "clients_overview_title")}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "kpi_new_clients")}</p>
            <p className="mt-1 font-display text-xl text-charcoal">{data.newClientCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "kpi_returning_clients")}</p>
            <p className="mt-1 font-display text-xl text-charcoal">{data.returningClientCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "kpi_clients_served")}</p>
            <p className="mt-1 font-display text-xl text-charcoal">{data.clientsServedCount}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopServicesTable data={data} locale={locale} limit={5} showLink />
        <TopStaffTable data={data} locale={locale} limit={5} showLink />
      </div>
    </div>
  );
}

function RevenueTab({ data, locale }: { data: ReportsData; locale: Locale }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <KpiCard label={t(locale, "kpi_gross_revenue")} value={formatCents(data.grossRevenueCents)} />
        <KpiCard label={t(locale, "kpi_refunds")} value={formatCents(data.refundedCents)} />
        <KpiCard label={t(locale, "kpi_net_revenue")} value={formatCents(data.netRevenueCents)} />
        <KpiCard label={t(locale, "kpi_deposits_collected")} value={formatCents(data.depositsCollectedCents)} />
        <KpiCard
          label={t(locale, "kpi_avg_ticket")}
          value={formatCents(data.averageTicketCents)}
          sub={`${data.transactionCount} ${t(locale, "kpi_transactions")}`}
        />
      </div>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "revenue_overview_title")}</h2>
        <div className="mt-4">
          <BucketBarChart
            buckets={data.revenueBuckets}
            grossLabel={t(locale, "chart_gross")}
            netLabel={t(locale, "chart_net")}
            emptyLabel={t(locale, "no_revenue_data")}
          />
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "payment_method_breakdown_title")}</h2>
        <div className="mt-4">
          <BarList
            emptyLabel={t(locale, "no_revenue_data")}
            rows={data.paymentMethodBreakdown.map((m) => ({
              label: m.label,
              value: m.cents,
              display: formatCents(m.cents),
            }))}
          />
        </div>
      </section>
    </div>
  );
}

function AppointmentsTab({ data, locale }: { data: ReportsData; locale: Locale }) {
  const maxHour = Math.max(1, ...data.hourOfDayCounts.map((h) => h.count));
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <KpiCard label={t(locale, "appt_total")} value={String(data.totalAppointments)} />
        <KpiCard label={t(locale, "appt_completed")} value={String(data.statusCounts.completed ?? 0)} />
        <KpiCard label={t(locale, "appt_cancelled")} value={String(data.statusCounts.cancelled ?? 0)} />
        <KpiCard label={t(locale, "appt_no_show")} value={String(data.statusCounts.no_show ?? 0)} />
        <KpiCard label={t(locale, "appt_pending")} value={String(data.statusCounts.pending ?? 0)} />
      </div>
      <p className="text-sm text-ink/70">
        {t(locale, "cancellation_rate_label")}: <span className="font-medium text-charcoal">{data.cancellationRate}%</span>
      </p>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "appointments_by_day_title")}</h2>
        <div className="mt-4">
          <BarList
            emptyLabel={t(locale, "no_appointments_data")}
            rows={DAY_SHORT_KEYS.map((key, i) => ({
              label: t(locale, key),
              value: data.dayOfWeekCounts[i],
              display: String(data.dayOfWeekCounts[i]),
            }))}
          />
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "appointments_by_time_title")}</h2>
        {data.hourOfDayCounts.length === 0 ? (
          <p className="mt-4 py-6 text-center text-sm text-ink/50">{t(locale, "no_appointments_data")}</p>
        ) : (
          <div className="mt-4 flex h-32 items-end gap-1">
            {data.hourOfDayCounts.map((h) => (
              <div
                key={h.hour}
                className="group relative flex-1"
                title={`${h.hour}:00 · ${h.count}`}
              >
                <div
                  className="mx-auto w-full rounded-t-sm bg-gold-deep/80 transition group-hover:bg-gold-deep"
                  style={{ height: `${Math.max(4, Math.round((h.count / maxHour) * 100))}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ClientsTab({ data, locale }: { data: ReportsData; locale: Locale }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label={t(locale, "kpi_new_clients")} value={String(data.newClientCount)} />
        <KpiCard label={t(locale, "kpi_returning_clients")} value={String(data.returningClientCount)} />
        <KpiCard label={t(locale, "kpi_clients_served")} value={String(data.clientsServedCount)} />
      </div>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "new_vs_returning_title")}</h2>
        <div className="mt-4">
          <BarList
            emptyLabel={t(locale, "no_client_data")}
            rows={[
              { label: t(locale, "kpi_new_clients"), value: data.newClientCount, display: String(data.newClientCount) },
              {
                label: t(locale, "kpi_returning_clients"),
                value: data.returningClientCount,
                display: String(data.returningClientCount),
              },
            ]}
          />
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white">
        <h2 className="p-5 pb-0 font-display text-lg text-charcoal">{t(locale, "top_clients_by_spend_title")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-5 py-3">{t(locale, "report_col_client")}</th>
                <th className="px-5 py-3">{t(locale, "report_col_visits")}</th>
                <th className="px-5 py-3">{t(locale, "report_col_revenue")}</th>
              </tr>
            </thead>
            <tbody>
              {data.topClientsBySpend.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-charcoal">{c.name}</td>
                  <td className="px-5 py-3 text-ink">{c.visitCount}</td>
                  <td className="px-5 py-3 text-ink">{formatCents(c.cents)}</td>
                </tr>
              ))}
              {data.topClientsBySpend.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-3 text-ink/60">
                    {t(locale, "no_client_data")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white">
        <h2 className="p-5 pb-0 font-display text-lg text-charcoal">{t(locale, "inactive_clients_title")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-5 py-3">{t(locale, "report_col_client")}</th>
                <th className="px-5 py-3">{t(locale, "report_col_last_visit")}</th>
              </tr>
            </thead>
            <tbody>
              {data.inactiveClients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-charcoal">{c.name}</td>
                  <td className="px-5 py-3 text-ink">{c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString(intlFor(locale)) : "—"}</td>
                </tr>
              ))}
              {data.inactiveClients.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-3 text-ink/60">
                    {t(locale, "no_client_data")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ServicesTab({ data, locale }: { data: ReportsData; locale: Locale }) {
  return (
    <div className="flex flex-col gap-6">
      <TopServicesTable data={data} locale={locale} />
    </div>
  );
}

function StaffTab({ data, locale }: { data: ReportsData; locale: Locale }) {
  return (
    <div className="flex flex-col gap-6">
      <TopStaffTable data={data} locale={locale} />
    </div>
  );
}

function TopServicesTable({
  data,
  locale,
  limit,
  showLink,
}: {
  data: ReportsData;
  locale: Locale;
  limit?: number;
  showLink?: boolean;
}) {
  const totalRevenue = data.totalServiceRevenueCents;
  const rows = limit ? data.topServices.slice(0, limit) : data.topServices;
  return (
    <section className="rounded-sm border border-border bg-white">
      <h2 className="p-5 pb-0 font-display text-lg text-charcoal">{t(locale, "top_services_title")}</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
              <th className="px-5 py-3">{t(locale, "report_col_service")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_appointments")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_revenue")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_pct_revenue")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-charcoal">{s.name}</td>
                <td className="px-5 py-3 text-ink">{s.count}</td>
                <td className="px-5 py-3 text-ink">{formatCents(s.cents)}</td>
                <td className="px-5 py-3 text-ink">{totalRevenue > 0 ? `${Math.round((s.cents / totalRevenue) * 100)}%` : "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-3 text-ink/60">
                  {t(locale, "no_service_data")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showLink ? (
        <div className="p-5 pt-3">
          <Link href="/dashboard/reports?tab=services" className="text-xs font-medium text-gold-deep underline underline-offset-2">
            {t(locale, "view_services_report")}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function TopStaffTable({
  data,
  locale,
  limit,
  showLink,
}: {
  data: ReportsData;
  locale: Locale;
  limit?: number;
  showLink?: boolean;
}) {
  const rows = limit ? data.topStaff.slice(0, limit) : data.topStaff;
  return (
    <section className="rounded-sm border border-border bg-white">
      <h2 className="p-5 pb-0 font-display text-lg text-charcoal">{t(locale, "top_staff_title")}</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
              <th className="px-5 py-3">{t(locale, "report_col_staff")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_appointments")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_revenue")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_avg_ticket")}</th>
              <th className="px-5 py-3">{t(locale, "report_col_tips")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-charcoal">{s.name}</td>
                <td className="px-5 py-3 text-ink">{s.count}</td>
                <td className="px-5 py-3 text-ink">{formatCents(s.cents)}</td>
                <td className="px-5 py-3 text-ink">{formatCents(s.averageTicketCents)}</td>
                <td className="px-5 py-3 text-ink">{formatCents(s.tipsCents)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-3 text-ink/60">
                  {t(locale, "no_staff_data")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showLink ? (
        <div className="p-5 pt-3">
          <Link href="/dashboard/reports?tab=staff" className="text-xs font-medium text-gold-deep underline underline-offset-2">
            {t(locale, "view_staff_report")}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function intlFor(locale: Locale): string {
  return locale === "es" ? "es-ES" : "en-US";
}
