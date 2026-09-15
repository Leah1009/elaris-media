import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext, getActiveLocations } from "@/lib/luxora/business-context";
import { addDays } from "@/lib/luxora/calendar";
import { zonedTimeToUtc, formatInTimeZone, dateStrInTimeZone } from "@/lib/luxora/timezone";
import { formatCents } from "@/lib/luxora/money";
import { t, type Locale, type TranslationKey } from "@/lib/luxora/i18n";
import { QuickActionsPanel } from "@/components/quick-actions-panel";
import { RevenueChart, type RevenueDay } from "@/components/revenue-chart";
import { ReferralCard } from "@/components/referral-card";

const STATUS_LABEL_KEYS: Record<string, TranslationKey> = {
  pending: "status_pending",
  confirmed: "status_confirmed",
  completed: "status_completed",
  cancelled: "status_cancelled",
  no_show: "status_no_show",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: "bg-gold/15 text-gold-deep",
  confirmed: "bg-emerald-500/10 text-emerald-700",
  completed: "bg-charcoal/10 text-charcoal",
  cancelled: "bg-danger/10 text-danger",
  no_show: "bg-danger/10 text-danger",
};

function greetingKey(hour: number): TranslationKey {
  if (hour < 12) return "greeting_morning";
  if (hour < 18) return "greeting_afternoon";
  return "greeting_evening";
}

