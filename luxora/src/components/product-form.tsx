"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import type { ActionState } from "@/lib/luxora/actions";

export type ProductFormValues = {
  name?: string | null;
  category?: string | null;
  sku?: string | null;
  barcode?: string | null;
  supplier?: string | null;
  cost_cents?: number | null;
  retail_price_cents?: number | null;
  quantity_on_hand?: number | null;
  reorder_threshold?: number | null;
  product_type?: string | null;
  active?: boolean | null;
};

export function ProductForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: ProductFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormField label="Name" name="name" required defaultValue={defaultValues?.name ?? undefined} errors={state?.fieldErrors?.name} />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Category" name="category" defaultValue={defaultValues?.category ?? undefined} />
        <FormField label="Supplier" name="supplier" defaultValue={defaultValues?.supplier ?? undefined} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="SKU" name="sku" defaultValue={defaultValues?.sku ?? undefined} />
        <FormField label="Barcode" name="barcode" defaultValue={defaultValues?.barcode ?? undefined} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Cost (USD)"
          name="cost"
          type="number"
          defaultValue={defaultValues?.cost_cents != null ? (defaultValues.cost_cents / 100).toString() : "0"}
        />
        <FormField
          label="Retail Price (USD)"
          name="retailPrice"
          type="number"
          required
          defaultValue={
            defaultValues?.retail_price_cents != null ? (defaultValues.retail_price_cents / 100).toString() : "0"
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Quantity on Hand"
          name="quantityOnHand"
          type="number"
          required
          defaultValue={defaultValues?.quantity_on_hand?.toString() ?? "0"}
        />
        <FormField
          label="Reorder Threshold"
          name="reorderThreshold"
          type="number"
          required
          defaultValue={defaultValues?.reorder_threshold?.toString() ?? "0"}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="productType" className="text-sm font-medium text-charcoal">
          Type
        </label>
        <select
          id="productType"
          name="productType"
          defaultValue={defaultValues?.product_type ?? "retail"}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="retail">Retail (sold to customers)</option>
          <option value="supply">Supply (used performing services)</option>
          <option value="both">Both</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 accent-gold-deep"
        />
        Active
      </label>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
