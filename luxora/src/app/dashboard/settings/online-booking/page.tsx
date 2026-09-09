import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { OnlineBookingSettingsForm } from "@/components/online-booking-settings-form";

export default async function OnlineBookingSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("online_booking_enabled, booking_window_days, min_notice_hours, buffer_minutes")
    .eq("id", ctx.business.id)
    .single();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-charcoal">Online Booking</h1>
      <p className="mt-1 text-sm text-ink/70">
        These rules are enforced on the actual booking — a client can&apos;t bypass them by calling the API
        directly.
      </p>
      <div className="mt-6">
        <OnlineBookingSettingsForm settings={business!} />
      </div>
    </div>
  );
}
