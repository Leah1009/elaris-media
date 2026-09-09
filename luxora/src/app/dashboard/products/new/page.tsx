import { ProductForm } from "@/components/product-form";
import { createProduct } from "@/lib/luxora/products-actions";

export default function NewProductPage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Add Product</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="Create Product" />
      </div>
    </div>
  );
}
