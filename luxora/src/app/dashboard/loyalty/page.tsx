import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { LoyaltySettingsForm } from "@/components/loyalty-settings-form";

export default async function LoyaltyPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: program }, { data: topClients }] = await Promise.all([
    supabase
      .from("loyalty_programs")
      .select("enabled, cents_spent_per_point, point_value_cents, min_redeem_points")
      .eq("business_id", ctx.business.id)
      .maybeSingle(),
    supabase
      .from("client_loyalty_points")
      .select("points_balance, client:client_id(full_name)")
      .eq("business_id", ctx.business.id)
      .gt("points_balance", 0)
      .order("points_balance", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Loyalty</h1>

      <LoyaltySettingsForm program={program ?? null} />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg text-charcoal">Client balances</h2>
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Points</th>
              </tr>
            </thead>
            <tbody>
              {(topClients ?? []).map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{row.client?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal">{row.points_balance}</td>
                </tr>
              ))}
              {(!topClients || topClients.length === 0) && (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-ink/60">
                    No points earned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
