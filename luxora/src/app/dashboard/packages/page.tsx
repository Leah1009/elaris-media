import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { PackagePlanForm } from "@/components/package-plan-form";
import { SellPackageForm } from "@/components/sell-package-form";

export default async function PackagesPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: plans }, { data: services }, { data: clients }] = await Promise.all([
    supabase
      .from("package_plans")
      .select("id, name, price_cents, total_sessions, active, service:service_id(name)")
      .eq("business_id", ctx.business.id)
      .order("name"),
    supabase.from("services").select("id, name").eq("business_id", ctx.business.id).order("name"),
    supabase.from("clients").select("id, full_name").eq("business_id", ctx.business.id).order("full_name"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Packages</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PackagePlanForm services={services ?? []} />
        <SellPackageForm plans={plans ?? []} clients={clients ?? []} />
      </div>

      {plans && plans.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{p.name}</td>
                  <td className="px-4 py-3 text-ink">
                    {(p.service as unknown as { name: string } | null)?.name ?? "Any"}
                  </td>
                  <td className="px-4 py-3 text-ink">{formatCents(p.price_cents)}</td>
                  <td className="px-4 py-3 text-ink">{p.total_sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No package plans yet. Create one above.
        </p>
      )}
    </div>
  );
}
