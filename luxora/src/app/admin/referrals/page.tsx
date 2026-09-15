import { createClient } from "@/lib/supabase/server";
import { AdminReferralSettingsForm } from "@/components/admin-referral-settings-form";
import { markRewardIssued, rejectReward } from "@/lib/luxora/admin-referrals-actions";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  qualified: "Qualified — ready to pay out",
  issued: "Issued",
  rejected: "Rejected",
};

export default async function AdminReferralsPage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: rewards, error }] = await Promise.all([
    supabase.from("referral_program_settings").select("program_active, reward_amount_cents, reward_type").eq("id", true).single(),
    supabase
      .from("referral_rewards")
      .select(
        "id, amount_cents, reward_type, status, created_at, qualified_at, issued_at, notes, referrer_business_id, referral_id, businesses:referrer_business_id(name)",
      )
      .order("created_at", { ascending: false }),
  ]);

  if (error) {
    return <p className="text-sm text-danger">Could not load referral rewards: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Referrals</h1>
        <p className="mt-1 text-sm text-ink/70">
          Rewards move to &quot;Qualified&quot; automatically when a referred business&apos;s subscription is switched to
          active. Mark them issued once the payout is actually sent.
        </p>
      </div>

      {settings ? <AdminReferralSettingsForm settings={settings} /> : null}

      <div className="overflow-x-auto rounded-sm border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
              <th className="px-4 py-2.5">Referrer</th>
              <th className="px-4 py-2.5">Amount</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Created</th>
              <th className="px-4 py-2.5">Notes</th>
              <th className="px-4 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(rewards ?? []).map((r) => {
              const referrer = r.businesses as unknown as { name: string } | null;
              return (
                <tr key={r.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-2.5 text-charcoal">{referrer?.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-ink">${(r.amount_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-ink">{STATUS_LABEL[r.status] ?? r.status}</td>
                  <td className="px-4 py-2.5 text-ink/70">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-ink/70">{r.notes ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    {r.status === "qualified" ? (
                      <form action={markRewardIssued.bind(null, r.id)}>
                        <button type="submit" className="text-xs font-medium text-gold-deep underline underline-offset-2">
                          Mark Issued
                        </button>
                      </form>
                    ) : null}
                    {r.status === "pending" || r.status === "qualified" ? (
                      <form action={rejectReward} className="mt-1 flex items-center gap-1">
                        <input type="hidden" name="rewardId" value={r.id} />
                        <input
                          type="text"
                          name="reason"
                          placeholder="Reason"
                          className="w-24 rounded-sm border border-border px-1.5 py-0.5 text-xs"
                        />
                        <button type="submit" className="text-xs font-medium text-danger underline underline-offset-2">
                          Reject
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {(rewards ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink/60">
                  No referral activity yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
