"use client";

import { useActionState, useState } from "react";
import { FormField } from "@/components/form-field";
import { SERVICE_COLOR_PALETTE } from "@/lib/luxora/service-colors";
import type { ActionState } from "@/lib/luxora/actions";

export type ServiceFormValues = {
  name?: string | null;
  category?: string | null;
  description?: string | null;
  duration_minutes?: number | null;
  price_cents?: number | null;
  deposit_required?: boolean | null;
  deposit_cents?: number | null;
  active?: boolean | null;
  color?: string | null;
};

export function ServiceForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: ServiceFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);
  const [color, setColor] = useState(defaultValues?.color ?? SERVICE_COLOR_PALETTE[0]);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Name"
        name="name"
        required
        defaultValue={defaultValues?.name ?? undefined}
        errors={state?.fieldErrors?.name}
      />
      <FormField
        label="Category"
        name="category"
        defaultValue={defaultValues?.category ?? undefined}
        errors={state?.fieldErrors?.category}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-charcoal">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? undefined}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Duration (minutes)"
          name="durationMinutes"
          type="number"
          required
          defaultValue={defaultValues?.duration_minutes?.toString()}
          errors={state?.fieldErrors?.durationMinutes}
        />
        <FormField
          label="Price (USD)"
          name="price"
          type="number"
          required
          defaultValue={
            defaultValues?.price_cents != null
              ? (defaultValues.price_cents / 100).toString()
              : undefined
          }
          errors={state?.fieldErrors?.price}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="depositRequired"
          defaultChecked={defaultValues?.deposit_required ?? false}
          className="h-4 w-4 accent-gold-deep"
        />
        Require a deposit
      </label>
      <FormField
        label="Deposit amount (USD)"
        name="depositAmount"
        type="number"
        defaultValue={
          defaultValues?.deposit_cents ? (defaultValues.deposit_cents / 100).toString() : undefined
        }
      />

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 accent-gold-deep"
        />
        Active (visible for booking)
      </label>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-charcoal">Calendar Color</label>
        <div className="flex flex-wrap items-center gap-2">
          {SERVICE_COLOR_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-charcoal" : "border-transparent"}`}
              aria-label={c}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-7 w-9 rounded-sm border border-border"
            aria-label="Custom color"
          />
        </div>
        <input type="hidden" name="color" value={color} />
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

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
