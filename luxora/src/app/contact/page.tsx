import Link from "next/link";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const locale = await getPublicLocale();
  const { reason } = await searchParams;
  const isDemo = reason === "demo";

  return (
    <main className="mx-auto max-w-xl px-6 py-20 sm:px-10">
      <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
        Luxore
      </Link>
      <h1 className="mt-6 font-display text-4xl text-charcoal">
        {t(locale, isDemo ? "demo_page_title" : "contact_page_title")}
      </h1>
      <p className="mt-3 text-sm text-ink sm:text-base">
        {t(locale, isDemo ? "demo_page_subtitle" : "contact_page_subtitle")}
      </p>

      <div className="mt-10">
        <ContactForm locale={locale} defaultReason={reason} />
      </div>
    </main>
  );
}
