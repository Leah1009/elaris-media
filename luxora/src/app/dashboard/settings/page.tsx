import Link from "next/link";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { t, type TranslationKey } from "@/lib/luxora/i18n";

const SETTINGS_LINKS: { labelKey: TranslationKey; descKey: TranslationKey; href: string }[] = [
  { labelKey: "settings_business_profile", descKey: "settings_business_profile_desc", href: "/dashboard/settings/business-profile" },
  { labelKey: "settings_locations_hours", descKey: "settings_locations_hours_desc", href: "/dashboard/settings/locations" },
  { labelKey: "settings_online_booking", descKey: "settings_online_booking_desc", href: "/dashboard/settings/online-booking" },
  { labelKey: "settings_website", descKey: "settings_website_desc", href: "/dashboard/settings/website" },
  { labelKey: "settings_payments", descKey: "settings_payments_desc", href: "/dashboard/settings/payments" },
  { labelKey: "settings_subscription", descKey: "settings_subscription_desc", href: "/dashboard/settings/subscription" },
];

export default async function SettingsIndexPage() {
  const ctx = await getBusinessContext();
  const lang = ctx.business.preferred_language;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-charcoal">{t(lang, "settings_title")}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SETTINGS_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-sm border border-border bg-white p-5 transition hover:border-gold-deep"
          >
            <p className="font-display text-lg text-charcoal">{t(lang, link.labelKey)}</p>
            <p className="mt-1 text-sm text-ink/70">{t(lang, link.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
