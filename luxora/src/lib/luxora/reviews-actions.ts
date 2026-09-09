"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";

/**
 * Creates (or reuses) a review request for a completed appointment and
 * returns its public link. One request per appointment — the unique
 * constraint on review_requests.appointment_id makes a second call for the
 * same appointment a no-op read instead of a duplicate link.
 */
export async function requestReview(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const appointmentId = String(formData.get("appointmentId"));
  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, client_id, status")
    .eq("id", appointmentId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!appointment || appointment.status !== "completed") return;

  const { data: existing } = await supabase
    .from("review_requests")
    .select("id")
    .eq("appointment_id", appointment.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("review_requests").insert({
      business_id: ctx.business.id,
      appointment_id: appointment.id,
      client_id: appointment.client_id,
    });
  }

  revalidatePath("/dashboard/reviews");
}

export async function respondToReview(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const reviewId = String(formData.get("reviewId"));
  const response = String(formData.get("response") ?? "").trim();
  const supabase = await createClient();

  await supabase
    .from("reviews")
    .update({ response: response || null, responded_at: response ? new Date().toISOString() : null })
    .eq("id", reviewId)
    .eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/reviews");
}

export async function setReviewVisibility(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const reviewId = String(formData.get("reviewId"));
  const status = String(formData.get("status"));
  if (!["published", "hidden"].includes(status)) return;

  const supabase = await createClient();
  await supabase.from("reviews").update({ status }).eq("id", reviewId).eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/reviews");
}
