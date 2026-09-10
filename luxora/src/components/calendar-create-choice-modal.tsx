"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatInTimeZone } from "@/lib/luxora/timezone";
import { BlockTimeModal } from "@/components/block-time-modal";

export type CalendarStaffOption = { id: string; full_name: string };
export type CalendarLocationOption = { id: string; name: string };

export type SlotSelection = {
  date: string;
  time: string;
  staffId?: string;
  locationId?: string;
};

export function CalendarCreateChoiceModal({
  selection,
  staff,
  locations,
  onClose,
}: {
  selection: SlotSelection;
  staff: CalendarStaffOption[];
  locations: CalendarLocationOption[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [showBlockForm, setShowBlockForm] = useState(false);

  const [h, m] = selection.time.split(":").map(Number);
  const displayDate = new Date(`${selection.date}T00:00:00Z`);
  const label = `${formatInTimeZone(displayDate, "UTC", { weekday: "long", month: "short", day: "numeric" })} · ${formatInTimeZone(
    new Date(Date.UTC(1970, 0, 1, h, m)),
    "UTC",
    { hour: "numeric", minute: "2-digit" },
  )}`;

  if (showBlockForm) {
    return (
      <BlockTimeModal
        selection={selection}
        staff={staff}
        locations={locations}
        onClose={onClose}
        onBack={() => setShowBlockForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-sm bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
        <h2 className="mt-1 font-display text-xl text-charcoal">What would you like to do?</h2>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              const qs = new URLSearchParams({ date: selection.date, time: selection.time });
              if (selection.staffId) qs.set("staffId", selection.staffId);
              if (selection.locationId) qs.set("locationId", selection.locationId);
              router.push(`/dashboard/calendar/new?${qs.toString()}`);
            }}
            className="rounded-sm bg-charcoal px-5 py-3 text-left text-sm font-medium text-white transition hover:bg-charcoal-soft"
          >
            New Appointment
            <span className="block text-xs font-normal text-white/70">Book a client for this time</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBlockForm(true)}
            className="rounded-sm border border-border px-5 py-3 text-left text-sm font-medium text-charcoal transition hover:border-gold-deep"
          >
            Block Time
            <span className="block text-xs font-normal text-ink/60">Close this period to bookings</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-xs font-medium text-ink/50 underline underline-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
