import Link from "next/link";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { HelpCenter } from "@/components/help-center";
import { SiteFooter } from "@/components/marketing/site-footer";

export default async function HelpPage() {
  const locale = await getPublicLocale();

  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
          Luxore
        </Link>
        <h1 className="mt-6 font-display text-4xl text-charcoal">{t(locale, "help_center_title")}</h1>
        <p className="mt-3 text-sm text-ink sm:text-base">{t(locale, "help_center_subtitle")}</p>

        <div className="mt-10">
          <HelpCenter locale={locale} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
