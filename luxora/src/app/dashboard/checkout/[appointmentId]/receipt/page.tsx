import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { METHOD_LABELS } from "@/lib/luxora/payments";

export default async function ReceiptPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("services_cents, discount_cents, tax_cents, tip_cents, total_cents, method, created_at")
    .eq("appointment_id", appointmentId)
    .eq("business_id", ctx.business.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!payment) notFound();

  return (
    <div className="mx-auto max-w-sm text-center">
      <h1 className="font-display text-2xl text-charcoal">Payment Received</h1>
      <div className="mt-6 rounded-sm border border-border bg-white p-6 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-ink">Services</span>
          <span className="text-charcoal">{formatCents(payment.services_cents)}</span>
        </div>
        {payment.discount_cents > 0 ? (
          <div className="flex justify-between">
            <span className="text-ink">Discount</span>
            <span className="text-charcoal">-{formatCents(payment.discount_cents)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span className="text-ink">Tax</span>
          <span className="text-charcoal">{formatCents(payment.tax_cents)}</span>
        </div>
        {payment.tip_cents > 0 ? (
          <div className="flex justify-between">
            <span className="text-ink">Tip</span>
            <span className="text-charcoal">{formatCents(payment.tip_cents)}</span>
          </div>
        ) : null}
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-medium text-charcoal">
          <span>Total ({METHOD_LABELS[payment.method] ?? payment.method})</span>
          <span>{formatCents(payment.total_cents)}</span>
        </div>
      </div>
      <Link
        href="/dashboard/calendar"
        className="mt-6 inline-block rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
      >
        Back to Calendar
      </Link>
    </div>
  );
}
