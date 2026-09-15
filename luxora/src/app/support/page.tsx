import Link from "next/link";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t, type TranslationKey } from "@/lib/luxora/i18n";

const OPTIONS: { titleKey: TranslationKey; descKey: TranslationKey; href: string }[] = [
  { titleKey: "support_option_help_center", descKey: "support_option_help_center_desc", href: "/help" },
  { titleKey: "support_option_contact_support", descKey: "support_option_contact_support_desc", href: "/support/contact" },
  { titleKey: "support_option_account", descKey: "support_option_account_desc", href: "/help#account" },
  { titleKey: "support_option_billing", descKey: "support_option_billing_desc", href: "/help#account" },
  { titleKey: "support_option_payments", descKey: "support_option_payments_desc", href: "/help#payments" },
  { titleKey: "support_option_booking", descKey: "support_option_booking_desc", href: "/help#booking-calendar" },
  { titleKey: "support_option_clients", descKey: "support_option_clients_desc", href: "/help#clients" },
];

export default async function SupportPage() {
  const locale = await getPublicLocale();

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
      <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
        Luxore
      </Link>
      <h1 className="mt-6 font-display text-4xl text-charcoal">{t(locale, "support_page_title")}</h1>
      <p className="mt-3 text-sm text-ink sm:text-base">{t(locale, "support_page_subtitle")}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <Link
            key={opt.href + opt.titleKey}
            href={opt.href}
            className="rounded-sm border border-border bg-white p-5 transition hover:border-gold-deep"
          >
            <p className="font-display text-lg text-charcoal">{t(locale, opt.titleKey)}</p>
            <p className="mt-1.5 text-sm text-ink/70">{t(locale, opt.descKey)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
