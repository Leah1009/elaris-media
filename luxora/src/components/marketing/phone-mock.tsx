import { t, type Locale } from "@/lib/luxora/i18n";

/**
 * A clean, chrome-free panel showing the real online booking wizard's
 * time-selection step — same heading and slot-button classes as
 * booking-wizard.tsx, same flat-panel treatment as the other real-UI
 * mockups on this page (no device frame).
 */
const SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "3:15 PM", "4:00 PM", "5:30 PM"];

export function PhoneMock({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-md border border-border bg-white shadow-xl shadow-charcoal/10">
      <div className="bg-charcoal px-6 py-5 text-center">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">{t(locale, "book_with")}</span>
        <p className="mt-0.5 font-display text-lg text-white">Studio Example</p>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <p className="font-display text-base text-charcoal">{t(locale, "wiz_step3_title")}</p>
        <div className="w-fit rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal">Tomorrow</div>
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
  );
}
