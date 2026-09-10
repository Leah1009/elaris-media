import Link from "next/link";

export type MonthDayAppointment = { id: string; label: string; color: string };

export function CalendarMonthGrid({
  weeks,
  currentMonth,
  today,
  appointmentsByDay,
  closedDays,
}: {
  weeks: string[][];
  currentMonth: number;
  today: string;
  appointmentsByDay: Map<string, MonthDayAppointment[]>;
  closedDays: Set<string>;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-white">
      <div className="grid grid-cols-7 border-b border-border bg-cream-deep">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-2 py-2 text-center text-[10px] font-medium uppercase tracking-wide text-ink/60">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-border last:border-0">
          {week.map((day) => {
            const dayNum = Number(day.slice(8, 10));
            const inMonth = Number(day.slice(5, 7)) === currentMonth;
            const items = appointmentsByDay.get(day) ?? [];
            const isToday = day === today;
            const isClosed = closedDays.has(day);
            return (
              <Link
                key={day}
                href={`/dashboard/calendar?view=day&date=${day}`}
                className={`flex min-h-[6.5rem] flex-col gap-1 border-l border-border p-1.5 text-left first:border-l-0 hover:bg-cream-deep/40 ${
                  inMonth ? "bg-white" : "bg-cream-deep/20"
                } ${isClosed ? "bg-cream-deep/50" : ""}`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    isToday ? "bg-gold-deep text-white" : inMonth ? "text-charcoal" : "text-ink/30"
                  }`}
                >
                  {dayNum}
                </span>
                <div className="flex flex-col gap-0.5">
                  {items.slice(0, 3).map((item) => (
                    <span
                      key={item.id}
                      className="truncate rounded-sm px-1 py-px text-[9px] text-charcoal"
                      style={{ backgroundColor: `${item.color}33` }}
                    >
                      {item.label}
                    </span>
                  ))}
                  {items.length > 3 ? <span className="text-[9px] text-ink/50">+{items.length - 3} more</span> : null}
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
