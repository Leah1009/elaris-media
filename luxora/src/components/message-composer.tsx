"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendClientMessage } from "@/lib/luxora/message-send-actions";
import type { ActionState } from "@/lib/luxora/actions";
import { t, type Locale } from "@/lib/luxora/i18n";

export function MessageComposer({ clientId, locale, enabled }: { clientId: string; locale: Locale; enabled: boolean }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sendClientMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 border-t border-border pt-3">
      <input type="hidden" name="clientId" value={clientId} />
      <div className="flex items-end gap-2">
        <textarea
          name="body"
          rows={1}
          required
          disabled={!enabled}
          placeholder={enabled ? t(locale, "messages_composer_placeholder") : t(locale, "messages_composer_disabled_note")}
          className="flex-1 resize-none rounded-full border border-border bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold-deep disabled:bg-cream-deep disabled:text-ink/40"
        />
        <button
          type="submit"
          disabled={!enabled || pending}
          className="shrink-0 rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft disabled:opacity-40"
        >
          {pending ? t(locale, "messages_sending") : t(locale, "messages_send_button")}
        </button>
      </div>
      {state?.error ? <p className="mt-1.5 text-xs text-danger">{state.error}</p> : null}
    </form>
  );
}
