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
import type { CalendarAppointment, CalendarBlock } from "@/components/calendar-types";

export type { CalendarBlock };

export type DayHours = { openMinutes: number | null; closeMinutes: number | null; closed: boolean };

const ROW_HEIGHT_PX = 56;
const DEFAULT_OPEN_MIN = 8 * 60;
const DEFAULT_CLOSE_MIN = 20 * 60;

function minutesOfDayInTz(iso: string, tz: string): number {
  const [h, m] = formatInTimeZone(new Date(iso), tz, { hour: "2-digit", minute: "2-digit", hour12: false })
    .split(":")
    .map(Number);
  return h * 60 + m;
}

function formatHourLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${period}`;
}

function roundToStep(minutes: number, step = 15): number {
  return Math.max(0, Math.round(minutes / step) * step);
}

function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function CalendarWeekGrid({
  weekDates,
  weekdayLabels,
  hoursByDay,
  appointments,
  blocks,
  staff,
  locations,
  timezone,
  defaultLocationId,
}: {
  weekDates: string[];
  weekdayLabels: string[];
  hoursByDay: DayHours[];
  appointments: CalendarAppointment[];
  blocks: CalendarBlock[];
  staff: CalendarStaffOption[];
  locations: CalendarLocationOption[];
  timezone: string;
  defaultLocationId?: string;
}) {
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  let gridStart = DEFAULT_OPEN_MIN;
  let gridEnd = DEFAULT_CLOSE_MIN;
  for (const h of hoursByDay) {
    if (!h.closed && h.openMinutes != null) gridStart = Math.min(gridStart, h.openMinutes);
    if (!h.closed && h.closeMinutes != null) gridEnd = Math.max(gridEnd, h.closeMinutes);
  }
  for (const a of appointments) {
    const start = minutesOfDayInTz(a.startAt, timezone);
    const end = minutesOfDayInTz(a.endAt, timezone);
    gridStart = Math.min(gridStart, Math.floor(start / 60) * 60);
    gridEnd = Math.max(gridEnd, Math.ceil(end / 60) * 60);
  }
  gridStart = Math.max(0, gridStart);
  gridEnd = Math.min(24 * 60, gridEnd);
  const gridHeightPx = ((gridEnd - gridStart) / 60) * ROW_HEIGHT_PX;
  const hourMarks: number[] = [];
  for (let m = gridStart; m < gridEnd; m += 60) hourMarks.push(m);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, (CalendarAppointment & { startMin: number; endMin: number })[]>();
    for (const day of weekDates) map.set(day, []);
    for (const a of appointments) {
      const dayKey = formatInTimeZone(new Date(a.startAt), timezone, { year: "numeric", month: "2-digit", day: "2-digit" })
        .split("/")
        .reverse()
        .join("-");
      const list = map.get(dayKey);
      if (list) {
        list.push({ ...a, startMin: minutesOfDayInTz(a.startAt, timezone), endMin: minutesOfDayInTz(a.endAt, timezone) });
      }
    }
    return map;
  }, [appointments, weekDates, timezone]);

  const blocksByDay = useMemo(() => {
    const map = new Map<string, (CalendarBlock & { startMin: number; endMin: number })[]>();
    for (const day of weekDates) map.set(day, []);
    for (const b of blocks) {
      const dayKey = formatInTimeZone(new Date(b.startAt), timezone, { year: "numeric", month: "2-digit", day: "2-digit" })
        .split("/")
        .reverse()
        .join("-");
      const list = map.get(dayKey);
      if (list) {
        list.push({ ...b, startMin: minutesOfDayInTz(b.startAt, timezone), endMin: minutesOfDayInTz(b.endAt, timezone) });
      }
    }
    return map;
  }, [blocks, weekDates, timezone]);

  function openChoiceFromEvent(day: string, colIndex: number, clientY: number) {
    const col = columnRefs.current[colIndex];
    if (!col) return;
    const rect = col.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const minutes = gridStart + (offsetY / ROW_HEIGHT_PX) * 60;
    const rounded = roundToStep(minutes);
    const hh = String(Math.floor(rounded / 60)).padStart(2, "0");
    const mm = String(rounded % 60).padStart(2, "0");
    setSelection({ date: day, time: `${hh}:${mm}`, locationId: defaultLocationId });
  }

  return (
    <>
      <div className="overflow-x-auto rounded-sm border border-border bg-white">
        <div className="grid" style={{ gridTemplateColumns: `56px repeat(${weekDates.length}, minmax(120px, 1fr))` }}>
          <div className="border-b border-border bg-cream-deep" />
          {weekDates.map((day, i) => (
            <div key={day} className="border-b border-l border-border bg-cream-deep px-2 py-2 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink/60">{weekdayLabels[i]}</p>
              <p className="text-sm font-medium text-charcoal">{day.slice(5).replace("-", "/")}</p>
            </div>
          ))}

          <div className="relative" style={{ height: gridHeightPx }}>
            {hourMarks.map((m) => (
              <div
                key={m}
                className="absolute right-1 -translate-y-1/2 text-[10px] text-ink/50"
                style={{ top: ((m - gridStart) / 60) * ROW_HEIGHT_PX }}
              >
                {formatHourLabel(m)}
              </div>
            ))}
          </div>

          {weekDates.map((day, colIndex) => {
            const hours = hoursByDay[colIndex];
            const dayAppointments = appointmentsByDay.get(day) ?? [];
            const dayBlocks = blocksByDay.get(day) ?? [];
            return (
              <div
                key={day}
                ref={(el) => {
                  columnRefs.current[colIndex] = el;
                }}
                className="relative border-l border-border"
                style={{ height: gridHeightPx }}
                onDoubleClick={(e) => openChoiceFromEvent(day, colIndex, e.clientY)}
                onClick={(e) => {
                  if (isTouchDevice()) openChoiceFromEvent(day, colIndex, e.clientY);
                }}
              >
                {hours?.closed ? <div className="absolute inset-0 bg-cream-deep/60" /> : null}
                {hourMarks.map((m) => (
                  <div key={m} className="absolute left-0 right-0 border-t border-border/60" style={{ top: ((m - gridStart) / 60) * ROW_HEIGHT_PX }} />
                ))}

                {dayBlocks.map((b) => {
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

                {dayAppointments.map((a) => {
                  const top = ((a.startMin - gridStart) / 60) * ROW_HEIGHT_PX;
                  const height = Math.max(18, ((a.endMin - a.startMin) / 60) * ROW_HEIGHT_PX);
                  const color = a.services[0]?.color || "#a97142";
                  return (
                    <button
                      key={a.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(a);
                      }}
                      className="absolute left-1 right-1 overflow-hidden rounded-sm px-1.5 py-1 text-left text-[10px] shadow-sm transition hover:brightness-95"
                      style={{ top, height, backgroundColor: `${color}22`, borderLeft: `3px solid ${color}` }}
                    >
                      <p className="truncate font-medium text-charcoal">{a.client?.full_name ?? "Client"}</p>
                      <p className="truncate text-ink/70">{a.services.map((sv) => sv.name).join(", ")}</p>
                    </button>
                  );
                })}
              </div>
            );
          })}
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

      {selectedAppointment ? (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          timezone={timezone}
          onClose={() => setSelectedAppointment(null)}
        />
      ) : null}
    </>
  );
}
