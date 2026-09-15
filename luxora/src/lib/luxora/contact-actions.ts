"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ContactActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
} | null;

const REASON_VALUES = [
  "sales",
  "existing_customer",
  "billing",
  "payments",
  "partnership",
  "privacy",
  "other",
] as const;

const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  businessName: z.string().optional(),
  email: z.email("Enter a valid email."),
  phone: z.string().optional(),
  reason: z.enum(REASON_VALUES),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters."),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0, "Spam detected.").optional(),
});

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;

export async function submitContactRequest(_prevState: ContactActionState, formData: FormData): Promise<ContactActionState> {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await supabase
    .from("contact_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", data.email)
    .gte("created_at", since);

  if ((count ?? 0) >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return { error: "rate_limited" };
  }

  const { error } = await supabase.from("contact_requests").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    business_name: data.businessName || null,
    email: data.email,
    phone: data.phone || null,
    reason: data.reason,
    message: data.message,
  });

  if (error) return { error: error.message };

  return { success: true };
}
