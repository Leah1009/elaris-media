import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";
import { getWebsiteRenderData } from "@/lib/luxora/website-data";
import { getWebsiteImageSlotMap } from "@/lib/luxora/website-image-slots-actions";
import { getWebsiteTemplate } from "@/components/website-templates/registry";
import type { WebsiteTemplate } from "@/lib/luxora/website-image-slots-actions";

export default async function PublicBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBookableBusinessBySlug(slug);
  if (!business) notFound();

  const supabase = await createClient();
  const templateKey = business.website_template as WebsiteTemplate;
  const template = getWebsiteTemplate(templateKey);

  const [data, images] = await Promise.all([
    getWebsiteRenderData(supabase, business.id),
    getWebsiteImageSlotMap(supabase, business.id, template.key),
  ]);

  return (
    <template.Component
      business={business}
      data={data}
      images={images}
      devMode={false}
    />
  );
}
