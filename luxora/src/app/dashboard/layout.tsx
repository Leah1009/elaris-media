import Link from "next/link";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { logout } from "@/lib/luxora/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getBusinessContext();
  const remaining = daysRemaining(ctx.access.trialEndsAt);
  const showTrialBanner = ctx.access.subscriptionStatus === "trialing" && !ctx.access.isLocked;

  const supabase = await createClient();
  const { data: isPlatformAdmin } = await supabase.rpc("is_platform_admin");

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg text-charcoal">Luxora</span>
          <span className="hidden text-sm text-ink sm:inline">— {ctx.business.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {isPlatformAdmin ? (
            <Link href="/admin" className="text-sm font-medium text-ink transition hover:text-gold-deep">
              Admin
            </Link>
          ) : null}
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-ink transition hover:text-gold-deep"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      {showTrialBanner ? (
        <div className="border-b border-border bg-cream-deep px-4 py-2 text-center text-sm text-charcoal sm:px-6">
          {remaining} {remaining === 1 ? "day" : "days"} remaining in your free trial.
        </div>
      ) : null}

      <div className="md:grid md:grid-cols-[240px_1fr]">
        <details className="border-b border-border bg-white md:hidden">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-charcoal">
            Menu
          </summary>
          <DashboardNav />
        </details>

        <aside className="hidden border-r border-border bg-white md:block">
          <DashboardNav />
        </aside>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
