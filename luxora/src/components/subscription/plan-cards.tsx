"use client";

import { Fragment, useState } from "react";
import { formatCents } from "@/lib/luxora/money";
import { t, type Locale, type TranslationKey } from "@/lib/luxora/i18n";

type Plan = {
  id: string;
  key: string;
  name: string;
  price_monthly_cents: number;
  badge: string | null;
};

type EntitlementMap = Map<string, { boolean: boolean | null; integer: number | null; text: string | null }>;

const PLAN_DESC_KEY: Record<string, TranslationKey> = {
  starter: "plan_starter_desc",
  pro: "plan_pro_desc",
  business: "plan_business_desc",
};

const PLAN_HIGHLIGHTS: Record<string, TranslationKey[]> = {
  starter: [
    "plan_feature_online_booking",
    "plan_feature_calendar_clients",
    "plan_feature_payments",
    "plan_feature_website",
    "plan_feature_basic_reports",
  ],
  pro: [
    "everything_in_starter",
    "plan_feature_all_templates",
    "plan_feature_two_way",
    "plan_feature_marketing",
    "plan_feature_advanced_automations",
    "plan_feature_advanced_reports",
  ],
  business: [
    "everything_in_pro",
    "plan_feature_multi_location",
    "plan_feature_consolidated_reporting",
    "plan_feature_expanded_team",
    "plan_feature_priority_support",
  ],
};

const COMPARISON_ROWS: { category: TranslationKey; rows: { label: TranslationKey; key: string }[] }[] = [
  {
    category: "category_core_business",
    rows: [
      { label: "plan_staff_count", key: "staff_limit" },
      { label: "plan_locations_count", key: "location_limit" },
    ],
  },
  {
    category: "category_communication",
    rows: [
      { label: "plan_sms_count", key: "sms_monthly_limit" },
      { label: "plan_feature_two_way", key: "feature_two_way_messaging" },
    ],
  },
  {
    category: "category_reporting",
    rows: [{ label: "plan_feature_advanced_reports", key: "feature_advanced_reports" }],
  },
  {
    category: "category_business_scale",
    rows: [{ label: "plan_feature_multi_location", key: "feature_multi_location" }],
  },
  {
    category: "category_website",
    rows: [{ label: "plan_feature_all_templates", key: "feature_all_templates" }],
  },
];

function formatEntitlement(v: { boolean: boolean | null; integer: number | null; text: string | null } | undefined): string {
  if (!v) return "—";
  if (v.integer !== null) return v.integer.toLocaleString();
  if (v.boolean !== null) return v.boolean ? "✓" : "—";
  return v.text ?? "—";
}

export function PlanCards({
  locale,
  plans,
  entitlementsByPlan,
  currentPlanId,
  isActiveSubscriber,
}: {
  locale: Locale;
  plans: Plan[];
  entitlementsByPlan: Record<string, EntitlementMap>;
  currentPlanId: string | null;
  isActiveSubscriber: boolean;
}) {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-charcoal">{t(locale, "choose_your_plan_title")}</h2>
        <p className="mt-1 text-sm text-ink/70">{t(locale, "choose_your_plan_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = isActiveSubscriber && plan.id === currentPlanId;
          const entitlements = entitlementsByPlan[plan.id] ?? new Map();
          const staffLimit = entitlements.get("staff_limit")?.integer;
          const locationLimit = entitlements.get("location_limit")?.integer;
          const smsLimit = entitlements.get("sms_monthly_limit")?.integer;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-sm border bg-white p-6 ${
                isCurrent ? "border-gold-deep ring-1 ring-gold-deep" : plan.badge === "MOST_POPULAR" ? "border-gold-deep/50" : "border-border"
              }`}
            >
              {isCurrent ? (
                <span className="absolute -top-3 right-6 rounded-full bg-charcoal px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {t(locale, "current_plan_badge")}
                </span>
              ) : plan.badge === "MOST_POPULAR" ? (
                <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {t(locale, "most_popular_badge")}
                </span>
              ) : null}

              <h3 className="font-display text-xl text-charcoal">{plan.name}</h3>
              <p className="mt-2 font-display text-3xl text-charcoal">
                {formatCents(plan.price_monthly_cents)}
                <span className="text-sm font-normal text-ink">{t(locale, "per_month")}</span>
              </p>
              <p className="mt-2 text-sm text-ink/70">{t(locale, PLAN_DESC_KEY[plan.key] ?? "plan_starter_desc")}</p>

              <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-sm text-ink/70">
                {staffLimit != null ? (
                  <span>
                    {staffLimit} {t(locale, staffLimit === 1 ? "plan_staff_count" : "plan_staff_count")}
                  </span>
                ) : null}
                {locationLimit != null ? (
                  <span>
                    {locationLimit} {t(locale, locationLimit === 1 ? "plan_location_count" : "plan_locations_count")}
                  </span>
                ) : null}
                {smsLimit != null ? (
                  <span>
                    {smsLimit.toLocaleString()} {t(locale, "plan_sms_count")}
                  </span>
                ) : null}
              </div>

              <ul className="mt-4 flex flex-1 flex-col gap-1.5 border-t border-border pt-4 text-sm">
                {(PLAN_HIGHLIGHTS[plan.key] ?? []).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-charcoal">
                    <span className="text-gold-deep">✓</span>
                    {t(locale, key)}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled
                title={isCurrent ? undefined : t(locale, "choose_plan_unavailable_tooltip")}
                className={`mt-6 w-full rounded-sm border px-4 py-2.5 text-sm font-medium ${
                  isCurrent ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-ink/50"
                }`}
              >
                {isCurrent ? t(locale, "current_plan_badge") : `${t(locale, "choose_plan_button")} ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowComparison((v) => !v)}
        className="self-center text-sm font-medium text-gold-deep underline underline-offset-2"
      >
        {showComparison ? t(locale, "hide_comparison") : t(locale, "compare_all_features")}
      </button>

      {showComparison ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Feature</th>
                {plans.map((p) => (
                  <th key={p.id} className="px-4 py-3">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((section) => (
                <Fragment key={section.category}>
                  <tr className="border-b border-border bg-cream-deep">
                    <td colSpan={plans.length + 1} className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink/60">
                      {t(locale, section.category)}
                    </td>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.key} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 text-charcoal">{t(locale, row.label)}</td>
                      {plans.map((p) => (
                        <td key={p.id} className="px-4 py-2.5 text-ink">
                          {formatEntitlement(entitlementsByPlan[p.id]?.get(row.key))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
