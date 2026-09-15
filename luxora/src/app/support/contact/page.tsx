import Link from "next/link";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { SupportTicketForm } from "@/components/support-ticket-form";
import { SiteFooter } from "@/components/marketing/site-footer";
import { BackButton } from "@/components/back-button";

export default async function ContactSupportPage() {
  const locale = await getPublicLocale();

  return (
    <>
      <main className="mx-auto max-w-xl px-6 py-20 sm:px-10">
        <BackButton lang={locale} />
        <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
          Luxore
        </Link>
        <h1 className="mt-6 font-display text-4xl text-charcoal">{t(locale, "contact_support_title")}</h1>
        <p className="mt-3 text-sm text-ink sm:text-base">{t(locale, "contact_support_subtitle")}</p>

        <div className="mt-10">
          <SupportTicketForm locale={locale} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
