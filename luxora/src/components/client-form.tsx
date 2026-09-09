"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import type { ActionState } from "@/lib/luxora/actions";

export type ClientFormValues = {
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  birthday?: string | null;
  address_line1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  notes?: string | null;
};

export function ClientForm({
  action,
  defaultValues,
  tags,
  selectedTagIds = [],
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: ClientFormValues;
  tags: { id: string; name: string }[];
  selectedTagIds?: string[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Full Name"
        name="fullName"
        required
        defaultValue={defaultValues?.full_name ?? undefined}
        errors={state?.fieldErrors?.fullName}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues?.phone ?? undefined}
          errors={state?.fieldErrors?.phone}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultValues?.email ?? undefined}
          errors={state?.fieldErrors?.email}
        />
      </div>
      <FormField
        label="Birthday"
        name="birthday"
        type="date"
        defaultValue={defaultValues?.birthday ?? undefined}
      />
      <FormField label="Address" name="addressLine1" defaultValue={defaultValues?.address_line1 ?? undefined} />
      <div className="grid grid-cols-3 gap-3">
        <FormField label="City" name="city" defaultValue={defaultValues?.city ?? undefined} />
        <FormField label="State" name="state" defaultValue={defaultValues?.state ?? undefined} />
        <FormField label="ZIP" name="zip" defaultValue={defaultValues?.zip ?? undefined} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-charcoal">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes ?? undefined}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        />
      </div>

      {tags.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-charcoal">Tags</legend>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1.5 text-sm text-ink">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  defaultChecked={selectedTagIds.includes(tag.id)}
                  className="h-4 w-4 accent-gold-deep"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

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
