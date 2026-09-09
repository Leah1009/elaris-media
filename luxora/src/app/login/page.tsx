"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type ActionState } from "@/lib/luxora/actions";
import { FormField } from "@/components/form-field";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, null);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
          Luxora
        </Link>
        <h1 className="mt-4 font-display text-3xl text-charcoal">Welcome back</h1>
        <p className="mt-2 text-sm text-ink">Log in to manage your business.</p>

        <form action={formAction} className="mt-8 flex flex-col gap-5" noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            errors={state?.fieldErrors?.email}
          />
          <FormField
            label="Password"
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
            {pending ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink">
          New to Luxora?{" "}
          <Link href="/register" className="font-medium text-gold-deep underline underline-offset-2">
            Start your free month
          </Link>
        </p>
      </div>
    </main>
  );
}
