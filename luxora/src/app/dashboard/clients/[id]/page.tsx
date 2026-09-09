import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";
import { usePackageSession } from "@/lib/luxora/packages-actions";
import { useMembershipService } from "@/lib/luxora/memberships-actions";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select(
      "id, full_name, phone, email, birthday, address_line1, city, state, zip, notes, total_visits, lifetime_spend_cents, first_visit_at, last_visit_at",
    )
    .eq("id", id)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!client) notFound();

  const { data: tagAssignments } = await supabase
    .from("client_tag_assignments")
    .select("client_tags(name)")
    .eq("client_id", id);

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, start_at, status, staff:staff_id(full_name)")
    .eq("client_id", id)
    .order("start_at", { ascending: false })
    .limit(20);

  const { data: activePackages } = await supabase
    .from("client_packages")
    .select("id, sessions_remaining, status, package_plan:package_plan_id(name, total_sessions)")
    .eq("client_id", id)
    .eq("status", "active")
    .order("purchased_at", { ascending: false });

  const { data: activeMembership } = await supabase
    .from("client_memberships")
    .select("id, current_period_start, current_period_end, membership_plan:membership_plan_id(id, name)")
    .eq("client_id", id)
    .eq("status", "active")
    .order("current_period_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  let membershipServices: { service_id: string; name: string; quantity_per_period: number; used: number }[] = [];
  if (activeMembership) {
    const planId = (activeMembership.membership_plan as unknown as { id: string } | null)?.id;
    const { data: planServices } = await supabase
      .from("membership_plan_services")
      .select("service_id, quantity_per_period, service:service_id(name)")
      .eq("membership_plan_id", planId ?? "");

    // Only count usage since the current period started — otherwise a
    // renewal would inherit the previous period's usage against its quota.
    const { data: periodUsages } = await supabase
      .from("membership_usages")
      .select("service_id")
      .eq("client_membership_id", activeMembership.id)
      .gte("used_at", activeMembership.current_period_start);

    membershipServices = (planServices ?? []).map((ps) => ({
      service_id: ps.service_id,
      name: (ps.service as unknown as { name: string } | null)?.name ?? "Service",
      quantity_per_period: ps.quantity_per_period,
      used: (periodUsages ?? []).filter((u) => u.service_id === ps.service_id).length,
    }));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{client.full_name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {(tagAssignments ?? []).map((t, i) => (
              <span key={i} className="rounded-full bg-cream-deep px-2.5 py-0.5 text-xs text-charcoal">
                {(t.client_tags as unknown as { name: string } | null)?.name}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/dashboard/clients/${client.id}/edit`}
          className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-charcoal transition hover:border-gold-deep"
        >
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/60">Total Visits</p>
          <p className="mt-1 font-display text-2xl text-charcoal">{client.total_visits}</p>
        </div>
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/60">Lifetime Spend</p>
          <p className="mt-1 font-display text-2xl text-charcoal">
            {formatCents(client.lifetime_spend_cents)}
          </p>
        </div>
        <div className="rounded-sm border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/60">Last Visit</p>
          <p className="mt-1 font-display text-2xl text-charcoal">
            {client.last_visit_at ? new Date(client.last_visit_at).toLocaleDateString() : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">Contact</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-ink/60">Phone</dt>
            <dd className="text-charcoal">{client.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink/60">Email</dt>
            <dd className="text-charcoal">{client.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink/60">Birthday</dt>
            <dd className="text-charcoal">{client.birthday ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink/60">Address</dt>
            <dd className="text-charcoal">
              {client.address_line1
                ? `${client.address_line1}, ${client.city ?? ""} ${client.state ?? ""} ${client.zip ?? ""}`
                : "—"}
            </dd>
          </div>
        </dl>
        {client.notes ? (
          <div className="mt-4 border-t border-border pt-4">
            <dt className="text-sm text-ink/60">Notes</dt>
            <dd className="mt-1 text-sm text-charcoal">{client.notes}</dd>
          </div>
        ) : null}
      </div>

      {activeMembership ? (
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">
            {(activeMembership.membership_plan as unknown as { name: string } | null)?.name}
          </h2>
          <p className="text-xs text-ink/60">
            Renews {new Date(activeMembership.current_period_end).toLocaleDateString()}
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {membershipServices.map((ms) => (
              <li key={ms.service_id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-charcoal">{ms.name}</span>
                <span className="text-ink">
                  {ms.used} / {ms.quantity_per_period} used this period
                </span>
                <form action={useMembershipService}>
                  <input type="hidden" name="clientMembershipId" value={activeMembership.id} />
                  <input type="hidden" name="serviceId" value={ms.service_id} />
                  <button
                    type="submit"
                    disabled={ms.used >= ms.quantity_per_period}
                    className="text-xs font-medium text-gold-deep underline underline-offset-2 disabled:opacity-40"
                  >
                    Use
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {activePackages && activePackages.length > 0 ? (
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-display text-lg text-charcoal">Active Packages</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {activePackages.map((cp) => (
              <li key={cp.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-charcoal">
                  {(cp.package_plan as unknown as { name: string } | null)?.name}
                </span>
                <span className="text-ink">{cp.sessions_remaining} sessions left</span>
                <form action={usePackageSession}>
                  <input type="hidden" name="clientPackageId" value={cp.id} />
                  <button
                    type="submit"
                    disabled={cp.sessions_remaining <= 0}
                    className="text-xs font-medium text-gold-deep underline underline-offset-2 disabled:opacity-40"
                  >
                    Use Session
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">Appointment History</h2>
        {appointments && appointments.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {appointments.map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-charcoal">{new Date(a.start_at).toLocaleString()}</span>
                <span className="text-ink">
                  {(a.staff as unknown as { full_name: string } | null)?.full_name ?? "—"}
                </span>
                <span className="capitalize text-ink">{a.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-ink">No appointments yet.</p>
        )}
      </div>
    </div>
  );
}
