import { createClient } from "@/lib/supabase/server";
import { AdminHardwareProductForm } from "@/components/admin-hardware-product-form";

export default async function AdminHardwarePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("hardware_products")
    .select("id, name, description, image_url, device_type, selling_price_cents, internal_cost_cents, active, display_order")
    .order("display_order");

  if (error) {
    return <p className="text-sm text-danger">Could not load hardware products: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Hardware</h1>
        <p className="mt-1 text-sm text-ink/70">
          Businesses only ever see the selling price and the fields marked active — internal cost never
          leaves this page.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {(products ?? []).map((product) => (
          <AdminHardwareProductForm key={product.id} product={product} />
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg text-charcoal">Add Product</h2>
        <div className="mt-3">
          <AdminHardwareProductForm />
        </div>
      </div>
    </div>
  );
}
