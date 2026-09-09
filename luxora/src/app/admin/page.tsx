import { createClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/luxora/money";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-ink/60">{label}</p>
      <p className="mt-1 font-display text-2xl text-charcoal">{value}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const { data: stats, error } = await supabase.rpc("admin_platform_stats").maybeSingle();

  if (error || !stats) {
    return <p className="text-sm text-danger">Could not load platform stats: {error?.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-charcoal">Platform Overview</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Businesses" value={String(stats.total_businesses)} />
        <StatCard label="Trialing" value={String(stats.trialing_count)} />
        <StatCard label="Active" value={String(stats.active_count)} />
        <StatCard label="Locked" value={String(stats.locked_count)} />
        <StatCard label="Est. MRR" value={formatCents(Number(stats.mrr_cents))} />
      </div>
    </div>
  );
}
