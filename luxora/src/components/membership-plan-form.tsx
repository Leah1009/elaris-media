"use client";

import { useActionState } from "react";
import { createMembershipPlan } from "@/lib/luxora/memberships-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function MembershipPlanForm({ services }: { services: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createMembershipPlan, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">New Membership Plan</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-charcoal">
          Name
        </label>
        <input id="name" name="name" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        {state?.fieldErrors?.name ? <p className="text-sm text-danger">{state.fieldErrors.name[0]}</p> : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-charcoal">
            Price (USD)
          </label>
          <input id="price" name="price" type="number" step="0.01" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="billingInterval" className="text-sm font-medium text-charcoal">
            Billing
          </label>
          <select
            id="billingInterval"
            name="billingInterval"
            defaultValue="monthly"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      {services.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-charcoal">Included Services (1 per period each)</legend>
          {services.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="serviceIds" value={s.id} className="h-4 w-4 accent-gold-deep" />
              {s.name}
            </label>
          ))}
        </fieldset>
      ) : null}

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create Plan"}
      </button>
    </form>
  );
}
