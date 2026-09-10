import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { ClientForm } from "@/components/client-form";
import { updateClientRecord } from "@/lib/luxora/clients-actions";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: client }, { data: tags }, { data: assignments }] = await Promise.all([
    supabase
      .from("clients")
      .select(
        "id, full_name, phone, email, birthday, address_line1, city, state, zip, notes, has_allergies, allergy_notes, sms_consent, email_consent",
      )
      .eq("id", id)
      .eq("business_id", ctx.business.id)
      .maybeSingle(),
    supabase.from("client_tags").select("id, name").eq("business_id", ctx.business.id).order("name"),
    supabase.from("client_tag_assignments").select("tag_id").eq("client_id", id),
  ]);

  if (!client) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Edit Client</h1>
      <div className="mt-6">
        <ClientForm
          action={updateClientRecord.bind(null, client.id)}
          defaultValues={client}
          tags={tags ?? []}
          selectedTagIds={(assignments ?? []).map((a) => a.tag_id)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
