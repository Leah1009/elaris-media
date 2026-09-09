"use client";

import { useActionState } from "react";
import { startClientMembership } from "@/lib/luxora/memberships-actions";
import { formatCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

export function StartMembershipForm({
  plans,
  clients,
}: {
  plans: { id: string; name: string; price_cents: number; billing_interval: string }[];
  clients: { id: string; full_name: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(startClientMembership, null);

  if (plans.length === 0 || clients.length === 0) return null;

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Start Membership for Client</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="membershipPlanId" className="text-sm font-medium text-charcoal">
          Plan
        </label>
        <select id="membershipPlanId" name="membershipPlanId" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {formatCents(p.price_cents)}/{p.billing_interval === "monthly" ? "mo" : "yr"}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="clientId" className="text-sm font-medium text-charcoal">
          Client
        </label>
        <select id="clientId" name="clientId" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="method" className="text-sm font-medium text-charcoal">
          Payment Method
        </label>
        <select id="method" name="method" defaultValue="cash" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
          <option value="cash">Cash</option>
          <option value="zelle">Zelle</option>
          <option value="cash_app">Cash App</option>
          <option value="other">Other</option>
        </select>
      </div>
      <p className="text-xs text-ink/60">
        Charges the first period now. Recurring auto-billing isn&apos;t enabled yet — renew manually
        each period until Stripe Billing is connected.
      </p>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Starting…" : "Start Membership"}
      </button>
    </form>
  );
}
