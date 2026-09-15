import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getEntitlement } from "@/lib/luxora/entitlements";
import { WebsiteSettingsForm } from "@/components/website-settings-form";
import { WebsiteBuilder } from "@/components/website-builder";
import { getWebsiteImageSlotMap } from "@/lib/luxora/website-image-slots-actions";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

export default async function WebsiteSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: business }, minimalLuxury, modernDark, softBeauty, allTemplatesEntitlement] = await Promise.all([
    supabase
      .from("businesses")
      .select("logo_url, cover_image_url, brand_color, website_tagline, instagram_url, show_team, show_reviews, public_language_mode")
      .eq("id", ctx.business.id)
      .single(),
    getWebsiteImageSlotMap(supabase, ctx.business.id, "minimal_luxury"),
    getWebsiteImageSlotMap(supabase, ctx.business.id, "modern_dark"),
    getWebsiteImageSlotMap(supabase, ctx.business.id, "soft_beauty"),
    getEntitlement(ctx.business.id, "feature_all_templates"),
  ]);
  const allTemplatesUnlocked = allTemplatesEntitlement?.value === true;

  const imagesByTemplate: Record<WebsiteTemplate, Record<string, string>> = {
    minimal_luxury: minimalLuxury,
    modern_dark: modernDark,
    soft_beauty: softBeauty,
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Website Builder</h1>
        <p className="mt-1 text-sm text-ink/70">
          Pick a template, preview it on desktop/tablet/mobile, and manage its photography.
        </p>
      </div>

      <WebsiteBuilder
        slug={ctx.business.slug}
        currentTemplate={ctx.business.website_template as WebsiteTemplate}
        imagesByTemplate={imagesByTemplate}
        allTemplatesUnlocked={allTemplatesUnlocked}
      />

      <div className="border-t border-border pt-8">
        <h2 className="font-display text-lg text-charcoal">Branding</h2>
        <p className="mt-1 text-sm text-ink/70">Shared across every template.</p>
        <div className="mt-4">
          <WebsiteSettingsForm settings={business!} slug={ctx.business.slug} />
        </div>
      </div>
    </div>
  );
}
