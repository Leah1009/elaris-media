import Link from "next/link";
import { getBusinessContext, daysRemaining } from "@/lib/luxora/business-context";

export default async function DashboardPage() {
  const ctx = await getBusinessContext();

  if (ctx.access.isLocked) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-2xl text-charcoal">Your free trial has ended</h1>
        <p className="mt-3 text-sm text-ink">
          Your business information is safe. Choose a Luxora plan to continue managing your
          appointments, clients and business.
        </p>
        <Link
          href="/dashboard/settings/subscription"
          className="mt-6 inline-block rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
        >
          View Plans
        </Link>
      </div>
    );
  }

  const remaining = daysRemaining(ctx.access.trialEndsAt);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Welcome, {ctx.business.name}</h1>
        <p className="mt-1 text-sm text-ink">
          {remaining > 0
            ? `${remaining} ${remaining === 1 ? "day" : "days"} left in your free trial.`
            : "Your trial has ended."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {["Today's Appointments", "Today's Revenue", "New Clients"].map((label) => (
          <div key={label} className="rounded-sm border border-border bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink/60">{label}</p>
            <p className="mt-2 font-display text-3xl text-charcoal">—</p>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">Getting your business online</h2>
        <p className="mt-2 text-sm text-ink">
          Calendar, services, staff and client management are coming in the next build phase.
          Your account, business profile and trial are already set up.
        </p>
      </div>
    </div>
  );
}
