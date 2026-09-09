import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { BusinessProfileForm } from "@/components/business-profile-form";

export default async function BusinessProfileSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select(
      "name, business_type, business_type_other, description, phone, email, address_line1, city, state, zip, timezone, tax_rate_percent",
    )
    .eq("id", ctx.business.id)
    .single();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-charcoal">Business Profile</h1>
      <p className="mt-1 text-sm text-ink/70">
        This information appears on your public booking page and receipts.
      </p>
      <div className="mt-6">
        <BusinessProfileForm defaultValues={business!} />
      </div>
    </div>
  );
}
