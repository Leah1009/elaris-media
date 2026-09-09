"use client";

import { useActionState } from "react";
import { updateLoyaltyProgram } from "@/lib/luxora/loyalty-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function LoyaltySettingsForm({
  program,
}: {
  program: {
    enabled: boolean;
    cents_spent_per_point: number;
    point_value_cents: number;
    min_redeem_points: number;
  } | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateLoyaltyProgram, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-border bg-white p-6">
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={program?.enabled ?? false}
          className="h-4 w-4 accent-gold-deep"
        />
        Enable loyalty points
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="centsSpentPerPoint" className="text-sm font-medium text-charcoal">
            Cents spent per point earned
          </label>
          <input
            id="centsSpentPerPoint"
            name="centsSpentPerPoint"
            type="number"
            min="1"
            defaultValue={program?.cents_spent_per_point ?? 100}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.centsSpentPerPoint ? (
            <p className="text-sm text-danger">{state.fieldErrors.centsSpentPerPoint[0]}</p>
          ) : null}
          <p className="text-xs text-ink/60">1 point per {program?.cents_spent_per_point ?? 100}¢ spent.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="pointValueCents" className="text-sm font-medium text-charcoal">
            Cents each point is worth on redemption
          </label>
          <input
            id="pointValueCents"
            name="pointValueCents"
            type="number"
            min="1"
            defaultValue={program?.point_value_cents ?? 1}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.pointValueCents ? (
            <p className="text-sm text-danger">{state.fieldErrors.pointValueCents[0]}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="minRedeemPoints" className="text-sm font-medium text-charcoal">
            Minimum points to redeem
          </label>
          <input
            id="minRedeemPoints"
            name="minRedeemPoints"
            type="number"
            min="0"
            defaultValue={program?.min_redeem_points ?? 0}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Loyalty Settings"}
      </button>
    </form>
  );
}
