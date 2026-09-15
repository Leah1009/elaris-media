import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/**
 * Uploads an optional image to the shared business-media bucket (public
 * read, write scoped to business members — see migration 052) and returns
 * its public URL. Returns null for an empty/missing file input so callers
 * can treat "no image chosen" and "keep the existing image" the same way.
 */
export async function uploadBusinessImage(
  supabase: SupabaseClient<Database>,
  businessId: string,
  file: File | null,
): Promise<{ url: string | null; error?: string }> {
  if (!file || file.size === 0) return { url: null };

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: "Image must be a PNG, JPEG, WEBP, or GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { url: null, error: "Image must be 5MB or smaller." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${businessId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("business-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("business-media").getPublicUrl(path);
  return { url: data.publicUrl };
}
