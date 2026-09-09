"use client";

import { useState } from "react";
import { addField, updateField, deleteField, moveField } from "@/lib/luxora/forms-actions";

export type FormFieldRow = {
  id: string;
  label: string;
  field_type: string;
  required: boolean;
  options: string[] | null;
  sort_order: number;
};

const FIELD_TYPES = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "checkbox", label: "Checkbox" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "date", label: "Date" },
  { value: "signature", label: "Signature" },
  { value: "consent", label: "Consent" },
];

function FieldEditor({ formId, field, onDone }: { formId: string; field: FormFieldRow; onDone: () => void }) {
  const [type, setType] = useState(field.field_type);
  const boundUpdate = updateField.bind(null, field.id);

  return (
    <form
      action={async (formData) => {
        await boundUpdate(formData);
        onDone();
      }}
      className="flex flex-col gap-3 rounded-sm border border-gold-deep bg-white p-4"
    >
      <input type="hidden" name="formId" value={formId} />
      <input
        name="label"
        defaultValue={field.label}
        required
        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
      />
      <select
        name="fieldType"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
      >
        {FIELD_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      {type === "multiple_choice" ? (
        <input
          name="options"
          defaultValue={field.options?.join(", ")}
          placeholder="Option A, Option B, Option C"
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
      ) : null}
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input type="checkbox" name="required" defaultChecked={field.required} className="h-4 w-4 accent-gold-deep" />
        Required
      </label>
      <div className="flex gap-2">
        <button type="submit" className="rounded-sm bg-charcoal px-4 py-1.5 text-sm text-white">
          Save
        </button>
        <button type="button" onClick={onDone} className="rounded-sm border border-border px-4 py-1.5 text-sm text-charcoal">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function FormFieldsManager({ formId, fields }: { formId: string; fields: FormFieldRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newType, setNewType] = useState("text");

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, i) =>
        editingId === field.id ? (
          <FieldEditor key={field.id} formId={formId} field={field} onDone={() => setEditingId(null)} />
        ) : (
          <div
            key={field.id}
            className="flex items-center justify-between gap-3 rounded-sm border border-border bg-white p-3"
          >
            <div>
              <p className="text-sm font-medium text-charcoal">
                {field.label} {field.required ? <span className="text-gold-deep">*</span> : null}
              </p>
              <p className="text-xs text-ink/60">
                {FIELD_TYPES.find((t) => t.value === field.field_type)?.label}
                {field.options ? ` — ${field.options.join(", ")}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <form action={moveField}>
                <input type="hidden" name="fieldId" value={field.id} />
                <input type="hidden" name="formId" value={formId} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" disabled={i === 0} className="px-1.5 text-ink disabled:opacity-30">
                  ↑
                </button>
              </form>
              <form action={moveField}>
                <input type="hidden" name="fieldId" value={field.id} />
                <input type="hidden" name="formId" value={formId} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={i === fields.length - 1}
                  className="px-1.5 text-ink disabled:opacity-30"
                >
                  ↓
                </button>
              </form>
              <button
                type="button"
                onClick={() => setEditingId(field.id)}
                className="px-2 text-sm font-medium text-gold-deep underline underline-offset-2"
              >
                Edit
              </button>
              <form action={deleteField}>
                <input type="hidden" name="fieldId" value={field.id} />
                <input type="hidden" name="formId" value={formId} />
                <button type="submit" className="px-2 text-sm text-danger">
                  Remove
                </button>
              </form>
            </div>
          </div>
        ),
      )}

      <form
        action={addField.bind(null, formId)}
        className="flex flex-col gap-3 rounded-sm border border-dashed border-border p-4"
      >
        <p className="text-sm font-medium text-charcoal">Add a field</p>
        <input
          name="label"
          placeholder="Field label"
          required
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
        <select
          name="fieldType"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        >
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {newType === "multiple_choice" ? (
          <input
            name="options"
            placeholder="Option A, Option B, Option C"
            className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
          />
        ) : null}
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" name="required" className="h-4 w-4 accent-gold-deep" />
          Required
        </label>
        <button type="submit" className="self-start rounded-sm border border-border px-4 py-1.5 text-sm text-charcoal hover:border-gold-deep">
          Add Field
        </button>
      </form>
    </div>
  );
}
