import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBusinessesPage() {
  const supabase = await createClient();
  const { data: businesses, error } = await supabase.rpc("admin_list_businesses");

  if (error) {
    return <p className="text-sm text-danger">Could not load businesses: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-charcoal">Businesses</h1>
      <div className="overflow-x-auto rounded-sm border border-border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Subscription</th>
              <th className="px-4 py-3">Trial Ends</th>
              <th className="px-4 py-3">Members</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(businesses ?? []).map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 hover:bg-cream-deep">
                <td className="px-4 py-3">
                  <Link href={`/admin/businesses/${b.id}`} className="font-medium text-charcoal underline underline-offset-2">
                    {b.name}
                  </Link>
                  <p className="text-xs text-ink/50">{b.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink capitalize">{b.business_type?.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-ink">{b.plan_name ?? "—"}</td>
                <td className="px-4 py-3 text-ink capitalize">{b.subscription_status ?? "—"}</td>
                <td className="px-4 py-3 text-ink">
                  {b.trial_ends_at ? new Date(b.trial_ends_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-ink">{b.member_count}</td>
                <td className="px-4 py-3">
                  {b.is_locked ? (
                    <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs text-danger">Locked</span>
                  ) : (
                    <span className="rounded-full bg-cream-deep px-2 py-0.5 text-xs text-charcoal">Active</span>
                  )}
                </td>
              </tr>
            ))}
            {(!businesses || businesses.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-ink/60">
                  No businesses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
