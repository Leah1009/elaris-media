import { SERVICE_COLOR_PALETTE } from "@/lib/luxora/service-colors";

/**
 * Static replicas of real Luxore screens (Client Profile, Checkout,
 * Inventory, Automations, public website) — same classes and structure as
 * their dashboard counterparts, presented as a clean elevated panel rather
 * than a fake browser window. No two sections use the identical treatment.
 */

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-md border border-border bg-white shadow-xl shadow-charcoal/10">{children}</div>;
}

export function ClientProfileMock() {
  return (
    <Panel>
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-xl text-charcoal">L. Alvarez</p>
            <div className="mt-2 flex gap-1.5">
              <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] text-charcoal">VIP</span>
              <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] text-charcoal">Color Client</span>
            </div>
          </div>
          <span className="rounded-sm border border-border px-3 py-1 text-xs text-charcoal">Edit</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-sm border border-border p-3">
            <p className="text-[10px] uppercase tracking-wide text-ink/50">Visits</p>
            <p className="mt-1 font-display text-lg text-charcoal">12</p>
          </div>
          <div className="rounded-sm border border-border p-3">
            <p className="text-[10px] uppercase tracking-wide text-ink/50">Lifetime</p>
            <p className="mt-1 font-display text-lg text-charcoal">$1,240</p>
          </div>
          <div className="rounded-sm border border-border p-3">
            <p className="text-[10px] uppercase tracking-wide text-ink/50">Last Visit</p>
            <p className="mt-1 font-display text-lg text-charcoal">3 wks</p>
          </div>
        </div>

        <div className="mt-4 rounded-sm border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
          ⚠ Allergies — sensitive to sulfates
        </div>

        <div className="mt-4 rounded-sm border border-border p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink/50">Recent Visit Notes</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-charcoal/10" />
          <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-charcoal/10" />
        </div>
      </div>
    </Panel>
  );
}

export function CheckoutMock() {
  const paymentMethods = [
    { label: "Card", live: true },
    { label: "Cash", live: true },
    { label: "Other", live: true },
    { label: "Tap to Pay", live: false },
    { label: "Terminal", live: false },
  ];

  return (
    <Panel>
      <div className="p-6 sm:p-7">
        <p className="text-sm font-medium text-charcoal">L. Alvarez</p>
        <div className="mt-3 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink">Balayage</span>
            <span className="text-charcoal">$165.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink">Retail — Shampoo 32oz</span>
            <span className="text-charcoal">$28.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink">Deposit applied</span>
            <span className="text-charcoal">−$50.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink">Discount</span>
            <span className="text-charcoal">−$10.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink">Tax</span>
            <span className="text-charcoal">$11.55</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink">Tip (20%)</span>
            <span className="text-charcoal">$28.60</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-medium text-charcoal">
            <span>Total</span>
            <span>$173.15</span>
          </div>
        </div>

        <p className="mt-5 text-[10px] font-medium uppercase tracking-wide text-ink/50">Payment Method</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {paymentMethods.map((m) => (
            <span
              key={m.label}
              className={`relative rounded-sm border px-2 py-2.5 text-center text-xs ${
                m.live ? (m.label === "Card" ? "border-gold-deep bg-gold/10 text-charcoal" : "border-border text-charcoal") : "border-border text-ink/35"
              }`}
            >
              {m.label}
              {!m.live ? (
                <span className="absolute -top-1.5 right-0.5 rounded-full bg-cream-deep px-1 py-px text-[7px] font-medium uppercase tracking-wide text-ink/50">
                  Soon
                </span>
              ) : null}
            </span>
          ))}
        </div>

        <span className="mt-5 block rounded-sm bg-charcoal px-4 py-3 text-center text-sm font-medium text-white">
          Charge Card $173.15
        </span>
      </div>
    </Panel>
  );
}

export function InventoryMock() {
  const rows = [
    { name: "Shampoo — 32oz", qty: 24, low: false },
    { name: "Developer 20vol", qty: 3, low: true },
    { name: "Nail Polish — Rose", qty: 18, low: false },
    { name: "Conditioner — 32oz", qty: 9, low: false },
  ];
  return (
    <Panel>
      <div className="p-6 sm:p-7">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-ink/50">
              <th className="pb-2.5">Product</th>
              <th className="pb-2.5">On Hand</th>
              <th className="pb-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border">
                <td className="py-2.5 text-charcoal">{r.name}</td>
                <td className="py-2.5 text-ink">{r.qty}</td>
                <td className="py-2.5">
                  {r.low ? (
                    <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-medium text-danger">Low stock</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function AutomationMock() {
  const items = [
    { label: "Appointment confirmed", body: "Sent automatically after booking" },
    { label: "Deposit reminder", body: "24 hours before the required deadline" },
    { label: "Review request", body: "Sent after a completed visit" },
  ];
  return (
    <Panel>
      <div className="flex flex-col gap-3 p-6 sm:p-7">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-sm border border-border p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm">✉</span>
            <div>
              <p className="text-sm font-medium text-charcoal">{item.label}</p>
              <p className="text-xs text-ink/60">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const WEBSITE_EXAMPLES = [
  { label: "Example: Hair Studio", accent: SERVICE_COLOR_PALETTE[0] },
  { label: "Example: Nail Salon", accent: SERVICE_COLOR_PALETTE[2] },
  { label: "Example: Lash Studio", accent: SERVICE_COLOR_PALETTE[4] },
];

export function WebsiteExamplesMock() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {WEBSITE_EXAMPLES.map((site) => (
        <div key={site.label} className="overflow-hidden rounded-md border border-border bg-white shadow-lg shadow-charcoal/10">
          <div className="h-24" style={{ backgroundColor: `${site.accent}33` }} />
          <div className="p-4">
            <div className="h-2 w-2/3 rounded-full bg-charcoal/15" />
            <div className="mt-2 h-1.5 w-1/2 rounded-full bg-charcoal/10" />
            <span
              className="mt-4 inline-block rounded-sm px-3 py-1.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: site.accent }}
            >
              Book Now
            </span>
            <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-ink/40">{site.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
