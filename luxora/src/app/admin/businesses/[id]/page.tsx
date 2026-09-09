import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setBusinessStatus } from "@/lib/luxora/platform-admin-actions";
import { AdminExtendTrialForm } from "@/components/admin-extend-trial-form";
import { AdminSubscriptionForm } from "@/components/admin-subscription-form";

export default async function AdminBusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: business }, { data: members }, { data: auditLogs }, { data: plans }] = await Promise.all([
    supabase.rpc("admin_get_business", { p_business_id: id }).maybeSingle(),
    supabase.rpc("admin_list_business_members", { p_business_id: id }),
    supabase.rpc("admin_list_audit_logs", { p_business_id: id, p_limit: 25 }),
    supabase.from("plans").select("id, name").order("display_order"),
  ]);

  if (!business) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">{business.name}</h1>
        <p className="text-sm text-ink/60">
          {business.slug} · {business.business_type?.replace(/_/g, " ")} · {business.email} · {business.phone}
        </p>
      </div>

      <section className="rounded-sm border border-border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-charcoal">Access</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              business.is_locked ? "bg-danger/10 text-danger" : "bg-cream-deep text-charcoal"
            }`}
          >
            {business.is_locked ? "Locked" : "Active"} ({business.status})
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          {(["active", "locked", "suspended"] as const).map((s) => (
            <form key={s} action={setBusinessStatus}>
              <input type="hidden" name="businessId" value={business.id} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                disabled={business.status === s}
                className="rounded-sm border border-border px-3 py-1.5 text-xs capitalize text-charcoal transition hover:bg-cream-deep disabled:opacity-40"
              >
                Set {s}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">Subscription</h2>
        <p className="mt-1 text-sm text-ink">
          {business.plan_name ?? "No plan"} · {business.subscription_status ?? "—"}
        </p>
        <div className="mt-3">
          <AdminSubscriptionForm
            businessId={business.id}
            currentPlanId={business.plan_id}
            currentStatus={business.subscription_status}
            plans={plans ?? []}
          />
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white p-5">
        <h2 className="font-display text-lg text-charcoal">Trial</h2>
        <p className="mt-1 text-sm text-ink">
          {business.trial_ends_at ? `Ends ${new Date(business.trial_ends_at).toLocaleDateString()}` : "No trial"}
        </p>
        <div className="mt-3">
          <AdminExtendTrialForm businessId={business.id} currentTrialEnd={business.trial_ends_at} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">Team</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(members ?? []).map((m) => (
                <tr key={m.profile_id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{m.full_name}</td>
                  <td className="px-4 py-3 text-ink capitalize">{m.role}</td>
                  <td className="px-4 py-3 text-ink capitalize">{m.status}</td>
                </tr>
              ))}
              {(!members || members.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-ink/60">
                    No members.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-charcoal">Audit Log</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">By</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {(auditLogs ?? []).map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{log.action}</td>
                  <td className="px-4 py-3 text-ink">{log.actor_name ?? "System"}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {(!auditLogs || auditLogs.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-ink/60">
                    No activity logged yet.
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
