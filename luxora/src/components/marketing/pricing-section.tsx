import Link from "next/link";
import { Reveal } from "@/components/reveal";

type Entitlements = Map<string, { boolean: boolean | null; integer: number | null; text: string | null }>;

const FEATURE_ROWS: { key: string; label: string; format: (v: { boolean: boolean | null; integer: number | null }) => string }[] = [
  { key: "staff_limit", label: "Staff members", format: (v) => (v.integer != null ? String(v.integer) : "—") },
  { key: "location_limit", label: "Locations", format: (v) => (v.integer != null ? String(v.integer) : "—") },
  { key: "sms_monthly_limit", label: "SMS messages / month", format: (v) => (v.integer != null ? v.integer.toLocaleString() : "—") },
  { key: "feature_two_way_messaging", label: "Two-way messaging", format: (v) => (v.boolean ? "✓" : "—") },
  { key: "feature_advanced_reports", label: "Advanced reports", format: (v) => (v.boolean ? "✓" : "—") },
  { key: "feature_multi_location", label: "Multi-location support", format: (v) => (v.boolean ? "✓" : "—") },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function PricingSection({
  plans,
  entitlementsByPlan,
}: {
  plans: { id: string; name: string; price_monthly_cents: number; badge: string | null }[];
  entitlementsByPlan: Map<string, Entitlements>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {plans.map((plan, i) => {
        const entitlements = entitlementsByPlan.get(plan.id) ?? new Map();
        const isPopular = plan.badge === "MOST_POPULAR";
        return (
          <Reveal key={plan.id} delayMs={i * 100}>
            <div
              className={`relative h-full rounded-md border bg-white p-7 ${
                isPopular ? "border-gold-deep shadow-lg shadow-gold-deep/10" : "border-border"
              }`}
            >
              {isPopular ? (
                <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              ) : null}
              <h3 className="font-display text-xl text-charcoal">{plan.name}</h3>
              <p className="mt-2 font-display text-4xl text-charcoal">
                {formatPrice(plan.price_monthly_cents)}
                <span className="text-sm font-normal text-ink"> /month</span>
              </p>

              <dl className="mt-6 flex flex-col gap-2.5 border-t border-border pt-5 text-sm">
                {FEATURE_ROWS.map((row) => (
                  <div key={row.key} className="flex items-center justify-between">
                    <dt className="text-ink/70">{row.label}</dt>
                    <dd className="font-medium text-charcoal">
                      {row.format(entitlements.get(row.key) ?? { boolean: null, integer: null })}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/register"
                className={`mt-7 block w-full rounded-sm px-4 py-2.5 text-center text-sm font-medium tracking-wide transition ${
                  isPopular ? "bg-charcoal text-white hover:bg-charcoal-soft" : "border border-border text-charcoal hover:border-gold-deep"
                }`}
              >
                Start Your Free Month
              </Link>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
