import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getAppUrl } from "@/lib/luxora/app-url";
import { OnlineBookingSettingsForm } from "@/components/online-booking-settings-form";
import { t } from "@/lib/luxora/i18n";

export default async function OnlineBookingSettingsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();
  const appUrl = await getAppUrl();
  const locale = ctx.business.preferred_language;

  const { data: business } = await supabase
    .from("businesses")
    .select("online_booking_enabled, booking_window_days, min_notice_hours, buffer_minutes")
    .eq("id", ctx.business.id)
    .single();

  const bookingUrl = `${appUrl}/b/${ctx.business.slug}/book`;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{t(locale, "nav_online_booking")}</h1>
          <p className="mt-1 text-sm text-ink/70">{t(locale, "online_booking_subtitle")}</p>
        </div>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-sm border border-border px-4 py-2 text-xs font-medium text-charcoal transition hover:border-gold-deep"
        >
          {t(locale, "online_booking_view_page")}
        </a>
      </div>

      <OnlineBookingSettingsForm settings={business!} bookingUrl={bookingUrl} locale={locale} />
    </div>
  );
}
