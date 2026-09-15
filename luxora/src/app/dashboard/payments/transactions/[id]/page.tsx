import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { METHOD_LABELS, CARD_METHODS } from "@/lib/luxora/payments";
import { isStripeConfigured, getStripeClient } from "@/lib/luxora/stripe";
import { RefundForm } from "@/components/refund-form";

async function getCardDetails(paymentIntentId: string, stripeAccountId: string): Promise<{ brand: string; last4: string } | null> {
  if (!isStripeConfigured()) return null;
  try {
    const stripe = getStripeClient();
    const intent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      { expand: ["latest_charge"] },
      { stripeAccount: stripeAccountId },
    );
    const charge = intent.latest_charge;
    if (charge && typeof charge !== "string") {
      const card = charge.payment_method_details?.card;
      return card?.brand && card?.last4 ? { brand: card.brand, last4: card.last4 } : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select(
      "id, created_at, method, status, services_cents, products_cents, discount_cents, tax_cents, tip_cents, total_cents, stripe_payment_intent_id, appointment_id, client:client_id(full_name)",
    )
    .eq("id", id)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!payment) notFound();

  const { data: appointment } = payment.appointment_id
    ? await supabase
        .from("appointments")
        .select("staff:staff_id(full_name), location:location_id(name)")
        .eq("id", payment.appointment_id)
        .maybeSingle()
    : { data: null };

  const { data: services } = payment.appointment_id
    ? await supabase
        .from("appointment_services")
        .select("price_cents, service:service_id(name)")
        .eq("appointment_id", payment.appointment_id)
    : { data: [] };

  let cardDetails: { brand: string; last4: string } | null = null;
  if (payment.stripe_payment_intent_id && (CARD_METHODS as readonly string[]).includes(payment.method)) {
    const { data: connectedAccount } = await supabase
      .from("stripe_connected_accounts")
      .select("stripe_account_id")
      .eq("business_id", ctx.business.id)
      .maybeSingle();
    if (connectedAccount) {
      cardDetails = await getCardDetails(payment.stripe_payment_intent_id, connectedAccount.stripe_account_id);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Link href="/dashboard/payments?tab=transactions" className="text-xs text-ink/60 underline underline-offset-2">
        ← Back to Transactions
      </Link>

      <div>
        <h1 className="font-display text-2xl text-charcoal">Transaction</h1>
        <p className="mt-1 text-sm text-ink/70">{new Date(payment.created_at).toLocaleString()}</p>
      </div>

      <section className="rounded-sm border border-border bg-white p-6 text-sm">
        <div className="flex justify-between border-b border-border pb-3">
          <span className="text-ink/60">Client</span>
          <span className="text-charcoal">{(payment.client as unknown as { full_name: string } | null)?.full_name ?? "—"}</span>
        </div>
        {appointment?.staff ? (
          <div className="flex justify-between border-b border-border py-3">
            <span className="text-ink/60">Staff</span>
            <span className="text-charcoal">{(appointment.staff as unknown as { full_name: string }).full_name}</span>
          </div>
        ) : null}
        {appointment?.location ? (
          <div className="flex justify-between border-b border-border py-3">
            <span className="text-ink/60">Location</span>
            <span className="text-charcoal">{(appointment.location as unknown as { name: string }).name}</span>
          </div>
        ) : null}

        {services && services.length > 0 ? (
          <div className="border-b border-border py-3">
            <p className="text-ink/60">Services</p>
            <div className="mt-1.5 flex flex-col gap-1">
              {services.map((s, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-charcoal">{(s.service as unknown as { name: string } | null)?.name ?? "Service"}</span>
                  <span className="text-charcoal">{formatCents(s.price_cents)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex justify-between py-3">
          <span className="text-ink/60">Subtotal</span>
          <span className="text-charcoal">{formatCents(payment.services_cents + payment.products_cents)}</span>
        </div>
        {payment.discount_cents > 0 ? (
          <div className="flex justify-between py-1">
            <span className="text-ink/60">Discount</span>
            <span className="text-charcoal">-{formatCents(payment.discount_cents)}</span>
          </div>
        ) : null}
        <div className="flex justify-between py-1">
          <span className="text-ink/60">Tax</span>
          <span className="text-charcoal">{formatCents(payment.tax_cents)}</span>
        </div>
        {payment.tip_cents > 0 ? (
          <div className="flex justify-between py-1">
            <span className="text-ink/60">Tip</span>
            <span className="text-charcoal">{formatCents(payment.tip_cents)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-3 font-medium text-charcoal">
          <span>Total</span>
          <span>{formatCents(payment.total_cents)}</span>
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-3">
          <span className="text-ink/60">Method</span>
          <span className="text-charcoal">
            {METHOD_LABELS[payment.method] ?? payment.method}
            {cardDetails ? ` — ${cardDetails.brand.toUpperCase()} •••• ${cardDetails.last4}` : ""}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-ink/60">Status</span>
          <span className="capitalize text-charcoal">{payment.status.replace("_", " ")}</span>
        </div>
      </section>

      {payment.status === "succeeded" ? (
        <div className="rounded-sm border border-border bg-white p-6">
          <RefundForm paymentId={payment.id} method={payment.method} totalCents={payment.total_cents} />
        </div>
      ) : null}
    </div>
  );
}
