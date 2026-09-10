/**
 * Neutral device silhouettes — not renders of any real or Luxore-branded
 * product. No logo is placed on any device; hardware is unbranded and
 * generic on purpose (see hardware-catalog.ts).
 */

export function PhoneTapMock() {
  return (
    <div className="relative flex h-40 items-center justify-center">
      <div className="h-32 w-20 rounded-2xl border-4 border-charcoal/80 bg-charcoal shadow-xl shadow-charcoal/20">
        <div className="mx-auto mt-2 h-1 w-6 rounded-full bg-cream/30" />
      </div>
      <span
        className="absolute h-20 w-20 rounded-full border border-gold/40 motion-safe:animate-ping"
        style={{ animationDuration: "2.5s" }}
      />
      <span className="absolute h-14 w-14 rounded-full border border-gold/50" />
    </div>
  );
}

export function CardReaderMock() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-16 w-28 rounded-lg border-4 border-charcoal/80 bg-cream-deep shadow-xl shadow-charcoal/20">
        <div className="mx-3 mt-3 h-2 w-14 rounded-full bg-charcoal/20" />
        <div className="mx-3 mt-2 h-6 w-8 rounded-sm bg-charcoal/15" />
      </div>
    </div>
  );
}

export function SmartTerminalMock() {
  return (
    <div className="flex h-40 items-end justify-center">
      <div className="h-28 w-24 rounded-t-lg border-4 border-b-0 border-charcoal/80 bg-charcoal shadow-xl shadow-charcoal/20">
        <div className="mx-2 mt-3 h-16 rounded-sm bg-cream/10" />
      </div>
      <div className="-ml-1 h-3 w-32 rounded-b-md bg-charcoal/80" />
    </div>
  );
}
