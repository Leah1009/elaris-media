import Link from "next/link";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { RegisterForm } from "@/components/register-form";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { BackButton } from "@/components/back-button";

export default async function RegisterPage() {
  const locale = await getPublicLocale();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <BackButton lang={locale} />
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
            Luxore
          </Link>
          <LocaleSwitcher locale={locale} />
        </div>
        <h1 className="mt-4 font-display text-3xl text-charcoal">{t(locale, "register_title")}</h1>
        <p className="mt-2 text-sm text-ink">{t(locale, "hero_trial_note")}</p>

        <RegisterForm locale={locale} />
      </div>
    </main>
  );
}
