"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const SettingsSchema = z.object({
  logoUrl: z.union([z.url("Enter a valid URL."), z.literal("")]).optional(),
  coverImageUrl: z.union([z.url("Enter a valid URL."), z.literal("")]).optional(),
  brandColor: z.union([z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #7C5A3A."), z.literal("")]).optional(),
  websiteTagline: z.string().max(140, "Keep it under 140 characters.").optional(),
});

export async function updateWebsiteSettings(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = SettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("businesses")
    .update({
      logo_url: data.logoUrl || null,
      cover_image_url: data.coverImageUrl || null,
      brand_color: data.brandColor || null,
      website_tagline: data.websiteTagline || null,
    })
    .eq("id", ctx.business.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings/website");
  revalidatePath("/b/[slug]", "page");
  return null;
}
