import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { ClientFormBasicInfo } from "@/components/client-form-basic-info";
import { FormFieldsManager } from "@/components/form-fields-manager";
import { updateForm } from "@/lib/luxora/forms-actions";

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: form }, { data: services }, { data: fields }] = await Promise.all([
    supabase
      .from("client_forms")
      .select("id, name, description, trigger, service_id")
      .eq("id", id)
      .eq("business_id", ctx.business.id)
      .maybeSingle(),
    supabase.from("services").select("id, name").eq("business_id", ctx.business.id).order("name"),
    supabase.from("form_fields").select("id, label, field_type, required, options, sort_order").eq("form_id", id).order("sort_order"),
  ]);

  if (!form) notFound();

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Edit Form</h1>
        <div className="mt-6 max-w-lg">
          <ClientFormBasicInfo
            action={updateForm.bind(null, form.id)}
            defaultValues={form}
            services={services ?? []}
            submitLabel="Save Changes"
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg text-charcoal">Questions</h2>
        <div className="mt-4 max-w-lg">
          <FormFieldsManager
            formId={form.id}
            fields={(fields ?? []).map((f) => ({
              ...f,
              options: f.options as string[] | null,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
