"use client";

import { useActionState } from "react";
import { addToWaitlist } from "@/lib/luxora/waitlist-actions";
import { FormField } from "@/components/form-field";
import type { ActionState } from "@/lib/luxora/actions";

export function AddWaitlistForm({
  services,
  staff,
}: {
  services: { id: string; name: string }[];
  staff: { id: string; full_name: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(addToWaitlist, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Add to Waitlist</h2>
      <FormField label="Full Name" name="fullName" required errors={state?.fieldErrors?.fullName} />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Phone" name="phone" type="tel" />
        <FormField label="Email" name="email" type="email" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="serviceId" className="text-sm font-medium text-charcoal">
            Service
          </label>
          <select id="serviceId" name="serviceId" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
            <option value="">Any</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferredStaffId" className="text-sm font-medium text-charcoal">
            Preferred Staff
          </label>
          <select id="preferredStaffId" name="preferredStaffId" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
            <option value="">Any</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Preferred From" name="preferredDateStart" type="date" />
        <FormField label="Preferred To" name="preferredDateEnd" type="date" />
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to Waitlist"}
      </button>
    </form>
  );
}
