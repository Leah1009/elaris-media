import ScrollStage from "@/components/prototype/ScrollStage";

export default function PrototypePage() {
  return (
    <main className="bg-cream">
      <ScrollStage />
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream-deep px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
          End of prototype
        </span>
        <h2 className="max-w-lg font-display text-2xl text-ink">
          The full site will chain more chapters here — laptop, ads/analytics,
          then plain HTML sections for Dental Billing, Admin Services and the CTA.
        </h2>
      </section>
    </main>
  );
}
