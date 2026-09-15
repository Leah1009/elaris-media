"use client";

import { useActionState } from "react";
import { updateReferralProgramSettings } from "@/lib/luxora/admin-referrals-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function AdminReferralSettingsForm({
  settings,
}: {
  settings: { program_active: boolean; reward_amount_cents: number; reward_type: string };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateReferralProgramSettings, null);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-sm border border-border bg-white p-5">
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input type="checkbox" name="programActive" defaultChecked={settings.program_active} className="h-4 w-4 accent-gold-deep" />
        Program active (referral card and section hidden everywhere when off)
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rewardAmountDollars" className="text-xs font-medium text-charcoal">
            Reward amount ($)
          </label>
          <input
            id="rewardAmountDollars"
            name="rewardAmountDollars"
            type="number"
            step="0.01"
            defaultValue={(settings.reward_amount_cents / 100).toFixed(2)}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rewardType" className="text-xs font-medium text-charcoal">
            Reward type
          </label>
          <select
            id="rewardType"
            name="rewardType"
            defaultValue={settings.reward_type}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
          >
            <option value="gift_card">Gift Card</option>
            <option value="account_credit">Account Credit</option>
            <option value="cash">Cash</option>
          </select>
        </div>
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-gold-deep">Saved.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-5 py-2 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
