"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const TemplateSchema = z.object({
  name: z.string().min(1, "Name is required."),
  type: z.enum(["appointment_reminder", "appointment_confirmation", "review_request", "marketing", "custom"]),
  channel: z.enum(["sms", "email"]),
  subject: z.string().optional(),
  body: z.string().min(1, "Message body is required."),
});

export async function createMessageTemplate(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = TemplateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("message_templates").insert({
    business_id: ctx.business.id,
    name: data.name,
    type: data.type,
    channel: data.channel,
    subject: data.channel === "email" ? data.subject || null : null,
    body: data.body,
  });

  if (error) {
    if (error.code === "23505") return { fieldErrors: { name: ["A template with this name already exists."] } };
    return { error: error.message };
  }

  revalidatePath("/dashboard/automations");
  redirect("/dashboard/automations");
}

export async function setTemplateActive(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const templateId = String(formData.get("templateId"));
  const active = formData.get("active") === "true";

  const supabase = await createClient();
  await supabase
    .from("message_templates")
    .update({ active })
    .eq("id", templateId)
    .eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/automations");
}
