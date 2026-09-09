import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { ProductForm } from "@/components/product-form";
import { updateProduct } from "@/lib/luxora/products-actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, category, sku, barcode, supplier, cost_cents, retail_price_cents, quantity_on_hand, reorder_threshold, product_type, active",
    )
    .eq("id", id)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!product) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Edit Product</h1>
      <div className="mt-6">
        <ProductForm action={updateProduct.bind(null, product.id)} defaultValues={product} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
