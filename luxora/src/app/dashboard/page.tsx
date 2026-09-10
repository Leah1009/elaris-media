import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";
import { todayDateStr, addDays } from "@/lib/luxora/calendar";
import { zonedTimeToUtc, formatInTimeZone } from "@/lib/luxora/timezone";
import { formatCents } from "@/lib/luxora/money";
import { t } from "@/lib/luxora/i18n";

export default async function DashboardPage() {
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

  const remaining = daysRemaining(ctx.access.trialEndsAt);
  const tz = ctx.business.timezone;
  const today = todayDateStr();
  const todayStart = zonedTimeToUtc(today, "00:00", tz);
  const todayEnd = zonedTimeToUtc(addDays(today, 1), "00:00", tz);

  const supabase = await createClient();

  const { data: todaysAppointments } = await supabase
    .from("appointments")
    .select("id, start_at, status, client:client_id(full_name), appointment_services(price_cents)")
    .eq("business_id", ctx.business.id)
    .gte("start_at", todayStart.toISOString())
    .lt("start_at", todayEnd.toISOString())
    .neq("status", "cancelled")
    .order("start_at");

  const { count: newClientsCount } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("business_id", ctx.business.id)
    .gte("created_at", todayStart.toISOString())
    .lt("created_at", todayEnd.toISOString());

  const expectedRevenueCents = (todaysAppointments ?? []).reduce((sum, appt) => {
    const services = (appt.appointment_services as unknown as { price_cents: number }[]) ?? [];
    return sum + services.reduce((s, svc) => s + svc.price_cents, 0);
  }, 0);

  const completedCount = (todaysAppointments ?? []).filter((a) => a.status === "completed").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">
          {t(lang, "welcome")} {ctx.business.name}
        </h1>
        <p className="mt-1 text-sm text-ink">
          {remaining > 0
            ? `${remaining} ${t(lang, "trial_days_left")}`
            : t(lang, "trial_ended_inline")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/60">{t(lang, "todays_appointments")}</p>
          <p className="mt-2 font-display text-3xl text-charcoal">{todaysAppointments?.length ?? 0}</p>
          <p className="mt-1 text-xs text-ink/60">
            {completedCount} {t(lang, "completed")}
          </p>
        </div>
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/60">{t(lang, "todays_expected_revenue")}</p>
          <p className="mt-2 font-display text-3xl text-charcoal">{formatCents(expectedRevenueCents)}</p>
          <p className="mt-1 text-xs text-ink/60">{t(lang, "scheduled_value_note")}</p>
        </div>
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/60">{t(lang, "new_clients_today")}</p>
          <p className="mt-2 font-display text-3xl text-charcoal">{newClientsCount ?? 0}</p>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-charcoal">{t(lang, "todays_schedule")}</h2>
          <Link href="/dashboard/calendar" className="text-sm font-medium text-gold-deep underline underline-offset-2">
            {t(lang, "view_calendar")}
          </Link>
        </div>
        {todaysAppointments && todaysAppointments.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {todaysAppointments.map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-charcoal">
                  {formatInTimeZone(new Date(a.start_at), tz, { hour: "numeric", minute: "2-digit" })}
                </span>
                <span className="text-ink">
                  {(a.client as unknown as { full_name: string } | null)?.full_name}
                </span>
                <span className="capitalize text-ink/60">{a.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-ink">{t(lang, "no_appointments_today")}</p>
        )}
      </div>
    </div>
  );
}
