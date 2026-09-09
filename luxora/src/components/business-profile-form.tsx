"use client";

import { useActionState, useState } from "react";
import { updateBusinessProfile } from "@/lib/luxora/business-profile-actions";
import { BUSINESS_TYPES, US_STATES } from "@/lib/luxora/business-types";
import type { ActionState } from "@/lib/luxora/actions";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (New York)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Denver", label: "Mountain (Denver)" },
  { value: "America/Phoenix", label: "Mountain, no DST (Phoenix)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles)" },
  { value: "America/Anchorage", label: "Alaska (Anchorage)" },
  { value: "Pacific/Honolulu", label: "Hawaii (Honolulu)" },
];

export function BusinessProfileForm({
  defaultValues,
}: {
  defaultValues: {
    name: string;
    business_type: string;
    business_type_other: string | null;
    description: string | null;
    phone: string | null;
    email: string | null;
    address_line1: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    timezone: string;
    tax_rate_percent: number;
  };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateBusinessProfile, null);
  const [businessType, setBusinessType] = useState(defaultValues.business_type);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-border bg-white p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-charcoal">
          Business Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.name ? <p className="text-sm text-danger">{state.fieldErrors.name[0]}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="businessType" className="text-sm font-medium text-charcoal">
            Business Type
          </label>
          <select
            id="businessType"
            name="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        {businessType === "other" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="businessTypeOther" className="text-sm font-medium text-charcoal">
              Describe your business
            </label>
            <input
              id="businessTypeOther"
              name="businessTypeOther"
              defaultValue={defaultValues.business_type_other ?? ""}
              className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
            />
            {state?.fieldErrors?.businessTypeOther ? (
              <p className="text-sm text-danger">{state.fieldErrors.businessTypeOther[0]}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-charcoal">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues.description ?? ""}
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-charcoal">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={defaultValues.phone ?? ""}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.phone ? <p className="text-sm text-danger">{state.fieldErrors.phone[0]}</p> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues.email ?? ""}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.email ? <p className="text-sm text-danger">{state.fieldErrors.email[0]}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="addressLine1" className="text-sm font-medium text-charcoal">
          Address
        </label>
        <input
          id="addressLine1"
          name="addressLine1"
          defaultValue={defaultValues.address_line1 ?? ""}
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.addressLine1 ? (
          <p className="text-sm text-danger">{state.fieldErrors.addressLine1[0]}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-medium text-charcoal">
            City
          </label>
          <input
            id="city"
            name="city"
            defaultValue={defaultValues.city ?? ""}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-sm font-medium text-charcoal">
            State
          </label>
          <select
            id="state"
            name="state"
            defaultValue={defaultValues.state ?? ""}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="zip" className="text-sm font-medium text-charcoal">
            ZIP
          </label>
          <input
            id="zip"
            name="zip"
            defaultValue={defaultValues.zip ?? ""}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="timezone" className="text-sm font-medium text-charcoal">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={defaultValues.timezone}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-ink/60">
            Changing this affects how future appointment times are interpreted — existing appointments keep
            their stored UTC instant.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="taxRatePercent" className="text-sm font-medium text-charcoal">
            Sales Tax Rate (%)
          </label>
          <input
            id="taxRatePercent"
            name="taxRatePercent"
            type="number"
            min="0"
            max="100"
            step="0.01"
            defaultValue={defaultValues.tax_rate_percent}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
