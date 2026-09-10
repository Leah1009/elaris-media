import { SERVICE_COLOR_PALETTE } from "@/lib/luxora/service-colors";

/**
 * Illustrative product screenshots for the marketing site — built from the
 * same design tokens and layout patterns as the real dashboard (see
 * src/app/dashboard/page.tsx and calendar-day-grid.tsx) with representative
 * example data, not a claim about any real business's numbers.
 */

function BrowserChrome({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-2xl shadow-charcoal/10">
      <div className="flex items-center gap-2 border-b border-border bg-cream-deep px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 truncate text-[11px] text-ink/40">{label}</span>
      </div>
      {children}
    </div>
  );
}

const MOCK_APPOINTMENTS = [
  { time: "9:00 AM", client: "L. Alvarez", status: "Confirmed" },
  { time: "10:30 AM", client: "M. Chen", status: "Confirmed" },
  { time: "1:00 PM", client: "R. Diaz", status: "Pending" },
];

export function HeroDashboardCard() {
  return (
    <div className="w-full max-w-md">
      <BrowserChrome label="app.luxore.com/dashboard">
        <div className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-sm border border-border bg-white p-3">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">Today&apos;s Revenue</p>
              <p className="mt-1 font-display text-lg text-charcoal">$540</p>
            </div>
            <div className="rounded-sm border border-border bg-white p-3">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">Appointments</p>
              <p className="mt-1 font-display text-lg text-charcoal">8</p>
            </div>
            <div className="rounded-sm border border-border bg-white p-3">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">New Clients</p>
              <p className="mt-1 font-display text-lg text-charcoal">3</p>
            </div>
          </div>

          <div className="rounded-sm border border-border p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-ink/50">Today&apos;s Schedule</p>
            <div className="mt-2 flex flex-col gap-1.5">
              {MOCK_APPOINTMENTS.map((a) => (
                <div key={a.time} className="flex items-center justify-between border-b border-border/70 pb-1.5 text-xs last:border-0">
                  <span className="text-charcoal">{a.time}</span>
                  <span className="text-ink/70">{a.client}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] ${
                      a.status === "Confirmed" ? "bg-gold/20 text-gold-deep" : "bg-cream-deep text-charcoal"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
}

const MOCK_STAFF = ["Ava", "Jordan", "Sam"];
const MOCK_BLOCKS = [
  { staff: 0, top: 8, height: 46, color: SERVICE_COLOR_PALETTE[0], label: "Color · L. Alvarez" },
  { staff: 0, top: 62, height: 30, color: SERVICE_COLOR_PALETTE[2], label: "Blowout · K. Ross" },
  { staff: 1, top: 20, height: 60, color: SERVICE_COLOR_PALETTE[1], label: "Facial · M. Chen" },
  { staff: 2, top: 40, height: 36, color: SERVICE_COLOR_PALETTE[4], label: "Manicure · R. Diaz" },
];

export function FullDashboardMock() {
  return (
    <BrowserChrome label="app.luxore.com/dashboard/calendar">
      <div className="grid grid-cols-[auto_1fr]">
        <aside className="hidden w-40 shrink-0 border-r border-border bg-cream-deep/50 p-4 sm:block">
          <div className="flex flex-col gap-1 text-[11px] text-ink/60">
            <span className="rounded-sm bg-white px-2.5 py-1.5 font-medium text-charcoal shadow-sm">Calendar</span>
            <span className="px-2.5 py-1.5">Clients</span>
            <span className="px-2.5 py-1.5">Messages</span>
            <span className="mt-3 px-2.5 text-[9px] font-semibold uppercase tracking-wide text-gold-deep">Business</span>
            <span className="px-2.5 py-1.5">Services</span>
            <span className="px-2.5 py-1.5">Reports</span>
          </div>
        </aside>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-sm border border-border bg-white p-3">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">Today&apos;s Revenue</p>
              <p className="mt-1 font-display text-xl text-charcoal">$540</p>
            </div>
            <div className="rounded-sm border border-border bg-white p-3">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">Appointments</p>
              <p className="mt-1 font-display text-xl text-charcoal">8</p>
            </div>
            <div className="hidden rounded-sm border border-border bg-white p-3 sm:block">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">New Clients</p>
              <p className="mt-1 font-display text-xl text-charcoal">3</p>
            </div>
            <div className="hidden rounded-sm border border-border bg-white p-3 sm:block">
              <p className="text-[9px] uppercase tracking-wide text-ink/50">Completed</p>
              <p className="mt-1 font-display text-xl text-charcoal">5</p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-sm border border-border">
            <div className="grid" style={{ gridTemplateColumns: `44px repeat(${MOCK_STAFF.length}, 1fr)` }}>
              <div className="border-b border-border bg-cream-deep" />
              {MOCK_STAFF.map((s) => (
                <div key={s} className="border-b border-l border-border bg-cream-deep px-2 py-1.5 text-center text-[10px] font-medium text-charcoal">
                  {s}
                </div>
              ))}
              <div className="relative" style={{ height: 120 }}>
                {["9", "10", "11"].map((h, i) => (
                  <div key={h} className="absolute right-1 text-[8px] text-ink/40" style={{ top: i * 40 }}>
                    {h}a
                  </div>
                ))}
              </div>
              {MOCK_STAFF.map((_, staffIndex) => (
                <div key={staffIndex} className="relative border-l border-border" style={{ height: 120 }}>
                  {[0, 40, 80].map((y) => (
                    <div key={y} className="absolute left-0 right-0 border-t border-border/60" style={{ top: y }} />
                  ))}
                  {MOCK_BLOCKS.filter((b) => b.staff === staffIndex).map((b) => (
                    <div
                      key={b.label}
                      className="absolute left-1 right-1 rounded-sm px-1.5 py-1 text-[8px] font-medium text-charcoal"
                      style={{ top: b.top, height: b.height, backgroundColor: `${b.color}33` }}
                    >
                      {b.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}
