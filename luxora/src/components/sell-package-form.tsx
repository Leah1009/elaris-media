"use client";

import { useActionState } from "react";
import { sellPackageToClient } from "@/lib/luxora/packages-actions";
import { formatCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

export function SellPackageForm({
  plans,
  clients,
}: {
  plans: { id: string; name: string; price_cents: number; total_sessions: number }[];
  clients: { id: string; full_name: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sellPackageToClient, null);

  if (plans.length === 0 || clients.length === 0) return null;

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Sell Package to Client</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="packagePlanId" className="text-sm font-medium text-charcoal">
          Package
        </label>
        <select id="packagePlanId" name="packagePlanId" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {formatCents(p.price_cents)} ({p.total_sessions} sessions)
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

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Selling…" : "Sell Package"}
      </button>
    </form>
  );
}
