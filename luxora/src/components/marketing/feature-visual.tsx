import { SERVICE_COLOR_PALETTE } from "@/lib/luxora/service-colors";

const barBase = "rounded-sm";

export function BookingsVisual() {
  return (
    <div className="flex h-20 items-end gap-1.5 rounded-sm border border-border bg-cream-deep/40 p-3">
      {[40, 70, 55, 90, 35].map((h, i) => (
        <div
          key={i}
          className={barBase}
          style={{ height: `${h}%`, width: 10, backgroundColor: `${SERVICE_COLOR_PALETTE[i % SERVICE_COLOR_PALETTE.length]}55` }}
        />
      ))}
      <span className="ml-auto self-start rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-medium text-gold-deep">24/7</span>
    </div>
  );
}

export function ClientsVisual() {
  return (
    <div className="flex h-20 flex-col justify-center gap-1.5 rounded-sm border border-border bg-cream-deep/40 p-3">
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 shrink-0 rounded-full bg-gold-deep/20" />
        <div className="h-1.5 w-24 rounded-full bg-charcoal/15" />
      </div>
      <div className="ml-8 h-1.5 w-32 rounded-full bg-charcoal/10" />
      <div className="ml-8 h-1.5 w-20 rounded-full bg-charcoal/10" />
    </div>
  );
}

export function PaymentsVisual() {
  return (
    <div className="flex h-20 items-center justify-between rounded-sm border border-border bg-cream-deep/40 p-3">
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-16 rounded-full bg-charcoal/15" />
        <div className="h-1.5 w-10 rounded-full bg-charcoal/10" />
      </div>
      <span className="rounded-sm bg-charcoal px-3 py-1.5 text-[10px] font-medium text-white">$85.00</span>
    </div>
  );
}

export function InventoryVisual() {
  return (
    <div className="flex h-20 flex-col justify-center gap-1.5 rounded-sm border border-border bg-cream-deep/40 p-3">
      {[
        { w: "80%", low: false },
        { w: "25%", low: true },
        { w: "55%", low: false },
      ].map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-charcoal/10">
            <div
              className={`h-1.5 rounded-full ${row.low ? "bg-danger/60" : "bg-gold-deep/50"}`}
              style={{ width: row.w }}
            />
          </div>
          {row.low ? <span className="text-[8px] font-medium text-danger">Low</span> : null}
        </div>
      ))}
    </div>
  );
}

export function MarketingVisual() {
  return (
    <div className="flex h-20 items-center gap-2 rounded-sm border border-border bg-cream-deep/40 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm">✉</div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-1.5 w-full rounded-full bg-charcoal/15" />
        <div className="h-1.5 w-2/3 rounded-full bg-charcoal/10" />
      </div>
    </div>
  );
}

export function WebsiteVisual() {
  return (
    <div className="flex h-20 gap-1.5 rounded-sm border border-border bg-cream-deep/40 p-3">
      {SERVICE_COLOR_PALETTE.slice(0, 3).map((c, i) => (
        <div key={i} className="flex-1 overflow-hidden rounded-sm border border-border/60 bg-white">
          <div className="h-3.5" style={{ backgroundColor: `${c}55` }} />
          <div className="p-1.5">
            <div className="h-1 w-3/4 rounded-full bg-charcoal/15" />
          </div>
        </div>
      ))}
    </div>
  );
}
