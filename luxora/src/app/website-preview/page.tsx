import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getWebsiteRenderData } from "@/lib/luxora/website-data";
import { getWebsiteImageSlotMap } from "@/lib/luxora/website-image-slots-actions";
import { getWebsiteTemplate } from "@/components/website-templates/registry";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

/**
 * Authenticated bare render of a template, deliberately kept OUTSIDE the
 * /dashboard route tree so the iframe preview shows only the template
 * itself — never wrapped in dashboard nav/trial banner, since that isn't
 * what real visitors see. It intentionally never runs through /b/[slug]
 * either: that route is what clients actually see, and must never expose
 * devMode's labeled placeholders.
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
