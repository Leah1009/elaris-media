import { createClient } from "@/lib/supabase/server";
import { AdminPlanForm } from "@/components/admin-plan-form";
import { AdminEntitlementForm, type EntitlementValue } from "@/components/admin-entitlement-form";

export default async function AdminPlansPage() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase.rpc("admin_list_plans");

  if (error) {
    return <p className="text-sm text-danger">Could not load plans: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Plans</h1>
        <p className="mt-1 text-sm text-ink/70">
          Pricing and feature limits live here, not in code — every business&apos;s entitlements are read from
          this table at request time.
        </p>
      </div>

      {(plans ?? []).map((plan) => (
        <section key={plan.id} className="rounded-sm border border-border bg-white p-5">
          <AdminPlanForm plan={plan} />

          <div className="mt-4 border-t border-border pt-3">
            <h3 className="text-sm font-medium text-charcoal">Entitlements</h3>
            <div className="mt-2 flex flex-col">
              {((plan.entitlements as unknown as EntitlementValue[]) ?? []).map((e) => (
                <AdminEntitlementForm key={e.key} planId={plan.id} entitlement={e} />
              ))}
              <div className="border-t border-border pt-2">
                <p className="mb-1 text-xs text-ink/50">Add a new entitlement key</p>
                <AdminEntitlementForm planId={plan.id} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
