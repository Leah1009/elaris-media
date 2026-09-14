import { t, type Locale, type TranslationKey } from "@/lib/luxora/i18n";

const FAQ_KEYS: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "faq_q1", a: "faq_a1" },
  { q: "faq_q2", a: "faq_a2" },
  { q: "faq_q3", a: "faq_a3" },
  { q: "faq_q4", a: "faq_a4" },
  { q: "faq_q5", a: "faq_a5" },
  { q: "faq_q6", a: "faq_a6" },
  { q: "faq_q7", a: "faq_a7" },
  { q: "faq_q8", a: "faq_a8" },
  { q: "faq_q9", a: "faq_a9" },
];

export function Faq({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-border">
      {FAQ_KEYS.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-charcoal">
            {t(locale, item.q)}
            <span className="shrink-0 text-xl text-gold-deep transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink">{t(locale, item.a)}</p>
        </details>
      ))}
    </div>
  );
}
