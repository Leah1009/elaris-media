"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import type { ActionState } from "@/lib/luxora/actions";

export type StaffFormValues = {
  full_name?: string | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  active?: boolean | null;
};

export function StaffForm({
  action,
  defaultValues,
  services,
  locations,
  selectedServiceIds = [],
  selectedLocationIds = [],
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: StaffFormValues;
  services: { id: string; name: string }[];
  locations: { id: string; name: string }[];
  selectedServiceIds?: string[];
  selectedLocationIds?: string[];
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
      <FormField
        label="Title"
        name="title"
        defaultValue={defaultValues?.title ?? undefined}
        errors={state?.fieldErrors?.title}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={defaultValues?.email ?? undefined}
        errors={state?.fieldErrors?.email}
      />
      <FormField
        label="Phone"
        name="phone"
        type="tel"
        defaultValue={defaultValues?.phone ?? undefined}
        errors={state?.fieldErrors?.phone}
      />

      {services.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-charcoal">Services performed</legend>
          {services.map((service) => (
            <label key={service.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="serviceIds"
                value={service.id}
                defaultChecked={selectedServiceIds.includes(service.id)}
                className="h-4 w-4 accent-gold-deep"
              />
              {service.name}
            </label>
          ))}
        </fieldset>
      ) : null}

      {locations.length > 1 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-charcoal">Locations</legend>
          {locations.map((location) => (
            <label key={location.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="locationIds"
                value={location.id}
                defaultChecked={selectedLocationIds.includes(location.id)}
                className="h-4 w-4 accent-gold-deep"
              />
              {location.name}
            </label>
          ))}
        </fieldset>
      ) : locations[0] ? (
        <input type="hidden" name="locationIds" value={locations[0].id} />
      ) : null}

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 accent-gold-deep"
        />
        Active
      </label>

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
