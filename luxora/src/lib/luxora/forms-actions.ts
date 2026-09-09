"use server";

import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().optional(),
  trigger: z.enum(["manual", "first_visit_only", "every_appointment"]),
  serviceId: z.string().optional(),
});

export async function createForm(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = FormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: form, error } = await supabase
    .from("client_forms")
    .insert({
      business_id: ctx.business.id,
      name: data.name,
      description: data.description || null,
      trigger: data.trigger,
      service_id: data.serviceId || null,
    })
    .select("id")
    .single();

  if (error || !form) {
    return { error: error?.message ?? "Could not create form." };
  }

  revalidatePath("/dashboard/forms");
  redirect(`/dashboard/forms/${form.id}/edit`);
}

export async function updateForm(
  formId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = FormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("client_forms")
    .update({
      name: data.name,
      description: data.description || null,
      trigger: data.trigger,
      service_id: data.serviceId || null,
    })
    .eq("id", formId)
    .eq("business_id", ctx.business.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/forms/${formId}/edit`);
  return null;
}

export async function toggleFormActive(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const formId = String(formData.get("formId"));
  const isActive = formData.get("isActive") === "true";
  const supabase = await createClient();

  await supabase
    .from("client_forms")
    .update({ is_active: !isActive })
    .eq("id", formId)
    .eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/forms");
}

const FieldSchema = z.object({
  label: z.string().min(1, "Label is required."),
  fieldType: z.enum(["text", "textarea", "checkbox", "multiple_choice", "date", "signature", "consent"]),
  required: z.string().optional(),
  options: z.string().optional(),
});

function parseOptions(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const values = raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length > 0 ? values : null;
}

export async function addField(formId: string, formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const parsed = FieldSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const data = parsed.data;
  const supabase = await createClient();

  const { data: form } = await supabase
    .from("client_forms")
    .select("id")
    .eq("id", formId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!form) notFound();

  const { data: maxRow } = await supabase
    .from("form_fields")
    .select("sort_order")
    .eq("form_id", formId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("form_fields").insert({
    form_id: formId,
    label: data.label,
    field_type: data.fieldType,
    required: data.required === "on",
    options: data.fieldType === "multiple_choice" ? parseOptions(data.options) : null,
    sort_order: (maxRow?.sort_order ?? -1) + 1,
  });

  revalidatePath(`/dashboard/forms/${formId}/edit`);
}

export async function updateField(fieldId: string, formData: FormData): Promise<void> {
  const parsed = FieldSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;
  const data = parsed.data;
  const formId = String(formData.get("formId"));
  const supabase = await createClient();

  await supabase
    .from("form_fields")
    .update({
      label: data.label,
      field_type: data.fieldType,
      required: data.required === "on",
      options: data.fieldType === "multiple_choice" ? parseOptions(data.options) : null,
    })
    .eq("id", fieldId);

  revalidatePath(`/dashboard/forms/${formId}/edit`);
}

export async function deleteField(formData: FormData): Promise<void> {
  const fieldId = String(formData.get("fieldId"));
  const formId = String(formData.get("formId"));
  const supabase = await createClient();

  await supabase.from("form_fields").delete().eq("id", fieldId);
  revalidatePath(`/dashboard/forms/${formId}/edit`);
}

export async function moveField(formData: FormData): Promise<void> {
  const fieldId = String(formData.get("fieldId"));
  const formId = String(formData.get("formId"));
  const direction = String(formData.get("direction"));
  const supabase = await createClient();

  const { data: fields } = await supabase
    .from("form_fields")
    .select("id, sort_order")
    .eq("form_id", formId)
    .order("sort_order");

  if (!fields) return;
  const index = fields.findIndex((f) => f.id === fieldId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= fields.length) return;

  const a = fields[index];
  const b = fields[swapIndex];

  await supabase.from("form_fields").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("form_fields").update({ sort_order: a.sort_order }).eq("id", b.id);

  revalidatePath(`/dashboard/forms/${formId}/edit`);
}
