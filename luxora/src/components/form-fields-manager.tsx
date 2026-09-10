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
  client_field_key: string | null;
  depends_on_field_id: string | null;
  depends_on_value: string | null;
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

const CLIENT_FIELD_OPTIONS = [
  { value: "", label: "Don't sync to client profile" },
  { value: "full_name", label: "Client's full name" },
  { value: "phone", label: "Client's phone number" },
  { value: "email", label: "Client's email address" },
  { value: "birthday", label: "Client's date of birth" },
  { value: "has_allergies", label: "Client has allergies (Yes/No)" },
  { value: "allergy_notes", label: "Client's allergy details" },
];

function DependsOnControl({
  otherFields,
  defaultFieldId,
  defaultValue,
}: {
  otherFields: FormFieldRow[];
  defaultFieldId?: string;
  defaultValue?: string;
}) {
  const [dependsOnFieldId, setDependsOnFieldId] = useState(defaultFieldId ?? "");

  if (otherFields.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-border/70 bg-cream-deep/50 p-3">
      <label className="text-xs font-medium text-charcoal">
        Only show this field when… <span className="font-normal text-ink/50">(optional)</span>
      </label>
      <select
        name="dependsOnFieldId"
        value={dependsOnFieldId}
        onChange={(e) => setDependsOnFieldId(e.target.value)}
        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
      >
        <option value="">Always show</option>
        {otherFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
      {dependsOnFieldId ? (
        <input
          name="dependsOnValue"
          defaultValue={defaultValue ?? ""}
          placeholder="…is answered (e.g. Yes)"
          required
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        />
      ) : null}
    </div>
  );
}

function FieldEditor({
  formId,
  field,
  otherFields,
  onDone,
}: {
  formId: string;
  field: FormFieldRow;
  otherFields: FormFieldRow[];
  onDone: () => void;
}) {
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

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-charcoal">Sync answer to client profile</label>
        <select
          name="clientFieldKey"
          defaultValue={field.client_field_key ?? ""}
          className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
        >
          {CLIENT_FIELD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <DependsOnControl
        otherFields={otherFields}
        defaultFieldId={field.depends_on_field_id ?? undefined}
        defaultValue={field.depends_on_value ?? undefined}
      />

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
          <FieldEditor
            key={field.id}
            formId={formId}
            field={field}
            otherFields={fields.filter((f) => f.id !== field.id)}
            onDone={() => setEditingId(null)}
          />
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
                {field.client_field_key ? " · syncs to client profile" : ""}
                {field.depends_on_field_id
                  ? ` · shown only if "${fields.find((f) => f.id === field.depends_on_field_id)?.label}" = ${field.depends_on_value}`
                  : ""}
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-charcoal">Sync answer to client profile</label>
          <select name="clientFieldKey" defaultValue="" className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal">
            {CLIENT_FIELD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <DependsOnControl otherFields={fields} />

        <button type="submit" className="self-start rounded-sm border border-border px-4 py-1.5 text-sm text-charcoal hover:border-gold-deep">
          Add Field
        </button>
      </form>
    </div>
  );
}
