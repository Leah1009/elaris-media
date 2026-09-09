"use client";

import { updateWaitlistStatus } from "@/lib/luxora/waitlist-actions";

const STATUS_OPTIONS = ["waiting", "notified", "booked", "cancelled"];

export function WaitlistStatusForm({ waitlistId, currentStatus }: { waitlistId: string; currentStatus: string }) {
  return (
    <form action={updateWaitlistStatus}>
      <input type="hidden" name="waitlistId" value={waitlistId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-sm border border-border bg-white px-2 py-1 text-xs text-charcoal"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
