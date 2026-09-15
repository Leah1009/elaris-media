"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { uploadBusinessImage } from "@/lib/luxora/business-media";
import type { ActionState } from "@/lib/luxora/actions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

const TEMPLATES = ["minimal_luxury", "modern_dark", "soft_beauty"] as const;
export type WebsiteTemplate = (typeof TEMPLATES)[number];

const SlotSchema = z.object({
  template: z.enum(TEMPLATES),
  slotKey: z.string().min(1),
});

/**
 * Every image slot for every template lives in one table, keyed by
 * (business, template, slot key) — switching templates and switching back
 * doesn't lose the images already uploaded for either one.
 */
export async function uploadWebsiteImageSlot(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = SlotSchema.safeParse({ template: formData.get("template"), slotKey: formData.get("slotKey") });
  if (!parsed.success) return { error: "Invalid image slot." };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };

  const supabase = await createClient();
  const { url, error } = await uploadBusinessImage(supabase, ctx.business.id, file);
  if (error) return { error };

  const { error: dbError } = await supabase.from("website_image_slots").upsert(
    {
      business_id: ctx.business.id,
      template: parsed.data.template,
      slot_key: parsed.data.slotKey,
      image_url: url,
    },
    { onConflict: "business_id,template,slot_key" },
  );
  if (dbError) return { error: dbError.message };

  revalidatePath("/dashboard/settings/website");
  revalidatePath(`/b/${ctx.business.slug}`);
  return { success: true };
}

export async function removeWebsiteImageSlot(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const parsed = SlotSchema.safeParse({ template: formData.get("template"), slotKey: formData.get("slotKey") });
  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("website_image_slots")
    .update({ image_url: null })
    .eq("business_id", ctx.business.id)
    .eq("template", parsed.data.template)
    .eq("slot_key", parsed.data.slotKey);

  revalidatePath("/dashboard/settings/website");
  revalidatePath(`/b/${ctx.business.slug}`);
}

export async function setWebsiteTemplate(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const template = String(formData.get("template"));
  if (!TEMPLATES.includes(template as WebsiteTemplate)) return;

  const supabase = await createClient();
  await supabase.from("businesses").update({ website_template: template }).eq("id", ctx.business.id);

  revalidatePath("/dashboard/settings/website");
  revalidatePath(`/b/${ctx.business.slug}`);
}

export async function getWebsiteImageSlotMap(
  supabase: SupabaseClient<Database>,
  businessId: string,
  template: WebsiteTemplate,
): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("website_image_slots")
    .select("slot_key, image_url")
    .eq("business_id", businessId)
    .eq("template", template);

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.image_url) map[row.slot_key] = row.image_url;
  }
  return map;
}
