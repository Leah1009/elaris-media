import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { LegalPage } from "@/components/legal-page";
import { PRIVACY_SECTIONS } from "@/lib/luxora/privacy-content";

export default async function PrivacyPage() {
  const locale = await getPublicLocale();
  return <LegalPage locale={locale} title={t(locale, "privacy_policy_title")} sections={PRIVACY_SECTIONS} />;
}
