"use client";

import { useActionState } from "react";
import { createHardwareProduct, updateHardwareProduct } from "@/lib/luxora/admin-hardware-actions";
import type { ActionState } from "@/lib/luxora/actions";

type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  device_type: string;
  selling_price_cents: number | null;
  internal_cost_cents: number | null;
  active: boolean;
  display_order: number;
};

export function AdminHardwareProductForm({ product }: { product?: Product }) {
  const action = product ? updateHardwareProduct : createHardwareProduct;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-sm border border-border bg-white p-5">
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={product?.name} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-charcoal">Device Type</label>
          <select
            name="deviceType"
            defaultValue={product?.device_type ?? "card_reader"}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
          >
            <option value="tap_to_pay">Tap to Pay</option>
            <option value="card_reader">Card Reader</option>
            <option value="smart_terminal">Smart Terminal</option>
          </select>
        </div>
      </div>
      <Field label="Description" name="description" defaultValue={product?.description ?? ""} />
      <Field label="Image URL" name="imageUrl" defaultValue={product?.image_url ?? ""} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field
          label="Selling Price ($)"
          name="sellingPriceDollars"
          type="number"
          step="0.01"
          defaultValue={product?.selling_price_cents !== null && product?.selling_price_cents !== undefined ? (product.selling_price_cents / 100).toFixed(2) : ""}
        />
        <Field
          label="Internal Cost ($) — never shown to businesses"
          name="internalCostDollars"
          type="number"
          step="0.01"
          defaultValue={product?.internal_cost_cents !== null && product?.internal_cost_cents !== undefined ? (product.internal_cost_cents / 100).toFixed(2) : ""}
        />
        <Field label="Display Order" name="displayOrder" type="number" defaultValue={String(product?.display_order ?? 0)} />
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input type="checkbox" name="active" defaultChecked={product?.active ?? false} className="h-4 w-4 accent-gold-deep" />
        Active (visible to businesses)
      </label>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-5 py-2 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-charcoal">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="rounded-sm border border-border px-3 py-1.5 text-sm text-charcoal"
      />
    </div>
  );
}