function localizedDateLabel(date: Date, tz: string, lang: Locale): string {
  return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function KpiCard({ label, value, sub, href }: { label: string; value: string; sub?: string; href?: string }) {
  const inner = (
    <div className="rounded-sm border border-border bg-white p-4 transition hover:border-gold-deep">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1.5 font-display text-2xl text-charcoal">{value}</p>
      {sub ? <p className="mt-1 text-xs text-ink/50">{sub}</p> : null}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function SnapshotStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <p className="text-sm text-ink/70">{label}</p>
      <p className="text-sm font-medium text-charcoal">{value}</p>
    </div>
  );
}

function AttentionRow({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 border-b border-border py-2.5 text-sm last:border-0"
    >
      <span className="text-charcoal">{label}</span>
      <span aria-hidden className="text-ink/40">
        →
      </span>
    </Link>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ revenuePeriod?: string }>;
}) {
  const { revenuePeriod } = await searchParams;
  const periodDays = revenuePeriod === "30" ? 30 : 7;

  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;

  if (ctx.access.isLocked) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-2xl text-charcoal">{t(lang, "trial_ended_title")}</h1>
        <p className="mt-3 text-sm text-ink">{t(lang, "trial_ended_body")}</p>
        <Link
          href="/dashboard/settings/subscription"
          className="mt-6 inline-block rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
        >
          {t(lang, "view_plans")}
        </Link>
      </div>
    );
  }

  const tz = ctx.business.timezone;
  const now = new Date();
  const today = dateStrInTimeZone(now, tz);
  const todayStart = zonedTimeToUtc(today, "00:00", tz);
  const todayEnd = zonedTimeToUtc(addDays(today, 1), "00:00", tz);
  const periodStartDate = addDays(today, -(periodDays - 1));
  const periodStartAt = zonedTimeToUtc(periodStartDate, "00:00", tz);
  const failedPaymentsSince = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const supabase = await createClient();

  const [
    { data: profile },
    { data: todaysAppointments },
    { count: newClientsToday },
    { data: todayPayments },
    { data: todayRefunds },
    { data: periodPayments },
    { data: periodAppointments },
    { count: periodNewClients },
    { data: staffRows },
    locations,
    { count: pendingConfirmations },
    { data: stockLevels },
    { count: waitlistCount },
    { count: failedPaymentsCount },
    { data: recentPayments },
    { data: recentClients },
    { data: recentAppointments },
    { data: recentFormSubmissions },
  ] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", ctx.userId).maybeSingle(),
    supabase
      .from("appointments")
      .select(
        "id, start_at, end_at, status, client:client_id(full_name), staff:staff_id(full_name), appointment_services(price_cents, service:service_id(name))",
      )
      .eq("business_id", ctx.business.id)
      .gte("start_at", todayStart.toISOString())
      .lt("start_at", todayEnd.toISOString())
      .neq("status", "cancelled")
      .order("start_at"),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("business_id", ctx.business.id)
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", todayEnd.toISOString()),
    supabase
      .from("payments")
      .select("total_cents")
      .eq("business_id", ctx.business.id)
      .in("status", ["succeeded", "refunded", "partially_refunded"])
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", todayEnd.toISOString()),
    supabase
      .from("refunds")
      .select("amount_cents")
      .eq("business_id", ctx.business.id)
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", todayEnd.toISOString()),
    supabase
      .from("payments")
      .select("total_cents, created_at")
      .eq("business_id", ctx.business.id)
      .in("status", ["succeeded", "refunded", "partially_refunded"])
      .gte("created_at", periodStartAt.toISOString()),
    supabase
      .from("appointments")
      .select("id, status, client_id, created_at")
      .eq("business_id", ctx.business.id)
      .gte("created_at", periodStartAt.toISOString()),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("business_id", ctx.business.id)
      .gte("created_at", periodStartAt.toISOString()),
    supabase.from("staff").select("id, full_name").eq("business_id", ctx.business.id).eq("active", true).order("full_name"),
    getActiveLocations(ctx.business.id),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("business_id", ctx.business.id)
      .eq("status", "pending")
      .gte("start_at", todayStart.toISOString()),
    supabase
      .from("products")
      .select("quantity_on_hand, reorder_threshold")
      .eq("business_id", ctx.business.id)
      .eq("active", true),
    supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("business_id", ctx.business.id)
      .eq("status", "waiting"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("business_id", ctx.business.id)
      .eq("status", "failed")
      .gte("created_at", failedPaymentsSince),
    supabase
      .from("payments")
      .select("id, total_cents, created_at, client:client_id(full_name)")
      .eq("business_id", ctx.business.id)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("clients")
      .select("id, full_name, created_at")
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("appointments")
      .select("id, created_at, client:client_id(full_name)")
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("form_submissions")
      .select("id, submitted_at, client:client_id(full_name), form:form_id(name)")
      .eq("business_id", ctx.business.id)
      .order("submitted_at", { ascending: false })
      .limit(5),
  ]);

  // --- Greeting ---
  const firstName = profile?.full_name?.split(" ")[0] ?? "";
  const localHour = Number(formatInTimeZone(now, tz, { hour: "numeric", hourCycle: "h23" }));

  // --- KPIs ---
  const expectedRevenueCents = (todaysAppointments ?? []).reduce((sum, appt) => {
    const services = (appt.appointment_services as unknown as { price_cents: number }[]) ?? [];
    return sum + services.reduce((s, svc) => s + svc.price_cents, 0);
  }, 0);
  const grossCollectedTodayCents = (todayPayments ?? []).reduce((sum, p) => sum + p.total_cents, 0);
  const refundedTodayCents = (todayRefunds ?? []).reduce((sum, r) => sum + r.amount_cents, 0);
  const collectedTodayCents = grossCollectedTodayCents - refundedTodayCents;

  // --- Revenue Overview (bucketed per day in the selected period, business timezone) ---
  const revenueByDay = new Map<string, number>();
  for (let i = 0; i < periodDays; i++) revenueByDay.set(addDays(periodStartDate, i), 0);
  for (const p of periodPayments ?? []) {
    const dayKey = dateStrInTimeZone(new Date(p.created_at), tz);
    if (revenueByDay.has(dayKey)) revenueByDay.set(dayKey, (revenueByDay.get(dayKey) ?? 0) + p.total_cents);
  }
  const revenueDays: RevenueDay[] = [...revenueByDay.entries()].map(([dateStr, cents]) => ({
    dateStr,
    cents,
    label: new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
      new Date(`${dateStr}T00:00:00Z`),
    ),
  }));
  const hasRevenueData = (periodPayments ?? []).length > 0;

  // --- Business Snapshot (same period as Revenue Overview) ---
  const statusCounts = new Map<string, number>();
  for (const a of periodAppointments ?? []) statusCounts.set(a.status, (statusCounts.get(a.status) ?? 0) + 1);
  const completedClientIds = new Set((periodAppointments ?? []).filter((a) => a.status === "completed").map((a) => a.client_id));
  const returningClientCount = Math.max(0, completedClientIds.size - (periodNewClients ?? 0));
  const periodGrossCents = (periodPayments ?? []).reduce((sum, p) => sum + p.total_cents, 0);
  const periodTransactionCount = periodPayments?.length ?? 0;
  const averageTicketCents = periodTransactionCount > 0 ? Math.round(periodGrossCents / periodTransactionCount) : 0;

  // --- Needs Attention ---
  const lowStockCount = (stockLevels ?? []).filter((p) => p.quantity_on_hand <= p.reorder_threshold).length;
  const attentionItems: { key: string; label: string; href: string }[] = [];
  if ((pendingConfirmations ?? 0) > 0) {
    attentionItems.push({
      key: "confirmations",
      label: `${pendingConfirmations} ${t(lang, "attention_pending_confirmations_suffix")}`,
      href: "/dashboard/calendar?status=pending",
    });
  }
  if ((lowStockCount ?? 0) > 0) {
    attentionItems.push({
      key: "low-stock",
      label: `${lowStockCount} ${t(lang, "attention_low_stock_suffix")}`,
      href: "/dashboard/products",
    });
  }
  if ((waitlistCount ?? 0) > 0) {
    attentionItems.push({
      key: "waitlist",
      label: `${waitlistCount} ${t(lang, "attention_waitlist_suffix")}`,
      href: "/dashboard/waitlist",
    });
  }
  if ((failedPaymentsCount ?? 0) > 0) {
    attentionItems.push({
      key: "failed-payments",
      label: `${failedPaymentsCount} ${t(lang, "attention_failed_payments_suffix")}`,
      href: "/dashboard/payments",
    });
  }
  if (ctx.access.subscriptionStatus === "past_due") {
    attentionItems.push({
      key: "subscription",
      label: t(lang, "attention_subscription_issue"),
      href: "/dashboard/settings/subscription",
    });
  }

  // --- Recent Activity (merged from real, already-existing tables — no dedicated activity log exists yet) ---
  type ActivityItem = { key: string; at: string; label: string };
  const activity: ActivityItem[] = [
    ...(recentPayments ?? []).map((p) => ({
      key: `payment-${p.id}`,
      at: p.created_at,
      label: `${t(lang, "activity_payment_received")} — ${formatCents(p.total_cents)}${
        (p.client as unknown as { full_name: string } | null)?.full_name
          ? ` (${(p.client as unknown as { full_name: string }).full_name})`
          : ""
      }`,
    })),
    ...(recentClients ?? []).map((c) => ({
      key: `client-${c.id}`,
      at: c.created_at,
      label: `${t(lang, "activity_new_client")} — ${c.full_name}`,
    })),
    ...(recentAppointments ?? []).map((a) => ({
      key: `appointment-${a.id}`,
      at: a.created_at,
      label: `${t(lang, "activity_appointment_booked")}${
        (a.client as unknown as { full_name: string } | null)?.full_name
          ? ` — ${(a.client as unknown as { full_name: string }).full_name}`
          : ""
      }`,
    })),
    ...(recentFormSubmissions ?? []).map((f) => ({
      key: `form-${f.id}`,
      at: f.submitted_at,
      label: `${t(lang, "activity_form_completed")}${
        (f.form as unknown as { name: string } | null)?.name ? ` — ${(f.form as unknown as { name: string }).name}` : ""
      }${(f.client as unknown as { full_name: string } | null)?.full_name ? ` (${(f.client as unknown as { full_name: string }).full_name})` : ""}`,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  const { data: referralSettings } = await supabase
    .from("referral_program_settings")
    .select("program_active, reward_amount_cents")
    .eq("id", true)
    .maybeSingle();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">
            {t(lang, greetingKey(localHour))}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-ink">
            {t(lang, "whats_happening_at")} {ctx.business.name} {t(lang, "today_period")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-ink/60">{localizedDateLabel(now, tz, lang)}</p>
          <Link
            href={`/dashboard/calendar/new?date=${today}`}
            className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
          >
            + {t(lang, "new_appointment")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label={t(lang, "todays_appointments")}
          value={String(todaysAppointments?.length ?? 0)}
          href="/dashboard/calendar"
        />
        <KpiCard label={t(lang, "kpi_expected_revenue")} value={formatCents(expectedRevenueCents)} sub={t(lang, "scheduled_value_note")} />
        <KpiCard label={t(lang, "kpi_collected_today")} value={formatCents(collectedTodayCents)} href="/dashboard/payments" />
        <KpiCard label={t(lang, "new_clients_today")} value={String(newClientsToday ?? 0)} href="/dashboard/clients" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-border bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal">{t(lang, "todays_schedule")}</h2>
            <Link href="/dashboard/calendar" className="text-sm font-medium text-gold-deep underline underline-offset-2">
              {t(lang, "view_calendar")}
            </Link>
          </div>
          {todaysAppointments && todaysAppointments.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-1">
              {todaysAppointments.map((a) => {
                const client = a.client as unknown as { full_name: string } | null;
                const staff = a.staff as unknown as { full_name: string } | null;
                const services = (a.appointment_services as unknown as { service: { name: string } | null }[]) ?? [];
                const serviceNames = services.map((s) => s.service?.name).filter(Boolean).join(", ");
                return (
                  <li key={a.id}>
                    <Link
                      href={`/dashboard/calendar?date=${today}&view=day`}
                      className="flex items-center justify-between gap-3 border-b border-border py-3 text-sm transition hover:bg-cream-deep last:border-0"
                    >
                      <span className="w-20 shrink-0 font-medium text-charcoal">
                        {formatInTimeZone(new Date(a.start_at), tz, { hour: "numeric", minute: "2-digit" })}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-charcoal">{client?.full_name ?? t(lang, "col_name")}</span>
                        <span className="block truncate text-xs text-ink/60">
                          {serviceNames}
                          {staff?.full_name ? ` · ${staff.full_name}` : ""}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                          STATUS_BADGE_CLASSES[a.status] ?? "bg-cream-deep text-charcoal"
                        }`}
                      >
                        {t(lang, STATUS_LABEL_KEYS[a.status] ?? "status_pending")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
              <p className="text-sm text-ink">{t(lang, "no_appointments_today")}</p>
              <Link
                href={`/dashboard/calendar/new?date=${today}`}
                className="rounded-sm bg-charcoal px-4 py-2 text-sm font-medium text-white transition hover:bg-charcoal-soft"
              >
                + {t(lang, "new_appointment")}
              </Link>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg text-charcoal">{t(lang, "quick_actions_title")}</h2>
          <div className="mt-4">
            <QuickActionsPanel lang={lang} todayDate={today} staff={staffRows ?? []} locations={locations} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-border bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-charcoal">{t(lang, "revenue_overview_title")}</h2>
            <div className="flex rounded-sm border border-border">
              {[7, 30].map((d) => (
                <Link
                  key={d}
                  href={`/dashboard?revenuePeriod=${d}`}
                  className={`px-3 py-1.5 text-xs font-medium transition ${
                    periodDays === d ? "bg-charcoal text-white" : "text-charcoal hover:bg-cream-deep"
                  }`}
                >
                  {t(lang, d === 7 ? "period_7_days" : "period_30_days")}
                </Link>
              ))}
            </div>
          </div>
          {hasRevenueData ? (
            <div className="mt-6">
              <RevenueChart days={revenueDays} />
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-1 py-10 text-center">
              <p className="text-sm font-medium text-charcoal">{t(lang, "no_revenue_data_title")}</p>
              <p className="text-sm text-ink/60">{t(lang, "no_revenue_data_body")}</p>
            </div>
          )}
        </div>

        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">{t(lang, "business_snapshot_title")}</h2>
          <div className="mt-3 flex flex-col">
            <SnapshotStat label={t(lang, "snapshot_completed_appointments")} value={String(statusCounts.get("completed") ?? 0)} />
            <SnapshotStat label={t(lang, "snapshot_cancelled_appointments")} value={String(statusCounts.get("cancelled") ?? 0)} />
            <SnapshotStat label={t(lang, "snapshot_no_shows")} value={String(statusCounts.get("no_show") ?? 0)} />
            <SnapshotStat label={t(lang, "snapshot_returning_clients")} value={String(returningClientCount)} />
            <SnapshotStat label={t(lang, "snapshot_average_ticket")} value={formatCents(averageTicketCents)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">{t(lang, "needs_attention_title")}</h2>
          {attentionItems.length > 0 ? (
            <div className="mt-3 flex flex-col">
              {attentionItems.map((item) => (
                <AttentionRow key={item.key} label={item.label} href={item.href} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/60">{t(lang, "all_caught_up")}</p>
          )}
        </div>

        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">{t(lang, "recent_activity_title")}</h2>
          {activity.length > 0 ? (
            <ul className="mt-3 flex flex-col">
              {activity.map((item) => (
                <li key={item.key} className="flex items-center justify-between gap-3 border-b border-border py-2.5 text-sm last:border-0">
                  <span className="truncate text-charcoal">{item.label}</span>
                  <span className="shrink-0 text-xs text-ink/50">
                    {formatInTimeZone(new Date(item.at), tz, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink/60">{t(lang, "no_recent_activity")}</p>
          )}
        </div>
      </div>

      {referralSettings?.program_active ? (
        <ReferralCard locale={lang} rewardAmountCents={referralSettings.reward_amount_cents} />
      ) : null}
    </div>
  );
}
