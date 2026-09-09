import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { formatCents } from "@/lib/luxora/money";

export default async function ProductsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, category, retail_price_cents, quantity_on_hand, reorder_threshold, active")
    .eq("business_id", ctx.business.id)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="rounded-sm bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
        >
          Add Product
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const lowStock = p.quantity_on_hand <= p.reorder_threshold;
                return (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-charcoal">{p.name}</td>
                    <td className="px-4 py-3 text-ink">{p.category ?? "—"}</td>
                    <td className="px-4 py-3 text-ink">{formatCents(p.retail_price_cents)}</td>
                    <td className="px-4 py-3">
                      <span className={lowStock ? "font-medium text-danger" : "text-charcoal"}>
                        {p.quantity_on_hand}
                      </span>
                      {lowStock ? (
                        <span className="ml-2 rounded-full border border-danger px-2 py-0.5 text-[10px] text-danger">
                          Low Stock
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/products/${p.id}/edit`}
                        className="text-sm font-medium text-gold-deep underline underline-offset-2"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          No products yet. Add retail products or supplies to track inventory.
        </p>
      )}
    </div>
  );
}
