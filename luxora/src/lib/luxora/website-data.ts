import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

export type WebsiteService = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
};

export type WebsiteStaff = { id: string; full_name: string; title: string | null; photo_url: string | null };

export type WebsiteReview = {
  id: string;
  rating: number;
  comment: string | null;
  response: string | null;
  client_display_name: string;
};

export type WebsiteHours = { day_of_week: number; open_time: string | null; close_time: string | null; closed: boolean };

export type WebsitePromotion = {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  valid_to: string | null;
  image_url: string | null;
};

export type WebsiteRenderData = {
  services: WebsiteService[];
  servicesByCategory: { category: string; services: WebsiteService[] }[];
  staff: WebsiteStaff[];
  hours: WebsiteHours[];
  reviews: WebsiteReview[];
  reviewSummary: { average_rating: number | null; review_count: number } | null;
  promotions: WebsitePromotion[];
};

/**
 * Every Luxore website template renders the same underlying business data —
 * only the layout differs. Centralizing the fetch here keeps the public
 * page and the authenticated dashboard preview (which can't reuse
 * getBookableBusinessBySlug, since it previews the owner's own business
 * regardless of trial/lock state) from drifting apart.
 */
export async function getWebsiteRenderData(
  supabase: SupabaseClient<Database>,
  businessId: string,
): Promise<WebsiteRenderData> {
  const [{ data: services }, { data: staff }, { data: location }, { data: promotions }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, category, description, duration_minutes, price_cents")
      .eq("business_id", businessId)
      .eq("active", true)
      .order("name"),
    supabase
      .from("staff")
      .select("id, full_name, title, photo_url")
      .eq("business_id", businessId)
      .eq("active", true)
      .order("full_name"),
    supabase.from("locations").select("id").eq("business_id", businessId).eq("is_primary", true).maybeSingle(),
    supabase
      .from("promotions")
      .select("id, code, description, discount_type, discount_value, valid_to, image_url")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false }),
  ]);

  const { data: hours } = location
    ? await supabase
        .from("business_hours")
        .select("day_of_week, open_time, close_time, closed")
        .eq("location_id", location.id)
        .order("day_of_week")
    : { data: [] };

  const [{ data: reviewSummary }, { data: reviews }] = await Promise.all([
    supabase.rpc("get_public_review_summary", { p_business_id: businessId }).maybeSingle(),
    supabase.rpc("get_public_reviews", { p_business_id: businessId }),
  ]);

  const servicesList = services ?? [];
  const grouped = new Map<string, WebsiteService[]>();
  for (const s of servicesList) {
    const key = s.category?.trim() || "Other";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(s);
  }

  return {
    services: servicesList,
    servicesByCategory: Array.from(grouped.entries()).map(([category, services]) => ({ category, services })),
    staff: staff ?? [],
    hours: hours ?? [],
    reviews: (reviews as WebsiteReview[] | null) ?? [],
    reviewSummary: (reviewSummary as { average_rating: number | null; review_count: number } | null) ?? null,
    promotions: promotions ?? [],
  };
}
