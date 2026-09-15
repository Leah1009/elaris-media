import Link from "next/link";
import { formatCents } from "@/lib/luxora/money";
import { t, type Locale } from "@/lib/luxora/i18n";
import { ConnectStripeButton } from "@/components/connect-stripe-button";
import { ManageStripeAccountButton } from "@/components/manage-stripe-account-button";
import type { PaymentAccountStatus, PaymentSummary, TransactionRow } from "@/lib/luxora/payments-data";

const SETUP_FEATURES = [
  "pay_setup_feature_card",
  "pay_setup_feature_tap",
  "pay_setup_feature_terminal",
  "pay_setup_feature_deposits",
  "pay_setup_feature_tips",
  "pay_setup_feature_refunds",
] as const;

export function PaymentsOverviewTab({
  locale,
  accountStatus,
  summary,
  recentTransactions,
}: {
  locale: Locale;
  accountStatus: PaymentAccountStatus;
  summary: PaymentSummary;
  recentTransactions: TransactionRow[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <AccountStatusCard locale={locale} status={accountStatus} />

      {accountStatus.account?.chargesEnabled || recentTransactions.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label={t(locale, "pay_collected_today")} value={formatCents(summary.collectedTodayCents)} />
          <SummaryCard label={t(locale, "pay_collected_week")} value={formatCents(summary.collectedThisWeekCents)} />
          <SummaryCard label={t(locale, "pay_tips_week")} value={formatCents(summary.tipsThisWeekCents)} />
          <SummaryCard label={t(locale, "pay_refunds_week")} value={formatCents(summary.refundsThisWeekCents)} />
        </div>
      ) : null}

      <section className="rounded-sm border border-border bg-white">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_recent_transactions")}</h2>
          <Link href="/dashboard/payments?tab=transactions" className="text-xs font-medium text-gold-deep underline underline-offset-2">
            {t(locale, "pay_view_all_transactions")}
          </Link>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                  <th className="px-5 py-3">{t(locale, "pay_col_date")}</th>
                  <th className="px-5 py-3">{t(locale, "pay_col_client")}</th>
                  <th className="px-5 py-3">{t(locale, "pay_col_method")}</th>
                  <th className="px-5 py-3">{t(locale, "pay_col_total")}</th>
                  <th className="px-5 py-3">{t(locale, "pay_col_status")}</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-ink">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-charcoal">{tx.clientName}</td>
                    <td className="px-5 py-3 text-ink">{tx.methodLabel}</td>
                    <td className="px-5 py-3 text-charcoal">{formatCents(tx.totalCents)}</td>
                    <td className="px-5 py-3 text-ink capitalize">{tx.status.replace("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-5 text-sm text-ink/60">{t(locale, "pay_no_transactions")}</p>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink/60">{label}</p>
      <p className="mt-1 font-display text-xl text-charcoal">{value}</p>
    </div>
  );
}

export function AccountStatusCard({ locale, status }: { locale: Locale; status: PaymentAccountStatus }) {
  if (!status.configured) {
    return (
      <section className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_setup_title")}</h2>
        <p className="mt-2 text-sm text-ink/70">{t(locale, "pay_setup_body")}</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink/70">
          {SETUP_FEATURES.map((key) => (
            <li key={key}>• {t(locale, key)}</li>
          ))}
        </ul>
        <div className="mt-5">
          <ConnectStripeButton label={t(locale, "pay_setup_cta")} />
        </div>
      </section>
    );
  }

  if (!status.account) {
    return (
      <section className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_account_title")}</h2>
        <p className="mt-2 text-sm text-charcoal">{t(locale, "pay_not_connected")}</p>
        <div className="mt-4">
          <ConnectStripeButton label={t(locale, "pay_setup_cta")} />
        </div>
      </section>
    );
  }

  if (!status.account.chargesEnabled) {
    return (
      <section className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_account_title")}</h2>
        <p className="mt-2 text-sm text-charcoal">{t(locale, "pay_details_pending")}</p>
        <div className="mt-4">
          <ConnectStripeButton label={t(locale, "pay_finish_setup")} />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-sm border border-border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "pay_account_title")}</h2>
        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t(locale, "pay_account_active")}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "pay_card_payments")}</dt>
          <dd className="mt-1 text-sm font-medium text-charcoal">{t(locale, "pay_enabled")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "pay_payouts_label")}</dt>
          <dd className="mt-1 text-sm font-medium text-charcoal">
            {status.account.payoutsEnabled ? t(locale, "pay_enabled") : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/60">{t(locale, "pay_bank_account")}</dt>
          <dd className="mt-1 text-sm font-medium text-charcoal">{status.bankLast4 ? `•••• ${status.bankLast4}` : "—"}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <ManageStripeAccountButton label={t(locale, "pay_manage_account")} />
      </div>
    </section>
  );
}
