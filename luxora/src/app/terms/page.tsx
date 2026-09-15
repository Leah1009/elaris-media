import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { LegalPage } from "@/components/legal-page";
import { TERMS_SECTIONS } from "@/lib/luxora/terms-content";

export default async function TermsPage() {
  const locale = await getPublicLocale();
  return <LegalPage locale={locale} title={t(locale, "terms_of_service_title")} sections={TERMS_SECTIONS} />;
}
