"use client";

import { useActionState, useMemo, useState } from "react";
import { recordManualPayment } from "@/lib/luxora/payments-actions";
import { createCardCheckoutSession } from "@/lib/luxora/stripe-checkout-actions";
import { computeTax, computeTotal, METHOD_LABELS, MANUAL_METHODS } from "@/lib/luxora/payments";
import { formatCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

const UNAVAILABLE_METHODS: Record<string, string> = {
  terminal: "Requires a paired Stripe card reader — hardware ordering isn't set up yet.",
  tap_to_pay: "Requires the Luxora mobile app, which doesn't exist yet.",
};

export function CheckoutForm({
  appointmentId,
  clientName,
  serviceLines,
  taxRatePercent,
  cardEnabled,
}: {
  appointmentId: string;
  clientName: string;
  serviceLines: { name: string; price_cents: number }[];
  taxRatePercent: number;
  cardEnabled: boolean;
}) {
  const [manualState, manualAction, manualPending] = useActionState<ActionState, FormData>(
    recordManualPayment,
    null,
  );
  const [cardState, cardAction, cardPending] = useActionState<ActionState, FormData>(
    createCardCheckoutSession,
    null,
  );
  const [discount, setDiscount] = useState("0");
  const [tip, setTip] = useState("0");
  const [method, setMethod] = useState<string>("cash");

  const servicesCents = serviceLines.reduce((sum, l) => sum + l.price_cents, 0);
  const discountCents = Math.round((Number(discount) || 0) * 100);
  const tipCents = Math.round((Number(tip) || 0) * 100);
  const taxCents = useMemo(
    () => computeTax(servicesCents - discountCents, taxRatePercent),
    [servicesCents, discountCents, taxRatePercent],
  );
  const totalCents = computeTotal({ servicesCents, discountCents, taxCents, tipCents });
  const isManualMethod = (MANUAL_METHODS as readonly string[]).includes(method);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-sm border border-border bg-white p-5">
        <p className="text-sm font-medium text-charcoal">{clientName}</p>
        <div className="mt-3 flex flex-col gap-1.5 text-sm">
          {serviceLines.map((l, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-ink">{l.name}</span>
              <span className="text-charcoal">{formatCents(l.price_cents)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <label htmlFor="discount-input" className="text-ink">
              Discount
            </label>
            <input
              id="discount-input"
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-24 rounded-sm border border-border px-2 py-1 text-right text-charcoal"
            />
          </div>
          <div className="flex justify-between">
            <span className="text-ink">Tax ({taxRatePercent}%)</span>
            <span className="text-charcoal">{formatCents(taxCents)}</span>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="tip-input" className="text-ink">
              Tip
            </label>
            <input
              id="tip-input"
              type="number"
              min="0"
              step="0.01"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="w-24 rounded-sm border border-border px-2 py-1 text-right text-charcoal"
            />
          </div>
          <div className="flex gap-2">
            {[15, 20, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setTip(((servicesCents - discountCents) * (pct / 100) / 100).toFixed(2))}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-charcoal hover:border-gold-deep"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium text-charcoal">
          <span>Total</span>
          <span>{formatCents(totalCents)}</span>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-white p-5">
        <p className="text-sm font-medium text-charcoal">Payment Method</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {MANUAL_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`rounded-sm border px-3 py-2 text-sm ${
                method === m ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
              }`}
            >
              {METHOD_LABELS[m]}
            </button>
          ))}
          <button
            type="button"
            disabled={!cardEnabled}
            title={cardEnabled ? undefined : "Connect Stripe in Settings → Payments first"}
            onClick={() => setMethod("card")}
            className={`rounded-sm border px-3 py-2 text-sm ${
              method === "card" ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
            } disabled:opacity-40`}
          >
            {METHOD_LABELS.card}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {Object.keys(UNAVAILABLE_METHODS).map((m) => (
            <button
              key={m}
              type="button"
              disabled
              title={UNAVAILABLE_METHODS[m]}
              className="rounded-sm border border-border px-3 py-2 text-xs text-ink/40"
            >
              {METHOD_LABELS[m]}
            </button>
          ))}
        </div>
        {!cardEnabled ? (
          <p className="mt-2 text-xs text-ink/60">
            Connect Stripe in Settings → Payments to accept cards.
          </p>
        ) : null}
      </div>

      {isManualMethod ? (
        <form action={manualAction} className="flex flex-col gap-2">
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="discount" value={discount} />
          <input type="hidden" name="tip" value={tip} />
          <input type="hidden" name="method" value={method} />
          {manualState?.error ? <p className="text-sm text-danger">{manualState.error}</p> : null}
          <button
            type="submit"
            disabled={manualPending}
            className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
          >
            {manualPending ? "Processing…" : `Record ${formatCents(totalCents)} Payment`}
          </button>
        </form>
      ) : (
        <form action={cardAction} className="flex flex-col gap-2">
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="discount" value={discount} />
          <input type="hidden" name="tip" value={tip} />
          {cardState?.error ? <p className="text-sm text-danger">{cardState.error}</p> : null}
          <button
            type="submit"
            disabled={cardPending || !cardEnabled}
            className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
          >
            {cardPending ? "Redirecting…" : `Charge Card ${formatCents(totalCents)}`}
          </button>
          <p className="text-xs text-ink/60">Opens Stripe Checkout for the customer to enter their card.</p>
        </form>
      )}
    </div>
  );
}
