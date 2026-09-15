"use client";

import Link from "next/link";
import { formatCents } from "@/lib/luxora/money";
import { METHOD_LABELS } from "@/lib/luxora/payments";
import { t, type Locale } from "@/lib/luxora/i18n";
import type { TransactionRow } from "@/lib/luxora/payments-data";

const STATUS_STYLES: Record<string, string> = {
  succeeded: "bg-cream-deep text-charcoal",
  pending: "border border-border text-ink/60",
  failed: "border border-danger text-danger",
  refunded: "border border-border text-ink/40 line-through",
  partially_refunded: "border border-gold-deep text-gold-deep",
};

const STATUSES = ["succeeded", "pending", "failed", "refunded", "partially_refunded"] as const;

function buildHref(params: Record<string, string | null | undefined>): string {
  const qs = new URLSearchParams();
  qs.set("tab", "transactions");
  for (const [k, v] of Object.entries(params)) {
    if (v) qs.set(k, v);
  }
  return `/dashboard/payments?${qs.toString()}`;
}

export function TransactionsTab({
  locale,
  transactions,
  currentFilter,
  currentMethod,
  currentStatus,
  isCustomRange,
  from,
  to,
}: {
  locale: Locale;
  transactions: TransactionRow[];
  currentFilter: string;
  currentMethod: string | null;
  currentStatus: string | null;
  isCustomRange: boolean;
  from: string | null;
  to: string | null;
}) {
  const filters = [
    { key: "today", label: t(locale, "pay_filter_today") },
    { key: "7", label: t(locale, "pay_filter_7d") },
    { key: "30", label: t(locale, "pay_filter_30d") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={buildHref({ period: f.key, method: currentMethod, status: currentStatus })}
              className={`rounded-sm border px-3 py-1.5 text-xs ${
                !isCustomRange && currentFilter === f.key ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <form className="flex items-center gap-2 text-sm" action="/dashboard/payments">
          <input type="hidden" name="tab" value="transactions" />
          <input type="date" name="from" defaultValue={isCustomRange ? from! : undefined} className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal" />
          <span className="text-ink/50">–</span>
          <input type="date" name="to" defaultValue={isCustomRange ? to! : undefined} className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal" />
          <button type="submit" className={`rounded-sm border px-3 py-1.5 text-xs font-medium ${isCustomRange ? "border-gold-deep bg-cream-deep text-charcoal" : "border-border text-charcoal"}`}>
            {t(locale, "pay_filter_custom")}
          </button>
        </form>

        <select
          defaultValue={currentMethod ?? ""}
          onChange={(e) => {
            window.location.href = buildHref({ period: currentFilter, method: e.target.value || null, status: currentStatus });
          }}
          className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal"
        >
          <option value="">{t(locale, "pay_filter_all_methods")}</option>
          {Object.entries(METHOD_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          defaultValue={currentStatus ?? ""}
          onChange={(e) => {
            window.location.href = buildHref({ period: currentFilter, method: currentMethod, status: e.target.value || null });
          }}
          className="rounded-sm border border-border bg-white px-2.5 py-1.5 text-xs text-charcoal"
        >
          <option value="">{t(locale, "pay_filter_all_status")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">{t(locale, "pay_col_date")}</th>
                <th className="px-4 py-3">{t(locale, "pay_col_client")}</th>
                <th className="px-4 py-3">{t(locale, "pay_col_method")}</th>
                <th className="px-4 py-3">{t(locale, "pay_col_tip")}</th>
                <th className="px-4 py-3">{t(locale, "pay_col_total")}</th>
                <th className="px-4 py-3">{t(locale, "pay_col_status")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-charcoal">{tx.clientName}</td>
                  <td className="px-4 py-3 text-ink">{tx.methodLabel}</td>
                  <td className="px-4 py-3 text-ink">{tx.tipCents > 0 ? formatCents(tx.tipCents) : "—"}</td>
                  <td className="px-4 py-3 text-charcoal">{formatCents(tx.totalCents)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[tx.status] ?? ""}`}
                      title={tx.refundReason ? `Refund reason: ${tx.refundReason}` : undefined}
                    >
                      {tx.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/payments/transactions/${tx.id}`} className="text-xs font-medium text-gold-deep underline underline-offset-2">
                      {locale === "es" ? "Ver" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">{t(locale, "pay_no_transactions")}</p>
      )}
    </div>
  );
}
