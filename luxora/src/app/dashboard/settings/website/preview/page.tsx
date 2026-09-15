import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getWebsiteRenderData } from "@/lib/luxora/website-data";
import { getWebsiteImageSlotMap } from "@/lib/luxora/website-image-slots-actions";
import { getWebsiteTemplate } from "@/components/website-templates/registry";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

/**
 * Authenticated, dashboard-only render of a template — this is where owners
 * review structure and upload placeholder images. It intentionally never
 * runs through /b/[slug]: that route is what real visitors see, and must
 * never expose devMode's labeled placeholders.
 */
export default async function WebsitePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: templateParam } = await searchParams;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select(
      "id, name, slug, description, phone, address_line1, city, state, zip, website_tagline, instagram_url, logo_url, brand_color, show_team, show_reviews",
    )
    .eq("id", ctx.business.id)
    .single();

  const template = getWebsiteTemplate(templateParam ?? ctx.business.website_template ?? "minimal_luxury");

  const [data, images] = await Promise.all([
    getWebsiteRenderData(supabase, ctx.business.id),
    getWebsiteImageSlotMap(supabase, ctx.business.id, template.key as WebsiteTemplate),
  ]);

  return <template.Component business={business!} data={data} images={images} devMode />;
}
