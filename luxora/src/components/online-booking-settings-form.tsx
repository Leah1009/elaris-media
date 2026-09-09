"use client";

import { useActionState } from "react";
import { updateOnlineBookingSettings } from "@/lib/luxora/online-booking-settings-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function OnlineBookingSettingsForm({
  settings,
}: {
  settings: {
    online_booking_enabled: boolean;
    booking_window_days: number;
    min_notice_hours: number;
    buffer_minutes: number;
  };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateOnlineBookingSettings, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-sm border border-border bg-white p-6">
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="onlineBookingEnabled"
          defaultChecked={settings.online_booking_enabled}
          className="h-4 w-4 accent-gold-deep"
        />
        Accept online bookings
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bookingWindowDays" className="text-sm font-medium text-charcoal">
            Booking window (days ahead)
          </label>
          <input
            id="bookingWindowDays"
            name="bookingWindowDays"
            type="number"
            min="1"
            defaultValue={settings.booking_window_days}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
          {state?.fieldErrors?.bookingWindowDays ? (
            <p className="text-sm text-danger">{state.fieldErrors.bookingWindowDays[0]}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="minNoticeHours" className="text-sm font-medium text-charcoal">
            Minimum notice (hours)
          </label>
          <input
            id="minNoticeHours"
            name="minNoticeHours"
            type="number"
            min="0"
            defaultValue={settings.min_notice_hours}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bufferMinutes" className="text-sm font-medium text-charcoal">
            Buffer between appointments (minutes)
          </label>
          <input
            id="bufferMinutes"
            name="bufferMinutes"
            type="number"
            min="0"
            defaultValue={settings.buffer_minutes}
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
