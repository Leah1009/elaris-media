"use client";

import { useMemo, useState } from "react";
import { formatInTimeZone } from "@/lib/luxora/timezone";
import { AppointmentDetailModal } from "@/components/appointment-detail-modal";

export type CalendarStaff = { id: string; full_name: string };

export type CalendarAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  notes: string | null;
  staffId: string;
  depositStatus: string;
  depositAmountCents: number;
  depositPaidCents: number;
  client: {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    sms_consent: boolean;
    email_consent: boolean;
  } | null;
  services: { name: string; color: string }[];
  messages: { id: string; channel: string; body: string; status: string; createdAt: string }[];
};

const ROW_HEIGHT_PX = 64;
const DEFAULT_OPEN_MIN = 8 * 60;
const DEFAULT_CLOSE_MIN = 20 * 60;

const STATUS_STYLES: Record<string, string> = {
  pending: "border-l-4 border-l-ink/40",
  confirmed: "border-l-4 border-l-gold-deep",
  completed: "border-l-4 border-l-charcoal opacity-70",
  cancelled: "border-l-4 border-l-danger opacity-50 line-through",
  no_show: "border-l-4 border-l-danger",
};

function minutesOfDayInTz(iso: string, tz: string): number {
  const [h, m] = formatInTimeZone(new Date(iso), tz, { hour: "2-digit", minute: "2-digit", hour12: false })
    .split(":")
    .map(Number);
  return h * 60 + m;
}

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

export function CalendarDayGrid({
  openTime,
  closeTime,
  staff,
  appointments,
  timezone,
}: {
  openTime: string | null;
  closeTime: string | null;
  staff: CalendarStaff[];
  appointments: CalendarAppointment[];
  timezone: string;
  date: string;
}) {
  const [selected, setSelected] = useState<CalendarAppointment | null>(null);

  const enriched = useMemo(
    () =>
      appointments.map((a) => ({
        ...a,
        startMin: minutesOfDayInTz(a.startAt, timezone),
        endMin: minutesOfDayInTz(a.endAt, timezone),
      })),
    [appointments, timezone],
  );

  let gridStart = openTime ? parseTimeToMinutes(openTime) : DEFAULT_OPEN_MIN;
  let gridEnd = closeTime ? parseTimeToMinutes(closeTime) : DEFAULT_CLOSE_MIN;
  for (const a of enriched) {
    gridStart = Math.min(gridStart, Math.floor(a.startMin / 60) * 60);
    gridEnd = Math.max(gridEnd, Math.ceil(a.endMin / 60) * 60);
  }
  gridStart = Math.max(0, gridStart);
  gridEnd = Math.min(24 * 60, gridEnd);

  const hourMarks: number[] = [];
  for (let m = gridStart; m < gridEnd; m += 60) hourMarks.push(m);

  const columns = staff.length > 0 ? staff : [{ id: "__unassigned", full_name: "Unassigned" }];
  const gridHeightPx = ((gridEnd - gridStart) / 60) * ROW_HEIGHT_PX;

  return (
    <>
      <div className="overflow-x-auto rounded-sm border border-border bg-white">
        <div
          className="grid"
          style={{ gridTemplateColumns: `64px repeat(${columns.length}, minmax(160px, 1fr))` }}
        >
          <div className="border-b border-border bg-cream-deep" />
          {columns.map((s) => (
            <div
              key={s.id}
              className="border-b border-l border-border bg-cream-deep px-2 py-2 text-center text-xs font-medium text-charcoal"
            >
              {s.full_name}
            </div>
          ))}

          <div className="relative" style={{ height: gridHeightPx }}>
            {hourMarks.map((m) => (
              <div
                key={m}
                className="absolute right-1 -translate-y-1/2 text-[11px] text-ink/50"
                style={{ top: ((m - gridStart) / 60) * ROW_HEIGHT_PX }}
              >
                {formatHourLabel(m)}
              </div>
            ))}
          </div>

          {columns.map((s) => (
            <div key={s.id} className="relative border-l border-border" style={{ height: gridHeightPx }}>
              {hourMarks.map((m) => (
                <div
                  key={m}
                  className="absolute left-0 right-0 border-t border-border/60"
                  style={{ top: ((m - gridStart) / 60) * ROW_HEIGHT_PX }}
                />
              ))}
              {enriched
                .filter((a) => (staff.length > 0 ? a.staffId === s.id : true))
                .map((a) => {
                  const top = ((a.startMin - gridStart) / 60) * ROW_HEIGHT_PX;
                  const height = Math.max(20, ((a.endMin - a.startMin) / 60) * ROW_HEIGHT_PX);
                  const color = a.services[0]?.color || "#a97142";
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className={`absolute left-1 right-1 overflow-hidden rounded-sm px-2 py-1 text-left text-xs shadow-sm transition hover:brightness-95 ${STATUS_STYLES[a.status] ?? ""}`}
                      style={{ top, height, backgroundColor: `${color}22` }}
                    >
                      <p className="truncate font-medium text-charcoal">{a.client?.full_name ?? "Client"}</p>
                      <p className="truncate text-ink/70">{a.services.map((sv) => sv.name).join(", ")}</p>
                      <p className="text-[10px] text-ink/50">
                        {formatInTimeZone(new Date(a.startAt), timezone, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {selected ? (
        <AppointmentDetailModal
          appointment={selected}
          timezone={timezone}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
}

function formatHourLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${period}`;
}
