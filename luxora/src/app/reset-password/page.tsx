import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { BackButton } from "@/components/back-button";

export default async function ResetPasswordPage() {
  const locale = await getPublicLocale();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <BackButton lang={locale} />
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
            Luxore
          </Link>
          <LocaleSwitcher locale={locale} />
        </div>

        {user ? (
          <>
            <h1 className="mt-4 font-display text-3xl text-charcoal">{t(locale, "reset_password_title")}</h1>
            <p className="mt-2 text-sm text-ink">{t(locale, "reset_password_subtitle")}</p>
            <ResetPasswordForm locale={locale} />
          </>
        ) : (
          <>
            <h1 className="mt-4 font-display text-3xl text-charcoal">{t(locale, "reset_password_invalid_title")}</h1>
            <p className="mt-2 text-sm text-ink">{t(locale, "reset_password_invalid_body")}</p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-block rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
            >
              {t(locale, "forgot_password_title")}
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
