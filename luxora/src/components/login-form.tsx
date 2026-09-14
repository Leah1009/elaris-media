"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/lib/luxora/actions";
import { FormField } from "@/components/form-field";
import { t, type Locale } from "@/lib/luxora/i18n";

export function LoginForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, null);

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
      <FormField
        label={t(locale, "field_password")}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state?.fieldErrors?.password}
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
        {pending ? t(locale, "logging_in") : t(locale, "log_in_button")}
      </button>
    </form>
  );
}
