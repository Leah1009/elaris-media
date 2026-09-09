"use client";

import { useActionState } from "react";
import { createAppointment } from "@/lib/luxora/appointments-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function AppointmentForm({
  clients,
  services,
  staff,
  locations,
  defaultDate,
}: {
  clients: { id: string; full_name: string }[];
  services: { id: string; name: string; duration_minutes: number; price_cents: number }[];
  staff: { id: string; full_name: string }[];
  locations: { id: string; name: string }[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createAppointment, null);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="clientId" className="text-sm font-medium text-charcoal">
          Client <span className="text-gold-deep">*</span>
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          defaultValue=""
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="" disabled>
            Select client
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.clientId ? (
          <p className="text-sm text-danger">{state.fieldErrors.clientId[0]}</p>
        ) : null}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-charcoal">
          Services <span className="text-gold-deep">*</span>
        </legend>
        {services.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="serviceIds" value={s.id} className="h-4 w-4 accent-gold-deep" />
            {s.name} · {s.duration_minutes} min · ${(s.price_cents / 100).toFixed(0)}
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="staffId" className="text-sm font-medium text-charcoal">
          Staff <span className="text-gold-deep">*</span>
        </label>
        <select
          id="staffId"
          name="staffId"
          required
          defaultValue=""
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="" disabled>
            Select staff
          </option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.staffId ? (
          <p className="text-sm text-danger">{state.fieldErrors.staffId[0]}</p>
        ) : null}
      </div>

      {locations.length > 1 ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="locationId" className="text-sm font-medium text-charcoal">
            Location <span className="text-gold-deep">*</span>
          </label>
          <select
            id="locationId"
            name="locationId"
            required
            defaultValue=""
            className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
          >
            <option value="" disabled>
              Select location
            </option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      ) : locations[0] ? (
        <input type="hidden" name="locationId" value={locations[0].id} />
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-sm font-medium text-charcoal">
            Date <span className="text-gold-deep">*</span>
          </label>
          <input
            id="date"
            type="date"
            name="date"
            required
            defaultValue={defaultDate}
            className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="time" className="text-sm font-medium text-charcoal">
            Time <span className="text-gold-deep">*</span>
          </label>
          <input
            id="time"
            type="time"
            name="time"
            required
            className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium text-charcoal">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue="confirmed"
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-charcoal">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        />
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
        {pending ? "Booking…" : "Create Appointment"}
      </button>
    </form>
  );
}
