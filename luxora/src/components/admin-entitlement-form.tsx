"use client";

import { useActionState, useState } from "react";
import { upsertEntitlement } from "@/lib/luxora/platform-admin-actions";
import type { ActionState } from "@/lib/luxora/actions";

export type EntitlementValue = {
  key: string;
  value_type: "boolean" | "integer" | "text";
  value_boolean: boolean | null;
  value_integer: number | null;
  value_text: string | null;
};

export function AdminEntitlementForm({ planId, entitlement }: { planId: string; entitlement?: EntitlementValue }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(upsertEntitlement, null);
  const [valueType, setValueType] = useState<"boolean" | "integer" | "text">(entitlement?.value_type ?? "integer");

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 border-t border-border py-2 first:border-t-0">
      <input type="hidden" name="planId" value={planId} />
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink/60">Key</label>
        <input
          name="key"
          defaultValue={entitlement?.key ?? ""}
          readOnly={Boolean(entitlement)}
          placeholder="feature_x"
          className={`w-40 rounded-sm border border-border px-2 py-1 text-sm text-charcoal ${entitlement ? "bg-cream-deep" : ""}`}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink/60">Type</label>
        <select
          name="valueType"
          value={valueType}
          onChange={(e) => setValueType(e.target.value as "boolean" | "integer" | "text")}
          className="rounded-sm border border-border px-2 py-1 text-sm text-charcoal"
        >
          <option value="boolean">Boolean</option>
          <option value="integer">Integer</option>
          <option value="text">Text</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-ink/60">Value</label>
        {valueType === "boolean" ? (
          <label className="flex h-[30px] items-center gap-1.5 text-sm text-charcoal">
            <input
              type="checkbox"
              name="valueBoolean"
              defaultChecked={entitlement?.value_boolean ?? false}
              className="h-4 w-4 accent-gold-deep"
            />
            Enabled
          </label>
        ) : valueType === "integer" ? (
          <input
            name="valueInteger"
            type="number"
            defaultValue={entitlement?.value_integer ?? 0}
            className="w-24 rounded-sm border border-border px-2 py-1 text-sm text-charcoal"
          />
        ) : (
          <input
            name="valueText"
            defaultValue={entitlement?.value_text ?? ""}
            className="w-40 rounded-sm border border-border px-2 py-1 text-sm text-charcoal"
          />
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : entitlement ? "Update" : "Add"}
      </button>
      {state?.error ? <p className="text-xs text-danger">{state.error}</p> : null}
      {state?.fieldErrors?.key ? <p className="text-xs text-danger">{state.fieldErrors.key[0]}</p> : null}
    </form>
  );
}
