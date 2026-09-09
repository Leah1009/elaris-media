"use client";

import { useActionState } from "react";
import { startStripeOnboarding, type StripeActionState } from "@/lib/luxora/stripe-actions";

export function ConnectStripeButton({ label }: { label: string }) {
  const [state, formAction, pending] = useActionState<StripeActionState, FormData>(
    async () => startStripeOnboarding(),
    null,
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Redirecting…" : label}
      </button>
      {state?.error ? <p className="mt-2 text-sm text-danger">{state.error}</p> : null}
    </form>
  );
}
