import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { dateStrInTimeZone, zonedTimeToUtc } from "@/lib/luxora/timezone";
import { METHOD_LABELS, CARD_METHODS } from "@/lib/luxora/payments";
import { getStripeClient, isStripeConfigured } from "@/lib/luxora/stripe";

export type PaymentAccountStatus = {
  configured: boolean;
  account: { chargesEnabled: boolean; payoutsEnabled: boolean; detailsSubmitted: boolean } | null;
  bankLast4: string | null;
};

/**
 * The one place that turns "is Stripe connected" into what the owner sees
 * — never assumes success just because a row exists; charges_enabled is
 * the real signal. Bank last4 is fetched live from Stripe on each view
 * rather than stored, since Luxore never persists bank details itself.
 */
export async function getPaymentAccountStatus(
  supabase: SupabaseClient<Database>,
  businessId: string,
): Promise<PaymentAccountStatus> {
  if (!isStripeConfigured()) {
    return { configured: false, account: null, bankLast4: null };
  }

  const { data: connected } = await supabase
    .from("stripe_connected_accounts")
    .select("stripe_account_id, charges_enabled, payouts_enabled, details_submitted")
    .eq("business_id", businessId)
    .maybeSingle();

  if (!connected) {
    return { configured: true, account: null, bankLast4: null };
  }

  let bankLast4: string | null = null;
  if (connected.payouts_enabled) {
    try {
      const stripe = getStripeClient();
      const externalAccounts = await stripe.accounts.listExternalAccounts(connected.stripe_account_id, {
        object: "bank_account",
        limit: 1,
      });
      const bank = externalAccounts.data[0] as { last4?: string } | undefined;
      bankLast4 = bank?.last4 ?? null;
    } catch {
      bankLast4 = null;
    }
  }

  return {
    configured: true,
    account: {
      chargesEnabled: connected.charges_enabled,
      payoutsEnabled: connected.payouts_enabled,
      detailsSubmitted: connected.details_submitted,
    },
    bankLast4,
  };
}

export type PaymentSummary = {
  collectedTodayCents: number;
  collectedThisWeekCents: number;
  tipsThisWeekCents: number;
  refundsThisWeekCents: number;
};

/** Week = the current business-timezone calendar week, Monday through today. */
export async function getPaymentSummary(
  supabase: SupabaseClient<Database>,
  businessId: string,
  timezone: string,
): Promise<PaymentSummary> {
  const now = new Date();
  const todayStr = dateStrInTimeZone(now, timezone);
  const todayStart = zonedTimeToUtc(todayStr, "00:00", timezone).toISOString();

  const dayOfWeek = new Date(`${todayStr}T00:00:00Z`).getUTCDay(); // 0=Sun
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const mondayDate = new Date(`${todayStr}T00:00:00Z`);
  mondayDate.setUTCDate(mondayDate.getUTCDate() - daysSinceMonday);
  const mondayStr = mondayDate.toISOString().slice(0, 10);
  const weekStart = zonedTimeToUtc(mondayStr, "00:00", timezone).toISOString();

  const [{ data: todayPayments }, { data: weekPayments }, { data: weekRefunds }] = await Promise.all([
    supabase
      .from("payments")
      .select("total_cents")
      .eq("business_id", businessId)
      .in("status", ["succeeded", "partially_refunded"])
      .gte("created_at", todayStart),
    supabase
      .from("payments")
      .select("total_cents, tip_cents")
      .eq("business_id", businessId)
      .in("status", ["succeeded", "partially_refunded"])
      .gte("created_at", weekStart),
    supabase.from("refunds").select("amount_cents").eq("business_id", businessId).gte("created_at", weekStart),
  ]);

  return {
    collectedTodayCents: (todayPayments ?? []).reduce((s, p) => s + p.total_cents, 0),
    collectedThisWeekCents: (weekPayments ?? []).reduce((s, p) => s + p.total_cents, 0),
    tipsThisWeekCents: (weekPayments ?? []).reduce((s, p) => s + p.tip_cents, 0),
    refundsThisWeekCents: (weekRefunds ?? []).reduce((s, r) => s + r.amount_cents, 0),
  };
}

export type TransactionRow = {
  id: string;
  createdAt: string;
  clientName: string;
  method: string;
  methodLabel: string;
  isIntegrated: boolean;
  totalCents: number;
  tipCents: number;
  status: string;
  refundReason: string | null;
};

export type TransactionFilters = {
  periodStart: string | null;
  periodEnd: string | null;
  method: string | null;
  status: string | null;
};

export async function getTransactions(
  supabase: SupabaseClient<Database>,
  businessId: string,
  filters: TransactionFilters,
  limit = 100,
): Promise<TransactionRow[]> {
  let query = supabase
    .from("payments")
    .select("id, created_at, method, status, total_cents, tip_cents, client:client_id(full_name)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.periodStart) query = query.gte("created_at", filters.periodStart);
  if (filters.periodEnd) query = query.lte("created_at", filters.periodEnd);
  if (filters.method) query = query.eq("method", filters.method);
  if (filters.status) query = query.eq("status", filters.status);

  const { data: payments } = await query;
  const paymentIds = (payments ?? []).map((p) => p.id);
  const { data: refundRows } = paymentIds.length
    ? await supabase.from("refunds").select("payment_id, reason").in("payment_id", paymentIds)
    : { data: [] };
  const reasonByPayment = new Map((refundRows ?? []).map((r) => [r.payment_id, r.reason]));

  return (payments ?? []).map((p) => ({
    id: p.id,
    createdAt: p.created_at,
    clientName: (p.client as unknown as { full_name: string } | null)?.full_name ?? "—",
    method: p.method,
    methodLabel: METHOD_LABELS[p.method] ?? p.method,
    isIntegrated: (CARD_METHODS as readonly string[]).includes(p.method),
    totalCents: p.total_cents,
    tipCents: p.tip_cents,
    status: p.status,
    refundReason: reasonByPayment.get(p.id) ?? null,
  }));
}

export type PayoutsData = {
  availableCents: number | null;
  pendingCents: number | null;
  payouts: { id: string; amountCents: number; status: string; arrivalDate: string | null }[];
};

/** Real Stripe Balance + Payouts for the connected account — null fields mean "not connected," never a fabricated $0. */
export async function getPayoutsData(
  supabase: SupabaseClient<Database>,
  businessId: string,
): Promise<PayoutsData | null> {
  if (!isStripeConfigured()) return null;

  const { data: connected } = await supabase
    .from("stripe_connected_accounts")
    .select("stripe_account_id, payouts_enabled")
    .eq("business_id", businessId)
    .maybeSingle();
  if (!connected?.payouts_enabled) return null;

  try {
    const stripe = getStripeClient();
    const [balance, payoutsList] = await Promise.all([
      stripe.balance.retrieve({}, { stripeAccount: connected.stripe_account_id }),
      stripe.payouts.list({ limit: 10 }, { stripeAccount: connected.stripe_account_id }),
    ]);

    const availableCents = balance.available.reduce((s, b) => s + b.amount, 0);
    const pendingCents = balance.pending.reduce((s, b) => s + b.amount, 0);

    return {
      availableCents,
      pendingCents,
      payouts: payoutsList.data.map((p) => ({
        id: p.id,
        amountCents: p.amount,
        status: p.status,
        arrivalDate: p.arrival_date ? new Date(p.arrival_date * 1000).toISOString() : null,
      })),
    };
  } catch {
    return null;
  }
}
