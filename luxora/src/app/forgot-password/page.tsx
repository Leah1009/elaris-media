import Link from "next/link";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { BackButton } from "@/components/back-button";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getPublicLocale();
  const { error } = await searchParams;

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
        <h1 className="mt-4 font-display text-3xl text-charcoal">{t(locale, "forgot_password_title")}</h1>
        <p className="mt-2 text-sm text-ink">{t(locale, "forgot_password_subtitle")}</p>

        {error === "expired" ? (
          <p className="mt-4 rounded-sm border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
            {t(locale, "forgot_password_expired")}
          </p>
        ) : null}

        <ForgotPasswordForm locale={locale} />

        <p className="mt-6 text-sm text-ink">
          <Link href="/login" className="font-medium text-gold-deep underline underline-offset-2">
            {t(locale, "back_to_login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
