import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { MembershipPlanForm } from "@/components/membership-plan-form";
import { StartMembershipForm } from "@/components/start-membership-form";

export default async function MembershipsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: plans }, { data: services }, { data: clients }] = await Promise.all([
    supabase
      .from("membership_plans")
      .select("id, name, price_cents, billing_interval, active")
      .eq("business_id", ctx.business.id)
      .order("name"),
    supabase.from("services").select("id, name").eq("business_id", ctx.business.id).order("name"),
    supabase.from("clients").select("id, full_name").eq("business_id", ctx.business.id).order("full_name"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Memberships</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MembershipPlanForm services={services ?? []} />
        <StartMembershipForm plans={plans ?? []} clients={clients ?? []} />
      </div>

      {plans && plans.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Billing</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{p.name}</td>
                  <td className="px-4 py-3 text-ink">{formatCents(p.price_cents)}</td>
                  <td className="px-4 py-3 capitalize text-ink">{p.billing_interval}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No membership plans yet. Create one above.
        </p>
      )}
    </div>
  );
}
