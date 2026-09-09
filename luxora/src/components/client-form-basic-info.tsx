"use client";

import { useActionState } from "react";
import { FormField } from "@/components/form-field";
import type { ActionState } from "@/lib/luxora/actions";

export function ClientFormBasicInfo({
  action,
  defaultValues,
  services,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: {
    name?: string | null;
    description?: string | null;
    trigger?: string | null;
    service_id?: string | null;
  };
  services: { id: string; name: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Form Name"
        name="name"
        required
        defaultValue={defaultValues?.name ?? undefined}
        errors={state?.fieldErrors?.name}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-charcoal">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={defaultValues?.description ?? undefined}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trigger" className="text-sm font-medium text-charcoal">
          When to request this form
        </label>
        <select
          id="trigger"
          name="trigger"
          defaultValue={defaultValues?.trigger ?? "manual"}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="manual">Manual (staff sends it)</option>
          <option value="first_visit_only">First visit only</option>
          <option value="every_appointment">Every appointment</option>
        </select>
      </div>
      {services.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="serviceId" className="text-sm font-medium text-charcoal">
            Only for this service (optional)
          </label>
          <select
            id="serviceId"
            name="serviceId"
            defaultValue={defaultValues?.service_id ?? ""}
            className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
          >
            <option value="">All services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
