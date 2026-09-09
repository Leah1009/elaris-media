"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import type { ActionState } from "@/lib/luxora/actions";

const ClientSchema = z.object({
  fullName: z.string().min(1, "Name is required."),
  phone: z.string().optional(),
  email: z.union([z.email("Enter a valid email."), z.literal("")]).optional(),
  birthday: z.string().optional(),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  notes: z.string().optional(),
});

function getTagIds(formData: FormData): string[] {
  return formData.getAll("tagIds").map(String).filter(Boolean);
}

async function syncClientTags(clientId: string, tagIds: string[]) {
  const supabase = await createClient();
  await supabase.from("client_tag_assignments").delete().eq("client_id", clientId);
  if (tagIds.length > 0) {
    await supabase
      .from("client_tag_assignments")
      .insert(tagIds.map((tag_id) => ({ client_id: clientId, tag_id })));
  }
}

export async function createClientRecord(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ClientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      business_id: ctx.business.id,
      full_name: data.fullName,
      phone: data.phone || null,
      email: data.email || null,
      birthday: data.birthday || null,
      address_line1: data.addressLine1 || null,
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (error || !client) {
    return { error: error?.message ?? "Could not create client." };
  }

  await syncClientTags(client.id, getTagIds(formData));

  revalidatePath("/dashboard/clients");
  redirect(`/dashboard/clients/${client.id}`);
}

export async function updateClientRecord(
  clientId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await getBusinessContext();
  const parsed = ClientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]> };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update({
      full_name: data.fullName,
      phone: data.phone || null,
      email: data.email || null,
      birthday: data.birthday || null,
      address_line1: data.addressLine1 || null,
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      notes: data.notes || null,
    })
    .eq("id", clientId)
    .eq("business_id", ctx.business.id);

  if (error) {
    return { error: error.message };
  }

  await syncClientTags(clientId, getTagIds(formData));

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${clientId}`);
  redirect(`/dashboard/clients/${clientId}`);
}
