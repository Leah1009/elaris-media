"use client";

import { useActionState } from "react";
import { updateBusinessHours } from "@/lib/luxora/locations-actions";
import type { ActionState } from "@/lib/luxora/actions";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type BusinessHourRow = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  closed: boolean;
};

export function LocationHoursForm({ locationId, hours }: { locationId: string; hours: BusinessHourRow[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateBusinessHours, null);
  const byDay = new Map(hours.map((h) => [h.day_of_week, h]));

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locationId" value={locationId} />
      {DAY_LABELS.map((label, day) => {
        const row = byDay.get(day);
        return (
          <div key={day} className="grid grid-cols-[100px_auto_1fr_1fr] items-center gap-3 text-sm">
            <span className="text-charcoal">{label}</span>
            <label className="flex items-center gap-1.5 text-ink">
              <input
                type="checkbox"
                name={`closed_${day}`}
                defaultChecked={row?.closed ?? true}
                className="h-4 w-4 accent-gold-deep"
              />
              Closed
            </label>
            <input
              type="time"
              name={`open_${day}`}
              defaultValue={row?.open_time?.slice(0, 5) ?? ""}
              className="rounded-sm border border-border bg-white px-2 py-1.5 text-sm text-charcoal"
            />
            <input
              type="time"
              name={`close_${day}`}
              defaultValue={row?.close_time?.slice(0, 5) ?? ""}
              className="rounded-sm border border-border bg-white px-2 py-1.5 text-sm text-charcoal"
            />
          </div>
        );
      })}

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-sm border border-border px-4 py-2 text-sm font-medium text-charcoal transition hover:border-gold-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Hours"}
      </button>
    </form>
  );
}
