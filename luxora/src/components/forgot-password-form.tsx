"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/luxora/password-actions";
import type { ActionState } from "@/lib/luxora/actions";
import { FormField } from "@/components/form-field";
import { t, type Locale } from "@/lib/luxora/i18n";

export function ForgotPasswordForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(requestPasswordReset, null);

  if (state?.success) {
    return <p className="mt-8 text-sm text-charcoal">{t(locale, "forgot_password_success")}</p>;
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5" noValidate>
      <FormField
        label={t(locale, "field_email")}
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={state?.fieldErrors?.email}
      />

      {state?.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? t(locale, "forgot_password_sending") : t(locale, "forgot_password_button")}
      </button>
    </form>
  );
}
