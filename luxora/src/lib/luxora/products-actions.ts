"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { dollarsToCents } from "@/lib/luxora/money";
import type { ActionState } from "@/lib/luxora/actions";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required."),
  category: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  supplier: z.string().optional(),
  cost: z.coerce.number().min(0),
  retailPrice: z.coerce.number().min(0),
  quantityOnHand: z.coerce.number().int(),
  reorderThreshold: z.coerce.number().int().min(0),
  productType: z.enum(["retail", "supply", "both"]),
  active: z.string().optional(),
});

export async function createProduct(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      business_id: ctx.business.id,
      name: data.name,
      category: data.category || null,
      sku: data.sku || null,
      barcode: data.barcode || null,
      supplier: data.supplier || null,
      cost_cents: dollarsToCents(String(data.cost)),
      retail_price_cents: dollarsToCents(String(data.retailPrice)),
      quantity_on_hand: data.quantityOnHand,
      reorder_threshold: data.reorderThreshold,
      product_type: data.productType,
      active: data.active !== "off",
    })
    .select("id")
    .single();

  if (error || !product) return { error: error?.message ?? "Could not create product." };

  if (data.quantityOnHand > 0) {
    await supabase.from("inventory_movements").insert({
      business_id: ctx.business.id,
      product_id: product.id,
      change_type: "restock",
      quantity_delta: data.quantityOnHand,
      notes: "Initial stock",
    });
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProduct(
  productId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("products")
    .select("quantity_on_hand")
    .eq("id", productId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!existing) return { error: "Product not found." };

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      category: data.category || null,
      sku: data.sku || null,
      barcode: data.barcode || null,
      supplier: data.supplier || null,
      cost_cents: dollarsToCents(String(data.cost)),
      retail_price_cents: dollarsToCents(String(data.retailPrice)),
      quantity_on_hand: data.quantityOnHand,
      reorder_threshold: data.reorderThreshold,
      product_type: data.productType,
      active: data.active !== "off",
    })
    .eq("id", productId)
    .eq("business_id", ctx.business.id);

  if (error) return { error: error.message };

  const delta = data.quantityOnHand - existing.quantity_on_hand;
  if (delta !== 0) {
    await supabase.from("inventory_movements").insert({
      business_id: ctx.business.id,
      product_id: productId,
      change_type: "adjustment",
      quantity_delta: delta,
      notes: "Manual stock adjustment",
    });
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
