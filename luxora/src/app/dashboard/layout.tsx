import Link from "next/link";
import { getBusinessContext, getActiveLocations, daysRemaining } from "@/lib/luxora/business-context";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import { LocationQuickSwitch } from "@/components/location-quick-switch";
import { BackButton } from "@/components/back-button";
import { logout } from "@/lib/luxora/actions";
import { t } from "@/lib/luxora/i18n";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const remaining = daysRemaining(ctx.access.trialEndsAt);
  const showTrialBanner = ctx.access.subscriptionStatus === "trialing" && !ctx.access.isLocked;
  const trialUrgent = remaining <= 7;

  const supabase = await createClient();
  const [{ data: isPlatformAdmin }, locations] = await Promise.all([
    supabase.rpc("is_platform_admin"),
    getActiveLocations(ctx.business.id),
  ]);

  const primaryLocation = locations?.find((l) => l.is_primary) ?? locations?.[0] ?? null;
  const hasMultipleLocations = (locations?.length ?? 0) > 1;
  const locationLabel = primaryLocation?.city
    ? `${primaryLocation.city}${primaryLocation.state ? `, ${primaryLocation.state}` : ""}`
    : ctx.business.city
      ? `${ctx.business.city}${ctx.business.state ? `, ${ctx.business.state}` : ""}`
      : null;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between gap-4 border-b border-border bg-white px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {ctx.business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ctx.business.logo_url}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-border object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm text-white">
              {ctx.business.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight text-charcoal">{ctx.business.name}</p>
            {hasMultipleLocations && locations ? (
              <LocationQuickSwitch
                locations={locations}
                defaultLocationId={primaryLocation?.id}
                lang={lang}
              />
            ) : locationLabel ? (
              <p className="truncate text-xs text-ink/50">{locationLabel}</p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:gap-5">
          {isPlatformAdmin ? (
            <Link href="/admin" className="text-sm font-medium text-ink transition hover:text-gold-deep">
              {t(lang, "admin")}
            </Link>
          ) : null}
          <Link
            href="/dashboard/settings/business-profile"
            className="hidden text-sm font-medium text-ink transition hover:text-gold-deep sm:inline"
          >
            {t(lang, "profile")}
          </Link>
          <Link href="/dashboard/settings" className="text-sm font-medium text-ink transition hover:text-gold-deep">
            {t(lang, "settings")}
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-ink transition hover:text-gold-deep">
              {t(lang, "log_out")}
            </button>
          </form>
        </div>
      </header>

      {showTrialBanner ? (
        <div
          className={`border-b px-4 py-2 text-center text-sm sm:px-6 ${
            trialUrgent ? "border-danger/30 bg-danger/5 text-danger" : "border-border bg-cream-deep text-charcoal"
          }`}
        >
          {remaining} {t(lang, remaining === 1 ? "day_remaining" : "days_remaining")}{" "}
          <Link href="/dashboard/settings/subscription" className="font-medium underline underline-offset-2">
            {t(lang, "view_plans")}
          </Link>
        </div>
      ) : null}

      <div className="md:grid md:grid-cols-[240px_1fr]">
        <MobileNavDrawer lang={lang} />

        <aside className="hidden border-r border-border bg-white md:block">
          <DashboardNav lang={lang} />
        </aside>

        <main className="px-4 py-6 sm:px-6 sm:py-8">
          <BackButton lang={lang} />
          {children}
        </main>
      </div>
    </div>
  );
}
