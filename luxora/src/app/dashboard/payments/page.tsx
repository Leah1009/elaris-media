import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext, getActiveLocations } from "@/lib/luxora/business-context";
import { isStripeConfigured } from "@/lib/luxora/stripe";
import { refreshStripeAccountStatus } from "@/lib/luxora/stripe-actions";
import { t, type Locale } from "@/lib/luxora/i18n";
import {
  getPaymentAccountStatus,
  getPaymentSummary,
  getTransactions,
  getPayoutsData,
  type PaymentAccountStatus,
  type TransactionFilters,
} from "@/lib/luxora/payments-data";
import { PaymentsOverviewTab } from "@/components/payments/overview-tab";
import { TransactionsTab } from "@/components/payments/transactions-tab";
import { PaymentMethodsTab } from "@/components/payments/methods-tab";
import { PayoutsTab } from "@/components/payments/payouts-tab";
import { HardwareTab } from "@/components/payments/hardware-tab";

const TABS = ["overview", "transactions", "methods", "payouts", "hardware"] as const;
type Tab = (typeof TABS)[number];

type SearchParams = { tab?: string; period?: string; from?: string; to?: string; method?: string; status?: string };

function resolveTransactionFilters(sp: SearchParams): TransactionFilters {
  const isCustom = Boolean(sp.from && sp.to && /^\d{4}-\d{2}-\d{2}$/.test(sp.from) && /^\d{4}-\d{2}-\d{2}$/.test(sp.to));
  if (isCustom) {
    return {
      periodStart: new Date(`${sp.from}T00:00:00.000Z`).toISOString(),
      periodEnd: new Date(`${sp.to}T23:59:59.999Z`).toISOString(),
      method: sp.method || null,
      status: sp.status || null,
    };
  }
  const days: Record<string, number> = { today: 1, "7": 7, "30": 30 };
  const key = sp.period && days[sp.period] ? sp.period : "30";
  return {
    periodStart: new Date(Date.now() - days[key] * 86_400_000).toISOString(),
    periodEnd: null,
    method: sp.method || null,
    status: sp.status || null,
  };
}

async function renderOverview(
  supabase: SupabaseClient<Database>,
  businessId: string,
  timezone: string,
  locale: Locale,
  accountStatus: PaymentAccountStatus,
) {
  const [summary, recentTransactions] = await Promise.all([
    getPaymentSummary(supabase, businessId, timezone),
    getTransactions(supabase, businessId, { periodStart: null, periodEnd: null, method: null, status: null }, 8),
  ]);
  return <PaymentsOverviewTab locale={locale} accountStatus={accountStatus} summary={summary} recentTransactions={recentTransactions} />;
}

async function renderTransactions(supabase: SupabaseClient<Database>, businessId: string, locale: Locale, sp: SearchParams) {
  const filters = resolveTransactionFilters(sp);
  const transactions = await getTransactions(supabase, businessId, filters, 200);
  const isCustom = Boolean(sp.from && sp.to);
  return (
    <TransactionsTab
      locale={locale}
      transactions={transactions}
      currentFilter={isCustom ? "custom" : sp.period || "30"}
      currentMethod={sp.method || null}
      currentStatus={sp.status || null}
      isCustomRange={isCustom}
      from={sp.from || null}
      to={sp.to || null}
    />
  );
}

async function renderPayouts(supabase: SupabaseClient<Database>, businessId: string, locale: Locale) {
  const payouts = await getPayoutsData(supabase, businessId);
  return <PayoutsTab locale={locale} payouts={payouts} />;
}

async function renderHardware(supabase: SupabaseClient<Database>, businessId: string, locale: Locale) {
  const [{ data: products }, locations, { data: devicesRaw }] = await Promise.all([
    supabase.from("hardware_products_public").select("id, name, description, image_url, device_type, selling_price_cents"),
    getActiveLocations(businessId),
    supabase
      .from("business_devices")
      .select("id, label, device_type, status, location:location_id(name)")
      .eq("business_id", businessId),
  ]);

  const toProduct = (row: NonNullable<typeof products>[number]) => ({
    id: row.id!,
    name: row.name!,
    description: row.description,
    imageUrl: row.image_url,
    sellingPriceCents: row.selling_price_cents,
  });

  const cardReaders = (products ?? []).filter((p) => p.device_type === "card_reader").map(toProduct);
  const smartTerminals = (products ?? []).filter((p) => p.device_type === "smart_terminal").map(toProduct);

  const devices = (devicesRaw ?? []).map((d) => ({
    id: d.id,
    label: d.label,
    deviceType: d.device_type,
    locationName: (d.location as unknown as { name: string } | null)?.name ?? null,
    status: d.status,
  }));

  return <HardwareTab locale={locale} cardReaders={cardReaders} smartTerminals={smartTerminals} locations={locations} devices={devices} />;
}

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const ctx = await getBusinessContext();
  const supabase = await createClient();
  const locale: Locale = ctx.business.preferred_language;
  const tab: Tab = TABS.includes(sp.tab as Tab) ? (sp.tab as Tab) : "overview";

  if (isStripeConfigured()) {
    await refreshStripeAccountStatus();
  }
  const accountStatus = await getPaymentAccountStatus(supabase, ctx.business.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-charcoal">{t(locale, "nav_payments")}</h1>
        <p className="mt-1 text-sm text-ink/70">{t(locale, "payments_subtitle")}</p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((tb) => (
          <Link
            key={tb}
            href={`/dashboard/payments?tab=${tb}`}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === tb ? "border-gold-deep text-charcoal" : "border-transparent text-ink/60 hover:text-charcoal"
            }`}
          >
            {t(locale, `pay_tab_${tb}` as Parameters<typeof t>[1])}
          </Link>
        ))}
      </div>

      {tab === "overview" ? await renderOverview(supabase, ctx.business.id, ctx.business.timezone, locale, accountStatus) : null}
      {tab === "transactions" ? await renderTransactions(supabase, ctx.business.id, locale, sp) : null}
      {tab === "methods" ? (
        <PaymentMethodsTab
          locale={locale}
          accountStatus={accountStatus}
          enabledManualMethods={ctx.business.enabled_manual_methods}
          hasRegisteredDevice={false}
        />
      ) : null}
      {tab === "payouts" ? await renderPayouts(supabase, ctx.business.id, locale) : null}
      {tab === "hardware" ? await renderHardware(supabase, ctx.business.id, locale) : null}
    </div>
  );
}
