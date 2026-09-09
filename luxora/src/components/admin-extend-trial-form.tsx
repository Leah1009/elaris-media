"use client";

import { useActionState } from "react";
import { extendTrial } from "@/lib/luxora/platform-admin-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function AdminExtendTrialForm({ businessId, currentTrialEnd }: { businessId: string; currentTrialEnd: string | null }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(extendTrial, null);

  return (
    <form action={formAction} className="flex items-end gap-2">
      <input type="hidden" name="businessId" value={businessId} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="newTrialEnd" className="text-xs font-medium text-charcoal">
          New trial end date
        </label>
        <input
          id="newTrialEnd"
          name="newTrialEnd"
          type="date"
          defaultValue={currentTrialEnd ? currentTrialEnd.slice(0, 10) : ""}
          className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Extend Trial"}
      </button>
      {state?.error ? <p className="text-xs text-danger">{state.error}</p> : null}
      {state?.fieldErrors?.newTrialEnd ? <p className="text-xs text-danger">{state.fieldErrors.newTrialEnd[0]}</p> : null}
    </form>
  );
}
