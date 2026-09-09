"use client";

import { useActionState, useState } from "react";
import { createMessageTemplate } from "@/lib/luxora/message-templates-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function CreateMessageTemplateForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createMessageTemplate, null);
  const [channel, setChannel] = useState<"sms" | "email">("sms");

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-charcoal">
            Template Name
          </label>
          <input id="name" name="name" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
          {state?.fieldErrors?.name ? <p className="text-sm text-danger">{state.fieldErrors.name[0]}</p> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium text-charcoal">
            Type
          </label>
          <select id="type" name="type" defaultValue="appointment_reminder" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
            <option value="appointment_reminder">Appointment reminder</option>
            <option value="appointment_confirmation">Appointment confirmation</option>
            <option value="review_request">Review request</option>
            <option value="marketing">Marketing</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="channel" className="text-sm font-medium text-charcoal">
            Channel
          </label>
          <select
            id="channel"
            name="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value as "sms" | "email")}
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          >
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {channel === "email" ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-sm font-medium text-charcoal">
            Subject
          </label>
          <input id="subject" name="subject" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm font-medium text-charcoal">
          Message
        </label>
        <textarea
          id="body"
          name="body"
          rows={3}
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        {state?.fieldErrors?.body ? <p className="text-sm text-danger">{state.fieldErrors.body[0]}</p> : null}
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create Template"}
      </button>
    </form>
  );
}
