"use client";

import { useActionState } from "react";
import { openStripeAccountManagement, type StripeActionState } from "@/lib/luxora/stripe-actions";

export function ManageStripeAccountButton({ label }: { label: string }) {
  const [state, formAction, pending] = useActionState<StripeActionState, FormData>(
    async () => openStripeAccountManagement(),
    null,
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-border px-5 py-2 text-sm font-medium text-charcoal transition hover:border-gold-deep disabled:opacity-60"
      >
        {pending ? "…" : label}
      </button>
      {state?.error ? <p className="mt-2 text-sm text-danger">{state.error}</p> : null}
    </form>
  );
}
