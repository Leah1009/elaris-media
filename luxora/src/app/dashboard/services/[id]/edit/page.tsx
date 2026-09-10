import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { ServiceForm } from "@/components/service-form";
import { updateService } from "@/lib/luxora/services-actions";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("id, name, category, description, duration_minutes, price_cents, deposit_required, deposit_cents, active, color")
    .eq("id", id)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!service) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Edit Service</h1>
      <div className="mt-6">
        <ServiceForm
          action={updateService.bind(null, service.id)}
          defaultValues={service}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
