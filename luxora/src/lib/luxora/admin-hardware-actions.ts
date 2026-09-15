"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requirePlatformAdmin } from "@/lib/luxora/platform-admin";
import type { ActionState } from "@/lib/luxora/actions";

const ProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().optional(),
  imageUrl: z.union([z.url("Enter a valid URL."), z.literal("")]).optional(),
  deviceType: z.enum(["tap_to_pay", "card_reader", "smart_terminal"]),
  sellingPriceDollars: z.string().optional(),
  internalCostDollars: z.string().optional(),
  active: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
});

function toCentsOrNull(value: string | undefined): number | null {
  if (!value || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

export async function createHardwareProduct(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePlatformAdmin();
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("hardware_products").insert({
    name: data.name,
    description: data.description || null,
    image_url: data.imageUrl || null,
    device_type: data.deviceType,
    selling_price_cents: toCentsOrNull(data.sellingPriceDollars),
    internal_cost_cents: toCentsOrNull(data.internalCostDollars),
    active: data.active === "on",
    display_order: data.displayOrder,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/hardware");
  return null;
}

export async function updateHardwareProduct(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePlatformAdmin();
  const productId = String(formData.get("productId"));
  const parsed = ProductSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("hardware_products")
    .update({
      name: data.name,
      description: data.description || null,
      image_url: data.imageUrl || null,
      device_type: data.deviceType,
      selling_price_cents: toCentsOrNull(data.sellingPriceDollars),
      internal_cost_cents: toCentsOrNull(data.internalCostDollars),
      active: data.active === "on",
      display_order: data.displayOrder,
    })
    .eq("id", productId);
  if (error) return { error: error.message };

  revalidatePath("/admin/hardware");
  return null;
}
