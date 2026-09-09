"use client";

import { useActionState } from "react";
import { createPackagePlan } from "@/lib/luxora/packages-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function PackagePlanForm({ services }: { services: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createPackagePlan, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">New Package Plan</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-charcoal">
          Name
        </label>
        <input id="name" name="name" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        {state?.fieldErrors?.name ? <p className="text-sm text-danger">{state.fieldErrors.name[0]}</p> : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="serviceId" className="text-sm font-medium text-charcoal">
          Service
        </label>
        <select id="serviceId" name="serviceId" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
          <option value="">Any service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-charcoal">
            Price (USD)
          </label>
          <input id="price" name="price" type="number" step="0.01" required className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="totalSessions" className="text-sm font-medium text-charcoal">
            Sessions
          </label>
          <input
            id="totalSessions"
            name="totalSessions"
            type="number"
            min="1"
            required
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.totalSessions ? (
            <p className="text-sm text-danger">{state.fieldErrors.totalSessions[0]}</p>
          ) : null}
        </div>
      </div>

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
