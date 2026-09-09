"use client";

import { useActionState, useState } from "react";
import { refundManualPayment } from "@/lib/luxora/payments-actions";
import { refundCardPayment } from "@/lib/luxora/stripe-refund-actions";
import { formatCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

export function RefundForm({ paymentId, method, totalCents }: { paymentId: string; method: string; totalCents: number }) {
  const isCard = method === "card" || method === "terminal" || method === "tap_to_pay";
  const action = isCard ? refundCardPayment : refundManualPayment;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState((totalCents / 100).toFixed(2));

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs font-medium text-gold-deep underline underline-offset-2">
        Refund
      </button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="paymentId" value={paymentId} />
      <input
        type="number"
        name="amount"
        step="0.01"
        min="0.01"
        max={(totalCents / 100).toFixed(2)}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-20 rounded-sm border border-border px-1.5 py-0.5 text-xs"
      />
      <button type="submit" disabled={pending} className="text-xs font-medium text-danger">
        {pending ? "…" : "Confirm"}
      </button>
      {state?.error ? <span className="text-xs text-danger">{state.error}</span> : null}
      <span className="text-xs text-ink/40">of {formatCents(totalCents)}</span>
    </form>
  );
}
