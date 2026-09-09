import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getEntitlement } from "@/lib/luxora/entitlements";
import { AddLocationForm } from "@/components/add-location-form";
import { LocationHoursForm } from "@/components/location-hours-form";

export default async function LocationsSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: locations } = await supabase
    .from("locations")
    .select("id, name, address_line1, city, state, zip, is_primary")
    .eq("business_id", ctx.business.id)
    .order("is_primary", { ascending: false });

  const limit = await getEntitlement(ctx.business.id, "location_limit");
  const atLimit =
    limit?.type === "integer" && typeof limit.value === "number" && (locations?.length ?? 0) >= limit.value;

  const locationIds = (locations ?? []).map((l) => l.id);
  const { data: hours } = locationIds.length
    ? await supabase
        .from("business_hours")
        .select("location_id, day_of_week, open_time, close_time, closed")
        .in("location_id", locationIds)
    : { data: [] };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-charcoal">Locations</h1>

      <div className="flex flex-col gap-6">
        {locations?.map((location) => (
          <div key={location.id} className="rounded-sm border border-border bg-white p-6">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg text-charcoal">{location.name}</h2>
              {location.is_primary ? (
                <span className="rounded-full bg-cream-deep px-2 py-0.5 text-xs text-charcoal">Primary</span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-ink">
              {location.address_line1}, {location.city}, {location.state} {location.zip}
            </p>

            <div className="mt-5 border-t border-border pt-5">
              <h3 className="text-sm font-medium text-charcoal">Business Hours</h3>
              <div className="mt-3">
                <LocationHoursForm
                  locationId={location.id}
                  hours={(hours ?? []).filter((h) => h.location_id === location.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {atLimit ? (
        <p className="rounded-sm border border-border bg-white p-6 text-sm text-ink">
          Your plan includes up to {limit?.value} location{limit?.value === 1 ? "" : "s"}. Upgrade your
          plan to add more.
        </p>
      ) : (
        <AddLocationForm />
      )}
    </div>
  );
}
