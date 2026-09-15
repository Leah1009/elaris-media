"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/luxora/password-actions";
import type { ActionState } from "@/lib/luxora/actions";
import { FormField } from "@/components/form-field";
import { t, type Locale } from "@/lib/luxora/i18n";

export function ResetPasswordForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updatePassword, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5" noValidate>
      <FormField
        label={t(locale, "field_new_password")}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        errors={state?.fieldErrors?.password}
      />
      <FormField
        label={t(locale, "field_confirm_password")}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        errors={state?.fieldErrors?.confirmPassword}
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
        {pending ? t(locale, "reset_password_updating") : t(locale, "reset_password_button")}
      </button>
    </form>
  );
}
