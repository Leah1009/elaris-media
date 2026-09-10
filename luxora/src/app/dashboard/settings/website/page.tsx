import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { WebsiteSettingsForm } from "@/components/website-settings-form";

export default async function WebsiteSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("logo_url, cover_image_url, brand_color, website_tagline, instagram_url, show_team, show_reviews")
    .eq("id", ctx.business.id)
    .single();

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-charcoal">Website</h1>
      <p className="mt-1 text-sm text-ink/70">
        Customize the branding shown on your public booking page.
      </p>
      <div className="mt-6">
        <WebsiteSettingsForm settings={business!} slug={ctx.business.slug} businessName={ctx.business.name} />
      </div>
    </div>
  );
}
