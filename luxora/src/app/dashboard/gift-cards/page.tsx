import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { SellGiftCardForm } from "@/components/sell-gift-card-form";

export default async function GiftCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ sold?: string }>;
}) {
  const { sold } = await searchParams;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: giftCards }, { data: clients }] = await Promise.all([
    supabase
      .from("gift_cards")
      .select("id, code, original_value_cents, remaining_balance_cents, recipient_name, status, created_at")
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, full_name").eq("business_id", ctx.business.id).order("full_name"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Gift Cards</h1>

      {sold ? (
        <div className="rounded-sm border border-gold-deep bg-cream-deep p-4 text-sm text-charcoal">
          Gift card created: <span className="font-mono font-medium">{sold}</span>
        </div>
      ) : null}

      <SellGiftCardForm clients={clients ?? []} />

      {giftCards && giftCards.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Original</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {giftCards.map((gc) => (
                <tr key={gc.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-charcoal">{gc.code}</td>
                  <td className="px-4 py-3 text-ink">{gc.recipient_name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">{formatCents(gc.original_value_cents)}</td>
                  <td className="px-4 py-3 text-charcoal">{formatCents(gc.remaining_balance_cents)}</td>
                  <td className="px-4 py-3 capitalize text-ink">{gc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
