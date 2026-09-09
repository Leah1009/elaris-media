"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import { createLocation } from "@/lib/luxora/locations-actions";
import { US_STATES } from "@/lib/luxora/business-types";
import type { ActionState } from "@/lib/luxora/actions";

export function AddLocationForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createLocation, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <h2 className="font-display text-lg text-charcoal">Add Location</h2>
      <FormField label="Name" name="name" required errors={state?.fieldErrors?.name} />
      <FormField
        label="Address"
        name="addressLine1"
        required
        errors={state?.fieldErrors?.addressLine1}
      />
      <div className="grid grid-cols-3 gap-3">
        <FormField label="City" name="city" required errors={state?.fieldErrors?.city} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-sm font-medium text-charcoal">
            State <span className="text-gold-deep">*</span>
          </label>
          <select
            id="state"
            name="state"
            required
            defaultValue=""
            className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
          >
            <option value="" disabled>
              —
            </option>
            {US_STATES.map((abbr) => (
              <option key={abbr} value={abbr}>
                {abbr}
              </option>
            ))}
          </select>
        </div>
        <FormField label="ZIP" name="zip" required errors={state?.fieldErrors?.zip} />
      </div>
      <FormField label="Phone" name="phone" type="tel" />

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add Location"}
      </button>
    </form>
  );
}
