import Link from "next/link";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { BackButton } from "@/components/back-button";
import { logout } from "@/lib/luxora/actions";
import { t } from "@/lib/luxora/i18n";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;
  const remaining = daysRemaining(ctx.access.trialEndsAt);
  const showTrialBanner = ctx.access.subscriptionStatus === "trialing" && !ctx.access.isLocked;

  const supabase = await createClient();
  const { data: isPlatformAdmin } = await supabase.rpc("is_platform_admin");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col">
          <span className="font-display text-2xl leading-tight text-charcoal">{ctx.business.name}</span>
          <Link href="/dashboard/settings/business-profile" className="text-xs text-ink/60 hover:text-gold-deep">
            {t(lang, "profile")}
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {isPlatformAdmin ? (
            <Link href="/admin" className="text-sm font-medium text-ink transition hover:text-gold-deep">
              {t(lang, "admin")}
            </Link>
          ) : null}
          <Link href="/dashboard/settings" className="text-sm font-medium text-ink transition hover:text-gold-deep">
            {t(lang, "settings")}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-ink transition hover:text-gold-deep"
            >
              {t(lang, "log_out")}
            </button>
          </form>
        </div>
      </header>

      {showTrialBanner ? (
        <div className="border-b border-border bg-cream-deep px-4 py-2 text-center text-sm text-charcoal sm:px-6">
          {remaining} {t(lang, remaining === 1 ? "day_remaining" : "days_remaining")}
        </div>
      ) : null}

      <div className="md:grid md:grid-cols-[240px_1fr]">
        <details className="border-b border-border bg-white md:hidden">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-charcoal">
            {t(lang, "menu")}
          </summary>
          <DashboardNav lang={lang} />
        </details>

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
