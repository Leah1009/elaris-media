"use client";

import { useActionState, useState } from "react";
import { updateEnabledManualMethods } from "@/lib/luxora/payment-methods-actions";
import { METHOD_LABELS, MANUAL_METHODS } from "@/lib/luxora/payments";
import { t, type Locale } from "@/lib/luxora/i18n";
import type { ActionState } from "@/lib/luxora/actions";
import type { PaymentAccountStatus } from "@/lib/luxora/payments-data";

export function PaymentMethodsTab({
  locale,
  accountStatus,
  enabledManualMethods,
  hasRegisteredDevice,
}: {
  locale: Locale;
  accountStatus: PaymentAccountStatus;
  enabledManualMethods: string[];
  hasRegisteredDevice: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateEnabledManualMethods, null);
  const [selected, setSelected] = useState<Set<string>>(new Set(enabledManualMethods));

  function toggle(method: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
  }

  const cardEnabled = accountStatus.account?.chargesEnabled ?? false;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink/70">{t(locale, "pay_methods_subtitle")}</p>

      <section className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_methods_card_section")}</h2>
        <div className="mt-4 flex flex-col gap-3">
          <StatusRow label={t(locale, "pay_card_payments")} enabled={cardEnabled} requirement={t(locale, "pay_methods_requires_stripe")} />
          <StatusRow label={t(locale, "hardware_tap_dash_headline")} enabled={false} requirement="Requires the Luxore mobile app, which doesn't exist yet." />
          <StatusRow label="Terminal" enabled={false} requirement={t(locale, "pay_methods_requires_device")} isDevice={hasRegisteredDevice} />
        </div>
      </section>

      <form action={formAction} className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_methods_other_section")}</h2>
        <div className="mt-4 flex flex-col gap-3">
          {MANUAL_METHODS.map((m) => (
            <label key={m} className="flex items-center justify-between text-sm">
              <span className="text-charcoal">{METHOD_LABELS[m]}</span>
              <input
                type="checkbox"
                name="methods"
                value={m}
                checked={selected.has(m)}
                onChange={() => toggle(m)}
                className="h-4 w-4 accent-gold-deep"
              />
            </label>
          ))}
        </div>
        {state?.error ? <p className="mt-3 text-sm text-danger">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
        >
          {pending ? t(locale, "saving_ellipsis") : t(locale, "save_changes")}
        </button>
      </form>
    </div>
  );
}

function StatusRow({
  label,
  enabled,
  requirement,
  isDevice,
}: {
  label: string;
  enabled: boolean;
  requirement: string;
  isDevice?: boolean;
}) {
  const active = isDevice !== undefined ? isDevice : enabled;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-charcoal">{label}</span>
      {active ? (
        <span className="flex items-center gap-1.5 font-medium text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Enabled
        </span>
      ) : (
        <span className="text-xs text-ink/50">{requirement}</span>
      )}
    </div>
  );
}
