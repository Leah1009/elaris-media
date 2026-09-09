"use client";

import { useActionState, useState } from "react";
import { createPromotion } from "@/lib/luxora/promotions-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function CreatePromotionForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createPromotion, null);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-border bg-white p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium text-charcoal">
            Code
          </label>
          <input
            id="code"
            name="code"
            placeholder="SUMMER10"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.code ? <p className="text-sm text-danger">{state.fieldErrors.code[0]}</p> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-charcoal">
            Description (optional)
          </label>
          <input id="description" name="description" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="discountType" className="text-sm font-medium text-charcoal">
            Discount Type
          </label>
          <select
            id="discountType"
            name="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed amount off</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="discountValue" className="text-sm font-medium text-charcoal">
            {discountType === "percent" ? "Percent" : "Amount ($)"}
          </label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            min="0.01"
            step="0.01"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.discountValue ? (
            <p className="text-sm text-danger">{state.fieldErrors.discountValue[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="maxUses" className="text-sm font-medium text-charcoal">
            Total use limit (optional)
          </label>
          <input id="maxUses" name="maxUses" type="number" min="1" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="perClientLimit" className="text-sm font-medium text-charcoal">
            Uses per client (optional)
          </label>
          <input
            id="perClientLimit"
            name="perClientLimit"
            type="number"
            min="1"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="validFrom" className="text-sm font-medium text-charcoal">
            Valid from (optional)
          </label>
          <input id="validFrom" name="validFrom" type="date" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="validTo" className="text-sm font-medium text-charcoal">
            Valid until (optional)
          </label>
          <input id="validTo" name="validTo" type="date" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create Promotion"}
      </button>
    </form>
  );
}
