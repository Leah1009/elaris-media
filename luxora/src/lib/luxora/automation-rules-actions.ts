"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const RuleSchema = z.object({
  name: z.string().min(1, "Name is required."),
  triggerType: z.enum(["appointment_completed", "appointment_no_show"]),
  templateId: z.uuid("Choose a template."),
  delayHours: z.coerce.number().min(0),
});

export async function createAutomationRule(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = RuleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("message_templates")
    .select("id")
    .eq("id", data.templateId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!template) {
    return { fieldErrors: { templateId: ["Choose a valid template."] } };
  }

  const { error } = await supabase.from("automation_rules").insert({
    business_id: ctx.business.id,
    name: data.name,
    trigger_type: data.triggerType,
    template_id: data.templateId,
    delay_hours: data.delayHours,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/automations");
  redirect("/dashboard/automations");
}

export async function setAutomationRuleActive(formData: FormData): Promise<void> {
  const ctx = await getBusinessContext();
  const ruleId = String(formData.get("ruleId"));
  const active = formData.get("active") === "true";

  const supabase = await createClient();
  await supabase.from("automation_rules").update({ active }).eq("id", ruleId).eq("business_id", ctx.business.id);

  revalidatePath("/dashboard/automations");
}

/**
 * Manually evaluates due automation rules right now, via the
 * run_due_automations SQL function (migration 036/037). Real unattended
 * scheduling needs something calling this periodically — see the comment
 * on that function — which isn't switched on here.
 */
export async function runAutomationsNow(): Promise<void> {
  const ctx = await getBusinessContext();
  const supabase = await createClient();
  await supabase.rpc("run_due_automations", { p_business_id: ctx.business.id });
  revalidatePath("/dashboard/automations");
}
