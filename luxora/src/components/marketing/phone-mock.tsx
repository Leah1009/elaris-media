import { t, type Locale } from "@/lib/luxora/i18n";

/**
 * A large, realistic smartphone frame (thin bezel, dynamic-island notch,
 * correct screen-to-body ratio) around a static replica of the real online
 * booking wizard — same headings and slot-button classes as
 * booking-wizard.tsx. Deliberately life-size rather than a small decorative
 * rectangle: the product itself is meant to be legible.
 */
const SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "3:15 PM", "4:00 PM", "5:30 PM"];

export function PhoneMock({ locale }: { locale: Locale }) {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[360px]">
      <div className="relative rounded-[3rem] bg-charcoal p-[10px] shadow-[0_35px_60px_-15px_rgba(27,24,21,0.45)]">
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10" />
        <div className="overflow-hidden rounded-[2.4rem] bg-cream">
          <div className="relative bg-charcoal px-6 pb-5 pt-8 text-center">
            <div className="absolute left-1/2 top-2.5 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">{t(locale, "book_with")}</span>
            <p className="mt-0.5 font-display text-lg text-white">Studio Example</p>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <p className="font-display text-base text-charcoal">{t(locale, "wiz_step3_title")}</p>
            <div className="w-fit rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal">
              Tomorrow
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((slot, i) => (
                <span
                  key={slot}
                  className={`rounded-sm border px-3 py-2.5 text-center text-sm ${
                    i === 1 ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border bg-white text-charcoal"
                  }`}
                >
                  {slot}
                </span>
              ))}
            </div>
            <span className="mt-2 rounded-sm bg-charcoal px-4 py-3 text-center text-sm font-medium text-white">
              {t(locale, "continue_button")}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -left-[11px] top-28 h-10 w-[3px] rounded-l-full bg-charcoal/80" />
      <div className="absolute -left-[11px] top-44 h-16 w-[3px] rounded-l-full bg-charcoal/80" />
      <div className="absolute -right-[11px] top-36 h-20 w-[3px] rounded-r-full bg-charcoal/80" />
    </div>
  );
}
