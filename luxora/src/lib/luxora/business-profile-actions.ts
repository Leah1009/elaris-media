"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { BUSINESS_TYPES } from "@/lib/luxora/business-types";
import type { ActionState } from "@/lib/luxora/actions";

const businessTypeValues = BUSINESS_TYPES.map((t) => t.value) as [string, ...string[]];

const ProfileSchema = z
  .object({
    name: z.string().min(2, "Business name is required."),
    businessType: z.enum(businessTypeValues),
    businessTypeOther: z.string().optional(),
    description: z.string().optional(),
    phone: z.string().min(7, "Enter a valid phone number."),
    email: z.email("Enter a valid email."),
    addressLine1: z.string().min(3, "Address is required."),
    city: z.string().min(1, "City is required."),
    state: z.string().min(2, "State is required."),
    zip: z.string().min(3, "ZIP is required."),
    timezone: z.string().min(1, "Choose a timezone."),
    taxRatePercent: z.coerce.number().min(0).max(100),
  })
  .refine((data) => data.businessType !== "other" || !!data.businessTypeOther?.trim(), {
    error: "Please describe your business type.",
    path: ["businessTypeOther"],
  });

export async function updateBusinessProfile(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("businesses")
    .update({
      name: data.name,
      business_type: data.businessType,
      business_type_other: data.businessType === "other" ? data.businessTypeOther || null : null,
      description: data.description || null,
      phone: data.phone,
      email: data.email,
      address_line1: data.addressLine1,
      city: data.city,
      state: data.state,
      zip: data.zip,
      timezone: data.timezone,
      tax_rate_percent: data.taxRatePercent,
    })
    .eq("id", ctx.business.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings/business-profile");
  revalidatePath("/dashboard");
  return null;
}
