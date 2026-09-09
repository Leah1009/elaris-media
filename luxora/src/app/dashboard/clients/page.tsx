import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("id, full_name, phone, email, total_visits, last_visit_at")
    .eq("business_id", ctx.business.id)
    .order("full_name");

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: clients } = await query;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-charcoal">Clients</h1>
        <div className="flex gap-2">
        <Link
          href="/dashboard/clients/import"
          className="rounded-sm border border-border px-5 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold-deep"
        >
          Import Clients
        </Link>
        <Link
          href="/dashboard/clients/new"
          className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
        >
          Add Client
        </Link>
        </div>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone or email"
          className="w-full rounded-sm border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-gold-deep"
        />
      </form>

      {clients && clients.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Visits</th>
                <th className="px-4 py-3">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/clients/${c.id}`}
                      className="font-medium text-charcoal underline-offset-2 hover:underline"
                    >
                      {c.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink">{c.phone ?? c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">{c.total_visits}</td>
                  <td className="px-4 py-3 text-ink">
                    {c.last_visit_at ? new Date(c.last_visit_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          {q ? "No clients match your search." : "No clients yet. Add your first client."}
        </p>
      )}
    </div>
  );
}
