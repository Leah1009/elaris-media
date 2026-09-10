"use client";

import { useActionState, useState } from "react";
import { createAppointmentBlock } from "@/lib/luxora/appointment-blocks-actions";
import type { ActionState } from "@/lib/luxora/actions";
import type { SlotSelection, CalendarStaffOption, CalendarLocationOption } from "@/components/calendar-create-choice-modal";

const QUICK_REASONS = ["Lunch", "Meeting", "Training", "Personal", "Early Closing"];

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor((total % (24 * 60)) / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function BlockTimeModal({
  selection,
  staff,
  locations,
  onClose,
  onBack,
}: {
  selection: SlotSelection;
  staff: CalendarStaffOption[];
  locations: CalendarLocationOption[];
  onClose: () => void;
  onBack: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prevState, formData) => {
      const result = await createAppointmentBlock(prevState, formData);
      if (!result) onClose();
      return result;
    },
    null,
  );
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4" onClick={onClose}>
      <form
        action={formAction}
        className="w-full max-w-sm rounded-sm bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-charcoal">Block Time</h2>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="block-date" className="text-sm font-medium text-charcoal">
              Date
            </label>
            <input
              id="block-date"
              type="date"
              name="date"
              required
              defaultValue={selection.date}
              className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="block-start" className="text-sm font-medium text-charcoal">
                Start
              </label>
              <input
                id="block-start"
                type="time"
                name="startTime"
                required
                defaultValue={selection.time}
                className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="block-end" className="text-sm font-medium text-charcoal">
                End
              </label>
              <input
                id="block-end"
                type="time"
                name="endTime"
                required
                defaultValue={addMinutes(selection.time, 30)}
                className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="block-staff" className="text-sm font-medium text-charcoal">
              Staff
            </label>
            <select
              id="block-staff"
              name="staffId"
              defaultValue={selection.staffId ?? ""}
              className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
            >
              <option value="">All Staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          {locations.length > 1 ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="block-location" className="text-sm font-medium text-charcoal">
                Location
              </label>
              <select
                id="block-location"
                name="locationId"
                required
                defaultValue={selection.locationId ?? locations[0]?.id ?? ""}
                className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input type="hidden" name="locationId" value={selection.locationId ?? locations[0]?.id ?? ""} />
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="block-reason" className="text-sm font-medium text-charcoal">
              Reason <span className="text-ink/40">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    reason === r ? "border-gold-deep bg-gold/10 text-charcoal" : "border-border text-ink"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              id="block-reason"
              type="text"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Lunch"
              className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
            />
          </div>
        </div>

        {state?.error ? <p className="mt-3 text-sm text-danger">{state.error}</p> : null}

        <div className="mt-5 flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-xs font-medium text-ink/50 underline underline-offset-2">
            ← Back
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-60"
          >
            {pending ? "Blocking…" : "Block This Time"}
          </button>
        </div>
      </form>
    </div>
  );
}
