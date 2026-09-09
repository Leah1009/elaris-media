import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { setPromotionActive } from "@/lib/luxora/promotions-actions";
import { CreatePromotionForm } from "@/components/create-promotion-form";

export default async function PromotionsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("id, code, description, discount_type, discount_value, max_uses, uses_count, per_client_limit, active, valid_from, valid_to")
    .eq("business_id", ctx.business.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Promotions</h1>

      <CreatePromotionForm />

      <div className="overflow-x-auto rounded-sm border border-border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Uses</th>
              <th className="px-4 py-3">Window</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(promotions ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono text-charcoal">{p.code}</td>
                <td className="px-4 py-3 text-ink">
                  {p.discount_type === "percent" ? `${p.discount_value}%` : `$${p.discount_value}`}
                </td>
                <td className="px-4 py-3 text-ink">
                  {p.uses_count}
                  {p.max_uses ? ` / ${p.max_uses}` : ""}
                  {p.per_client_limit ? ` · ${p.per_client_limit}/client` : ""}
                </td>
                <td className="px-4 py-3 text-xs text-ink/60">
                  {p.valid_from ? new Date(p.valid_from).toLocaleDateString() : "—"}
                  {" – "}
                  {p.valid_to ? new Date(p.valid_to).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-ink">{p.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <form action={setPromotionActive}>
                    <input type="hidden" name="promotionId" value={p.id} />
                    <input type="hidden" name="active" value={(!p.active).toString()} />
                    <button type="submit" className="text-xs text-ink/60 underline underline-offset-2">
                      {p.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!promotions || promotions.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-ink/60">
                  No promotions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
