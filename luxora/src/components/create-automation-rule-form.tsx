"use client";

import { useActionState } from "react";
import { createAutomationRule } from "@/lib/luxora/automation-rules-actions";
import type { ActionState } from "@/lib/luxora/actions";

export function CreateAutomationRuleForm({ templates }: { templates: { id: string; name: string; channel: string }[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createAutomationRule, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-sm border border-border bg-white p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ruleName" className="text-sm font-medium text-charcoal">
            Rule Name
          </label>
          <input id="ruleName" name="name" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal" />
          {state?.fieldErrors?.name ? <p className="text-sm text-danger">{state.fieldErrors.name[0]}</p> : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="triggerType" className="text-sm font-medium text-charcoal">
            Trigger
          </label>
          <select id="triggerType" name="triggerType" defaultValue="appointment_completed" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
            <option value="appointment_completed">Appointment completed</option>
            <option value="appointment_no_show">Appointment no-show</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="delayHours" className="text-sm font-medium text-charcoal">
            Delay (hours)
          </label>
          <input
            id="delayHours"
            name="delayHours"
            type="number"
            min="0"
            defaultValue="1"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="templateId" className="text-sm font-medium text-charcoal">
            Template
          </label>
          <select id="templateId" name="templateId" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.channel})
              </option>
            ))}
          </select>
          {state?.fieldErrors?.templateId ? (
            <p className="text-sm text-danger">{state.fieldErrors.templateId[0]}</p>
          ) : null}
        </div>
      </div>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending || templates.length === 0}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create Rule"}
      </button>
      {templates.length === 0 ? (
        <p className="text-xs text-ink/60">Create a message template first.</p>
      ) : null}
    </form>
  );
}
