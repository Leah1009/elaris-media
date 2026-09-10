import { SERVICE_COLOR_PALETTE } from "@/lib/luxora/service-colors";

/**
 * A large, static replica of the real dashboard/calendar screens — same
 * classes and layout as src/app/dashboard/page.tsx and calendar-day-grid.tsx,
 * fed representative example data instead of a live query, and with no
 * click handlers wired to real server actions (this renders on the public,
 * unauthenticated marketing page). No fake browser chrome, no illustrated
 * device — the product itself is the visual.
 */

const MOCK_APPOINTMENTS = [
  { time: "9:00 AM", client: "L. Alvarez", status: "Confirmed" },
  { time: "10:30 AM", client: "M. Chen", status: "Confirmed" },
  { time: "1:00 PM", client: "R. Diaz", status: "Pending" },
  { time: "3:15 PM", client: "K. Ross", status: "Confirmed" },
];

const MOCK_STAFF = ["Ava", "Jordan", "Sam"];
const MOCK_BLOCKS = [
  { staff: 0, top: 8, height: 92, color: SERVICE_COLOR_PALETTE[0], label: "Color", client: "L. Alvarez" },
  { staff: 0, top: 124, height: 60, color: SERVICE_COLOR_PALETTE[2], label: "Blowout", client: "K. Ross" },
  { staff: 1, top: 40, height: 120, color: SERVICE_COLOR_PALETTE[1], label: "Facial", client: "M. Chen" },
  { staff: 2, top: 80, height: 72, color: SERVICE_COLOR_PALETTE[4], label: "Manicure", client: "R. Diaz" },
  { staff: 2, top: 168, height: 56, color: SERVICE_COLOR_PALETTE[5], label: "Pedicure", client: "P. Herrera" },
];

export function FullDashboardMock() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-2xl shadow-charcoal/10">
      <div className="grid grid-cols-2 gap-3 border-b border-border p-5 sm:grid-cols-4 sm:p-8">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink/50 sm:text-xs">Today&apos;s Revenue</p>
          <p className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">$540</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink/50 sm:text-xs">Appointments</p>
          <p className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">8</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-wide text-ink/50">New Clients</p>
          <p className="mt-1 font-display text-3xl text-charcoal">3</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-wide text-ink/50">Completed</p>
          <p className="mt-1 font-display text-3xl text-charcoal">5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <div className="hidden border-r border-border bg-cream-deep/40 p-5 lg:block">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Today&apos;s Schedule</p>
          <div className="mt-4 flex flex-col gap-3">
            {MOCK_APPOINTMENTS.map((a) => (
              <div key={a.time} className="border-b border-border/70 pb-3 text-sm last:border-0">
                <p className="text-charcoal">{a.time}</p>
                <p className="text-ink/70">{a.client}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] ${
                    a.status === "Confirmed" ? "bg-gold/20 text-gold-deep" : "bg-cream-deep text-charcoal"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${MOCK_STAFF.length}, 1fr)` }}>
            <div className="border-b border-border bg-cream-deep" />
            {MOCK_STAFF.map((s) => (
              <div key={s} className="border-b border-l border-border bg-cream-deep px-2 py-2.5 text-center text-xs font-medium text-charcoal">
                {s}
              </div>
            ))}
            <div className="relative" style={{ height: 240 }}>
              {["9", "10", "11", "12"].map((h, i) => (
                <div key={h} className="absolute right-1.5 text-[10px] text-ink/40" style={{ top: i * 60 }}>
                  {h}:00
                </div>
              ))}
            </div>
            {MOCK_STAFF.map((_, staffIndex) => (
              <div key={staffIndex} className="relative border-l border-border" style={{ height: 240 }}>
                {[0, 60, 120, 180].map((y) => (
                  <div key={y} className="absolute left-0 right-0 border-t border-border/60" style={{ top: y }} />
                ))}
                {MOCK_BLOCKS.filter((b) => b.staff === staffIndex).map((b) => (
                  <div
                    key={`${b.label}-${b.top}`}
                    className="absolute left-1.5 right-1.5 overflow-hidden rounded-sm px-2 py-1.5 text-[11px] font-medium text-charcoal"
                    style={{ top: b.top, height: b.height, backgroundColor: `${b.color}26`, borderLeft: `3px solid ${b.color}` }}
                  >
                    <p className="truncate">{b.client}</p>
                    <p className="truncate text-[10px] text-ink/60">{b.label}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
