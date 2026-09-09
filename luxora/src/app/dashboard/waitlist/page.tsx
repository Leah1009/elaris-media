import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { AddWaitlistForm } from "@/components/add-waitlist-form";
import { WaitlistStatusForm } from "@/components/waitlist-status-form";

export default async function WaitlistPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: entries }, { data: services }, { data: staff }] = await Promise.all([
    supabase
      .from("waitlist")
      .select(
        "id, full_name, phone, email, status, preferred_date_start, preferred_date_end, service:service_id(name), preferred_staff:preferred_staff_id(full_name), created_at",
      )
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false }),
    supabase.from("services").select("id, name").eq("business_id", ctx.business.id).order("name"),
    supabase.from("staff").select("id, full_name").eq("business_id", ctx.business.id).order("full_name"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Waitlist</h1>

      <AddWaitlistForm services={services ?? []} staff={staff ?? []} />

      {entries && entries.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Window</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{e.full_name}</td>
                  <td className="px-4 py-3 text-ink">{e.phone ?? e.email ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">
                    {(e.service as unknown as { name: string } | null)?.name ?? "Any"}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {(e.preferred_staff as unknown as { full_name: string } | null)?.full_name ?? "Any"}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {e.preferred_date_start ? `${e.preferred_date_start} → ${e.preferred_date_end ?? "…"}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <WaitlistStatusForm waitlistId={e.id} currentStatus={e.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/dashboard/calendar/new"
                      className="text-xs font-medium text-gold-deep underline underline-offset-2"
                    >
                      Book
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No one on the waitlist right now.
        </p>
      )}
    </div>
  );
}
