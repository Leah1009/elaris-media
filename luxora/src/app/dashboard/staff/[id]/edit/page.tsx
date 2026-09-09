import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { StaffForm } from "@/components/staff-form";
import { updateStaff } from "@/lib/luxora/staff-actions";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const [{ data: staffMember }, { data: services }, { data: locations }, { data: staffServices }, { data: staffLocations }] =
    await Promise.all([
      supabase
        .from("staff")
        .select("id, full_name, title, email, phone, active")
        .eq("id", id)
        .eq("business_id", ctx.business.id)
        .maybeSingle(),
      supabase.from("services").select("id, name").eq("business_id", ctx.business.id).order("name"),
      supabase.from("locations").select("id, name").eq("business_id", ctx.business.id).order("name"),
      supabase.from("staff_services").select("service_id").eq("staff_id", id),
      supabase.from("staff_locations").select("location_id").eq("staff_id", id),
    ]);

  if (!staffMember) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-charcoal">Edit Staff</h1>
      <div className="mt-6">
        <StaffForm
          action={updateStaff.bind(null, staffMember.id)}
          defaultValues={staffMember}
          services={services ?? []}
          locations={locations ?? []}
          selectedServiceIds={(staffServices ?? []).map((r) => r.service_id)}
          selectedLocationIds={(staffLocations ?? []).map((r) => r.location_id)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
