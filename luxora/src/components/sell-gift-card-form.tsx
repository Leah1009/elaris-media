"use client";

import { useActionState, useState } from "react";
import { sellGiftCard } from "@/lib/luxora/gift-cards-actions";
import type { ActionState } from "@/lib/luxora/actions";

const PRESETS = [25, 50, 100, 150];

export function SellGiftCardForm({ clients }: { clients: { id: string; full_name: string }[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sellGiftCard, null);
  const [amount, setAmount] = useState("50");

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-border bg-white p-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-charcoal">Amount</label>
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`rounded-sm border px-4 py-2 text-sm ${
                amount === String(p) ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          type="number"
          name="amount"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-32 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.amount ? <p className="text-sm text-danger">{state.fieldErrors.amount[0]}</p> : null}
      </div>

      {clients.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="purchaserClientId" className="text-sm font-medium text-charcoal">
            Purchased by (optional)
          </label>
          <select
            id="purchaserClientId"
            name="purchaserClientId"
            defaultValue=""
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            <option value="">—</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="recipientName" className="text-sm font-medium text-charcoal">
            Recipient Name (optional)
          </label>
          <input id="recipientName" name="recipientName" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="recipientEmail" className="text-sm font-medium text-charcoal">
            Recipient Email (optional)
          </label>
          <input
            id="recipientEmail"
            name="recipientEmail"
            type="email"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
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
        {pending ? "Selling…" : "Sell Gift Card"}
      </button>
    </form>
  );
}
