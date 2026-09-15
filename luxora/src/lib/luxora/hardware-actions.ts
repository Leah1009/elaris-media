"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const OrderSchema = z.object({
  hardwareProductId: z.uuid(),
  quantity: z.coerce.number().int().min(1).max(20),
  locationId: z.string().optional(),
  shippingName: z.string().trim().min(1, "Name is required."),
  shippingAddressLine1: z.string().trim().min(1, "Address is required."),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().trim().min(1, "City is required."),
  shippingState: z.string().trim().min(1, "State is required."),
  shippingZip: z.string().trim().min(1, "ZIP is required."),
  shippingPhone: z.string().optional(),
});

/**
 * Creates a real Hardware Order record — no charge happens here. Luxore
 * fulfills hardware orders manually today (no production-ready checkout or
 * tax/shipping calculation exists yet), so this honestly records a
 * "pending" request rather than simulating a completed purchase.
 */
export async function createHardwareOrder(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  if (ctx.role !== "owner" && ctx.role !== "manager") {
    return { error: "Only an owner or manager can order hardware." };
  }

  const parsed = OrderSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("hardware_products")
    .select("id, selling_price_cents, active")
    .eq("id", data.hardwareProductId)
    .maybeSingle();

  if (!product || !product.active || product.selling_price_cents === null) {
    return { error: "This device isn't available to order yet." };
  }

  const subtotalCents = product.selling_price_cents * data.quantity;

  const { error } = await supabase.from("hardware_orders").insert({
    business_id: ctx.business.id,
    hardware_product_id: product.id,
    quantity: data.quantity,
    location_id: data.locationId || null,
    shipping_name: data.shippingName,
    shipping_address_line1: data.shippingAddressLine1,
    shipping_address_line2: data.shippingAddressLine2 || null,
    shipping_city: data.shippingCity,
    shipping_state: data.shippingState,
    shipping_zip: data.shippingZip,
    shipping_phone: data.shippingPhone || null,
    unit_price_cents: product.selling_price_cents,
    subtotal_cents: subtotalCents,
    shipping_cents: 0,
    tax_cents: 0,
    total_cents: subtotalCents,
    status: "pending",
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/payments");
  return {
    success: true,
    message: "Order received — our team will confirm shipping and finalize payment with you shortly.",
  };
}
