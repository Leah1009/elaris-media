import { createClient } from "@/lib/supabase/server";

export async function getBookableBusinessBySlug(slug: string) {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select(
      "id, name, slug, description, phone, address_line1, city, state, zip, business_type, timezone, online_booking_enabled, booking_window_days, min_notice_hours, buffer_minutes, logo_url, cover_image_url, brand_color, website_tagline, instagram_url, show_team, show_reviews",
    )
    .eq("slug", slug)
    .maybeSingle();

  return business;
}

export const SLOT_INCREMENT_MINUTES = 15;
