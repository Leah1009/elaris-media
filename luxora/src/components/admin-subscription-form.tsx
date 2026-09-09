"use client";

import { useActionState } from "react";
import { updateSubscription } from "@/lib/luxora/platform-admin-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function AdminSubscriptionForm({
  businessId,
  currentPlanId,
  currentStatus,
  plans,
}: {
  businessId: string;
  currentPlanId: string | null;
  currentStatus: string | null;
  plans: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateSubscription, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="businessId" value={businessId} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="planId" className="text-xs font-medium text-charcoal">
          Plan
        </label>
        <select
          id="planId"
          name="planId"
          defaultValue={currentPlanId ?? ""}
          className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-xs font-medium text-charcoal">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus ?? "trialing"}
          className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
        >
          <option value="trialing">Trialing</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update Subscription"}
      </button>
      {state?.error ? <p className="text-xs text-danger">{state.error}</p> : null}
    </form>
  );
}
