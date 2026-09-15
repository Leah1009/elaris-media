"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { MANUAL_METHODS } from "@/lib/luxora/payments";
import type { ActionState } from "@/lib/luxora/actions";

const Schema = z.object({
  methods: z.array(z.enum(MANUAL_METHODS)),
});

export async function updateEnabledManualMethods(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = Schema.safeParse({ methods: formData.getAll("methods") });
  if (!parsed.success) return { error: "Invalid selection." };

  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { error } = await supabase
    .from("businesses")
    .update({ enabled_manual_methods: parsed.data.methods })
    .eq("id", ctx.business.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/payments");
  return { success: true };
}
