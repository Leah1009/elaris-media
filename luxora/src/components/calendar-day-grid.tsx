"use client";

import { useMemo, useRef, useState } from "react";
import { formatInTimeZone } from "@/lib/luxora/timezone";
import { deleteAppointmentBlock } from "@/lib/luxora/appointment-blocks-actions";
import { AppointmentDetailModal } from "@/components/appointment-detail-modal";
import {
  CalendarCreateChoiceModal,
  type CalendarStaffOption,
  type CalendarLocationOption,
  type SlotSelection,
} from "@/components/calendar-create-choice-modal";
import type { CalendarStaff, CalendarAppointment, CalendarBlock } from "@/components/calendar-types";

export type { CalendarStaff, CalendarAppointment };

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

function roundToStep(minutes: number, step = 15): number {
  return Math.max(0, Math.round(minutes / step) * step);
}

function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function CalendarDayGrid({
  openTime,
  closeTime,
  staff,
  appointments,
  blocks,
  timezone,
  date,
  locations,
  defaultLocationId,
}: {
  openTime: string | null;
  closeTime: string | null;
  staff: CalendarStaff[];
  appointments: CalendarAppointment[];
  blocks: CalendarBlock[];
  timezone: string;
  date: string;
  locations: CalendarLocationOption[];
  defaultLocationId?: string;
}) {
  const [selected, setSelected] = useState<CalendarAppointment | null>(null);
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const enriched = useMemo(
    () =>
      appointments.map((a) => ({
        ...a,
        startMin: minutesOfDayInTz(a.startAt, timezone),
        endMin: minutesOfDayInTz(a.endAt, timezone),
      })),
    [appointments, timezone],
  );

  const enrichedBlocks = useMemo(
    () =>
      blocks.map((b) => ({
        ...b,
        startMin: minutesOfDayInTz(b.startAt, timezone),
        endMin: minutesOfDayInTz(b.endAt, timezone),
      })),
    [blocks, timezone],
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

  const columns: CalendarStaffOption[] = staff.length > 0 ? staff : [{ id: "__unassigned", full_name: "Unassigned" }];
  const gridHeightPx = ((gridEnd - gridStart) / 60) * ROW_HEIGHT_PX;

  function openChoiceFromEvent(colIndex: number, staffId: string, clientY: number) {
    const col = columnRefs.current[colIndex];
    if (!col) return;
    const rect = col.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const minutes = gridStart + (offsetY / ROW_HEIGHT_PX) * 60;
    const rounded = roundToStep(minutes);
    const hh = String(Math.floor(rounded / 60)).padStart(2, "0");
    const mm = String(rounded % 60).padStart(2, "0");
    setSelection({
      date,
      time: `${hh}:${mm}`,
      staffId: staffId === "__unassigned" ? undefined : staffId,
      locationId: defaultLocationId,
    });
  }

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

          {columns.map((s, colIndex) => (
            <div
              key={s.id}
              ref={(el) => {
                columnRefs.current[colIndex] = el;
              }}
              className="relative border-l border-border"
              style={{ height: gridHeightPx }}
              onDoubleClick={(e) => openChoiceFromEvent(colIndex, s.id, e.clientY)}
              onClick={(e) => {
                if (isTouchDevice()) openChoiceFromEvent(colIndex, s.id, e.clientY);
              }}
            >
              {hourMarks.map((m) => (
                <div
                  key={m}
                  className="absolute left-0 right-0 border-t border-border/60"
                  style={{ top: ((m - gridStart) / 60) * ROW_HEIGHT_PX }}
                />
              ))}

              {enrichedBlocks
                .filter((b) => b.staffId === s.id || b.staffId === null)
                .map((b) => {
                  const top = ((Math.max(b.startMin, gridStart) - gridStart) / 60) * ROW_HEIGHT_PX;
                  const height = Math.max(16, ((Math.min(b.endMin, gridEnd) - Math.max(b.startMin, gridStart)) / 60) * ROW_HEIGHT_PX);
                  return (
                    <button
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove this block${b.reason ? ` (${b.reason})` : ""}?`)) {
                          const fd = new FormData();
                          fd.set("blockId", b.id);
                          deleteAppointmentBlock(fd);
                        }
                      }}
                      className="absolute left-1 right-1 overflow-hidden rounded-sm border border-dashed border-ink/30 bg-[repeating-linear-gradient(45deg,rgba(74,66,56,0.06),rgba(74,66,56,0.06)_6px,transparent_6px,transparent_12px)] px-1.5 py-1 text-left text-[10px] text-ink/60"
                      style={{ top, height }}
                      title="Click to remove this block"
                    >
                      🚫 {b.reason || "Blocked"}
                    </button>
                  );
                })}

              {enriched
                .filter((a) => (staff.length > 0 ? a.staffId === s.id : true))
                .map((a) => {
                  const top = ((a.startMin - gridStart) / 60) * ROW_HEIGHT_PX;
                  const height = Math.max(20, ((a.endMin - a.startMin) / 60) * ROW_HEIGHT_PX);
                  const color = a.services[0]?.color || "#a97142";
                  return (
                    <button
                      key={a.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(a);
                      }}
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

      {selection ? (
        <CalendarCreateChoiceModal
          selection={selection}
          staff={staff}
          locations={locations}
          onClose={() => setSelection(null)}
        />
      ) : null}

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
