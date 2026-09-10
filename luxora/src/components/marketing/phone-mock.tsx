/**
 * A realistic phone frame around a static replica of the real online
 * booking wizard's time-selection step (see booking-wizard.tsx) — same
 * heading, same slot-button classes, same "Continue" button. No generic
 * black rounded rectangle.
 */
const SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "3:15 PM", "4:00 PM", "5:30 PM"];

export function PhoneMock() {
  return (
    <div className="mx-auto w-64 sm:w-72">
      <div className="relative rounded-[2.75rem] border-[3px] border-charcoal/90 bg-charcoal p-2 shadow-2xl shadow-charcoal/25">
        <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-charcoal" />
        <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l-full bg-charcoal/90" />
        <div className="absolute -right-[3px] top-20 h-12 w-[3px] rounded-r-full bg-charcoal/90" />

        <div className="overflow-hidden rounded-[2.25rem] bg-cream">
          <div className="bg-charcoal px-5 pb-4 pt-9 text-center">
            <span className="font-display text-[9px] uppercase tracking-[0.3em] text-gold">Book with</span>
            <p className="font-display text-base text-white">Studio Example</p>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <p className="font-display text-sm text-charcoal">3. Select Date &amp; Time</p>
            <div className="w-fit rounded-sm border border-border bg-white px-3 py-2 text-xs text-charcoal">
              Tomorrow
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SLOTS.map((slot, i) => (
                <span
                  key={slot}
                  className={`rounded-sm border px-2.5 py-2 text-center text-[11px] ${
                    i === 1 ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border bg-white text-charcoal"
                  }`}
                >
                  {slot}
                </span>
              ))}
            </div>
            <span className="mt-1 rounded-sm bg-charcoal px-4 py-2.5 text-center text-xs font-medium text-white">
              Continue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
