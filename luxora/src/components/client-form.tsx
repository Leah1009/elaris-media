"use client";

import { useState } from "react";
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
  has_allergies?: boolean | null;
  allergy_notes?: string | null;
  sms_consent?: boolean | null;
  email_consent?: boolean | null;
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
  const [hasAllergies, setHasAllergies] = useState(defaultValues?.has_allergies ?? false);

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
      <fieldset className="flex flex-col gap-2 rounded-sm border border-border p-3.5">
        <legend className="px-1 text-sm font-medium text-charcoal">Allergies</legend>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="hasAllergies"
            checked={hasAllergies}
            onChange={(e) => setHasAllergies(e.target.checked)}
            className="h-4 w-4 accent-gold-deep"
          />
          Client has allergies
        </label>
        {hasAllergies ? (
          <textarea
            name="allergyNotes"
            rows={2}
            required
            placeholder="List any allergies…"
            defaultValue={defaultValues?.allergy_notes ?? undefined}
            className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
          />
        ) : null}
      </fieldset>

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

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-charcoal">Communication Consent</legend>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="smsConsent"
            defaultChecked={defaultValues?.sms_consent ?? false}
            className="h-4 w-4 accent-gold-deep"
          />
          Client agreed to receive SMS messages
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="emailConsent"
            defaultChecked={defaultValues?.email_consent ?? false}
            className="h-4 w-4 accent-gold-deep"
          />
          Client agreed to receive email messages
        </label>
      </fieldset>

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
