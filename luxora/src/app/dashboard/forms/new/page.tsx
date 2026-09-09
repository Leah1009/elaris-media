import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { ClientFormBasicInfo } from "@/components/client-form-basic-info";
import { createForm } from "@/lib/luxora/forms-actions";

export default async function NewFormPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .eq("business_id", ctx.business.id)
    .order("name");

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">New Form</h1>
      <p className="mt-1 text-sm text-ink">Add the questions after creating the form.</p>
      <div className="mt-6">
        <ClientFormBasicInfo action={createForm} services={services ?? []} submitLabel="Create Form" />
      </div>
    </div>
  );
}
