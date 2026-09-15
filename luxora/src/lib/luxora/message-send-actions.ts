"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { sendMessage, isWhatsappConfigured, isSmsConfigured, isEmailConfigured } from "@/lib/luxora/messaging";
import type { ActionState } from "@/lib/luxora/actions";

const SendSchema = z.object({
  clientId: z.uuid(),
  body: z.string().min(1),
});

/**
 * Picks whichever real channel is actually connected — WhatsApp first
 * since that's the one most businesses expect to use here, then SMS, then
 * email — and reuses the same consent + message_log pipeline every other
 * send in the app goes through. WhatsApp and SMS share sms_consent: both
 * ride the same phone number and the same "can we text this number"
 * opt-in, so a separate whatsapp_consent flag would just duplicate it.
 */
export async function sendClientMessage(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = SendSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Message can't be empty." };
  }

  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("phone, email, sms_consent, email_consent")
    .eq("id", parsed.data.clientId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();

  if (!client) {
    return { error: "Client not found." };
  }

  let channel: "whatsapp" | "sms" | "email";
  let toAddress: string | null;
  let consentGiven: boolean;

  if (isWhatsappConfigured() && client.phone) {
    channel = "whatsapp";
    toAddress = client.phone;
    consentGiven = client.sms_consent;
  } else if (isSmsConfigured() && client.phone) {
    channel = "sms";
    toAddress = client.phone;
    consentGiven = client.sms_consent;
  } else if (isEmailConfigured() && client.email) {
    channel = "email";
    toAddress = client.email;
    consentGiven = client.email_consent;
  } else {
    return { error: "No messaging provider is connected yet." };
  }

  const result = await sendMessage(supabase, {
    businessId: ctx.business.id,
    clientId: parsed.data.clientId,
    channel,
    toAddress,
    body: parsed.data.body,
    consentGiven,
  });

  revalidatePath("/dashboard/messages");

  if (result.status === "sent") {
    return { success: true };
  }
  if (result.status === "skipped_no_consent") {
    return { error: "This client hasn't consented to messages on this channel." };
  }
  return { error: "Could not send that message." };
}
