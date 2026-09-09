"use client";

import { updateAppointmentStatus } from "@/lib/luxora/appointments-actions";

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export function AppointmentStatusForm({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string;
  currentStatus: string;
}) {
  return (
    <form action={updateAppointmentStatus} className="mt-1">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-full rounded-sm border border-border bg-white px-1 py-0.5 text-[11px] text-charcoal"
        aria-label="Appointment status"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
