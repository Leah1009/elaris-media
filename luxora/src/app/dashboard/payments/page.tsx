import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { METHOD_LABELS } from "@/lib/luxora/payments";
import { RefundForm } from "@/components/refund-form";

const STATUS_STYLES: Record<string, string> = {
  succeeded: "bg-cream-deep text-charcoal",
  pending: "border border-border text-ink/60",
  failed: "border border-danger text-danger",
  refunded: "border border-border text-ink/40 line-through",
  partially_refunded: "border border-gold-deep text-gold-deep",
};

export default async function PaymentsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select("id, created_at, method, status, total_cents, tip_cents, client:client_id(full_name)")
    .eq("business_id", ctx.business.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const totalCollected = (payments ?? [])
    .filter((p) => p.status === "succeeded" || p.status === "partially_refunded")
    .reduce((sum, p) => sum + p.total_cents, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Payments</h1>
        <p className="mt-1 text-sm text-ink">{formatCents(totalCollected)} collected (last 100 payments)</p>
      </div>

      {payments && payments.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-charcoal">
                    {(p.client as unknown as { full_name: string } | null)?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink">{METHOD_LABELS[p.method] ?? p.method}</td>
                  <td className="px-4 py-3 text-charcoal">{formatCents(p.total_cents)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[p.status] ?? ""}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "succeeded" ? (
                      <RefundForm paymentId={p.id} method={p.method} totalCents={p.total_cents} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No payments recorded yet. Payments appear here after checkout.
        </p>
      )}
    </div>
  );
}
