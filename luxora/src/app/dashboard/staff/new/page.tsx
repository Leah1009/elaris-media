import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { StaffForm } from "@/components/staff-form";
import { createStaff } from "@/lib/luxora/staff-actions";

export default async function NewStaffPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: services }, { data: locations }] = await Promise.all([
    supabase.from("services").select("id, name").eq("business_id", ctx.business.id).order("name"),
    supabase.from("locations").select("id, name").eq("business_id", ctx.business.id).order("name"),
  ]);

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Add Staff</h1>
      <div className="mt-6">
        <StaffForm
          action={createStaff}
          services={services ?? []}
          locations={locations ?? []}
          submitLabel="Create Staff"
        />
      </div>
    </div>
  );
}
