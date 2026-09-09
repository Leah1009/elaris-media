"use client";

import { useActionState } from "react";
import { updatePlan } from "@/lib/luxora/platform-admin-actions";
import { formatCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

export function AdminPlanForm({
  plan,
}: {
  plan: { id: string; key: string; name: string; price_monthly_cents: number; badge: string | null; is_active: boolean };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updatePlan, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="planId" value={plan.id} />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-charcoal">Key</label>
        <input disabled value={plan.key} className="rounded-sm border border-border bg-cream-deep px-3 py-1.5 text-sm text-ink/60" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`name-${plan.id}`} className="text-xs font-medium text-charcoal">
          Name
        </label>
        <input
          id={`name-${plan.id}`}
          name="name"
          defaultValue={plan.name}
          className="w-32 rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`price-${plan.id}`} className="text-xs font-medium text-charcoal">
          Price / month ($)
        </label>
        <input
          id={`price-${plan.id}`}
          name="priceMonthlyDollars"
          type="number"
          min="0"
          step="0.01"
          defaultValue={(plan.price_monthly_cents / 100).toFixed(2)}
          className="w-28 rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`badge-${plan.id}`} className="text-xs font-medium text-charcoal">
          Badge
        </label>
        <input
          id={`badge-${plan.id}`}
          name="badge"
          defaultValue={plan.badge ?? ""}
          className="w-32 rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
        />
      </div>
      <label className="flex items-center gap-1.5 pb-2 text-xs text-charcoal">
        <input type="checkbox" name="active" defaultChecked={plan.is_active} className="h-4 w-4 accent-gold-deep" />
        Active
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-charcoal px-4 py-1.5 text-xs font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state?.error ? <p className="w-full text-xs text-danger">{state.error}</p> : null}
      <p className="w-full text-xs text-ink/50">Currently {formatCents(plan.price_monthly_cents)}/mo.</p>
    </form>
  );
}
