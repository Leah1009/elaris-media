import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";

export default async function StaffPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: staff } = await supabase
    .from("staff")
    .select("id, full_name, title, email, phone, active")
    .eq("business_id", ctx.business.id)
    .order("full_name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Staff</h1>
        <Link
          href="/dashboard/staff/new"
          className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
        >
          Add Staff
        </Link>
      </div>

      {staff && staff.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-charcoal">{s.full_name}</td>
                  <td className="px-4 py-3 text-ink">{s.title ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">{s.email ?? s.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        s.active
                          ? "rounded-full bg-cream-deep px-2 py-0.5 text-xs text-charcoal"
                          : "rounded-full border border-border px-2 py-0.5 text-xs text-ink/50"
                      }
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/staff/${s.id}/edit`}
                      className="text-sm font-medium text-gold-deep underline underline-offset-2"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No staff yet. Add your team so you can start booking appointments.
        </p>
      )}
    </div>
  );
}
