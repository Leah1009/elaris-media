import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";
import type { PayoutsData } from "@/lib/luxora/payments-data";

export function PayoutsTab({ locale, payouts }: { locale: Locale; payouts: PayoutsData | null }) {
  if (!payouts) {
    return (
      <div className="rounded-sm border border-border bg-white p-6">
        <p className="text-sm text-ink">{t(locale, "pay_payouts_not_connected")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "pay_payouts_available")}</p>
          <p className="mt-1 font-display text-xl text-charcoal">
            {payouts.availableCents !== null ? formatCents(payouts.availableCents) : "—"}
          </p>
        </div>
        <div className="rounded-sm border border-border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "pay_payouts_pending")}</p>
          <p className="mt-1 font-display text-xl text-charcoal">
            {payouts.pendingCents !== null ? formatCents(payouts.pendingCents) : "—"}
          </p>
        </div>
      </div>

      <section className="rounded-sm border border-border bg-white">
        <h2 className="p-5 pb-0 font-display text-lg text-charcoal">{t(locale, "pay_payouts_next")}</h2>
        {payouts.payouts.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-5 py-3">{t(locale, "pay_col_date")}</th>
                  <th className="px-5 py-3">{t(locale, "pay_col_amount")}</th>
                  <th className="px-5 py-3">{t(locale, "pay_col_status")}</th>
                </tr>
              </thead>
              <tbody>
                {payouts.payouts.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-ink">{p.arrivalDate ? new Date(p.arrivalDate).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3 text-charcoal">{formatCents(p.amountCents)}</td>
                    <td className="px-5 py-3 capitalize text-ink">{p.status.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-5 text-sm text-ink/60">{t(locale, "pay_payouts_none")}</p>
        )}
      </section>
    </div>
  );
}
