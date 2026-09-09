import { createClient } from "@/lib/supabase/server";

export async function getBookableBusinessBySlug(slug: string) {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, description, phone, address_line1, city, state, zip, business_type, timezone")
    .eq("slug", slug)
    .maybeSingle();

  return business;
}

export const SLOT_INCREMENT_MINUTES = 15;
