import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { ClientForm } from "@/components/client-form";
import { createClientRecord } from "@/lib/luxora/clients-actions";

export default async function NewClientPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("client_tags")
    .select("id, name")
    .eq("business_id", ctx.business.id)
    .order("name");

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Add Client</h1>
      <div className="mt-6">
        <ClientForm action={createClientRecord} tags={tags ?? []} submitLabel="Create Client" />
      </div>
    </div>
  );
}
