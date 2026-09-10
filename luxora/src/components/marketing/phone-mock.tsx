export function PhoneMock() {
  return (
    <div className="mx-auto w-56 rounded-[2rem] border-8 border-charcoal bg-charcoal p-1.5 shadow-2xl shadow-charcoal/20 sm:w-64">
      <div className="overflow-hidden rounded-[1.4rem] bg-cream">
        <div className="bg-charcoal px-4 pb-3 pt-5 text-center">
          <span className="font-display text-[9px] uppercase tracking-[0.3em] text-gold">Book with</span>
          <p className="font-display text-sm text-white">Studio Example</p>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink/50">Select a time</p>
          {["9:00 AM", "10:30 AM", "1:00 PM", "3:15 PM"].map((slot, i) => (
            <div
              key={slot}
              className={`rounded-sm border px-3 py-2 text-xs ${
                i === 1 ? "border-gold-deep bg-gold/10 text-charcoal" : "border-border text-ink"
              }`}
            >
              {slot}
            </div>
          ))}
          <span className="mt-1 rounded-sm bg-charcoal px-3 py-2 text-center text-xs font-medium text-white">
            Confirm Booking
          </span>
        </div>
      </div>
    </div>
  );
}
