"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type SupportTicketActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
} | null;

const CATEGORY_VALUES = [
  "account_login",
  "booking_calendar",
  "clients",
  "payments",
  "subscription_billing",
  "website",
  "inventory",
  "marketing",
  "technical",
  "other",
] as const;

const SupportTicketSchema = z.object({
  category: z.enum(CATEGORY_VALUES),
  subject: z.string().min(1, "Subject is required."),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters."),
  website: z.string().max(0, "Spam detected.").optional(),
});

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;

export async function submitSupportTicket(
  _prevState: SupportTicketActionState,
  formData: FormData,
): Promise<SupportTicketActionState> {
  const parsed = SupportTicketSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let businessId: string | null = null;
  if (user) {
    const { data: membership } = await supabase
      .from("business_members")
      .select("business_id")
      .eq("profile_id", user.id)
      .limit(1)
      .maybeSingle();
    businessId = membership?.business_id ?? null;

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
    const { count } = await supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT_MAX_SUBMISSIONS) {
      return { error: "rate_limited" };
    }
  }

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user?.id ?? null,
    business_id: businessId,
    category: data.category,
    subject: data.subject,
    message: data.message,
  });

  if (error) return { error: error.message };

  return { success: true };
}
