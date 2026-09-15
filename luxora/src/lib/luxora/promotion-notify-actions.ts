"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { sendMessage } from "@/lib/luxora/messaging";
import type { ActionState } from "@/lib/luxora/actions";

const NotifySchema = z.object({
  promotionId: z.uuid(),
  audience: z.enum(["all", "selected"]),
  clientIds: z.array(z.uuid()).optional().default([]),
  channels: z.array(z.enum(["email", "sms", "whatsapp"])).min(1, "Choose at least one channel."),
  message: z.string().min(1, "Write a message to send."),
});

/**
 * Sends a promotion to a chosen audience over one or more channels, reusing
 * the same consent-checked send pipeline (and honest
 * provider_not_configured logging) as every other message in the app —
 * WhatsApp and SMS both ride sms_consent since they share a phone number.
 */
export async function notifyClientsOfPromotion(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = NotifySchema.safeParse({
    promotionId: formData.get("promotionId"),
    audience: formData.get("audience"),
    clientIds: formData.getAll("clientIds"),
    channels: formData.getAll("channels"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid request." };
  }
  const data = parsed.data;
  if (data.audience === "selected" && data.clientIds.length === 0) {
    return { error: "Select at least one client." };
  }

  const ctx = await getBusinessContext();
  const supabase = await createClient();

  const { data: promotion } = await supabase
    .from("promotions")
    .select("id")
    .eq("id", data.promotionId)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!promotion) return { error: "Promotion not found." };

  let clientsQuery = supabase
    .from("clients")
    .select("id, phone, email, sms_consent, email_consent")
    .eq("business_id", ctx.business.id);
  if (data.audience === "selected") clientsQuery = clientsQuery.in("id", data.clientIds);
  const { data: clients } = await clientsQuery;

  let sentCount = 0;
  let attemptedCount = 0;
  for (const client of clients ?? []) {
    for (const channel of data.channels) {
      const toAddress = channel === "email" ? client.email : client.phone;
      if (!toAddress) continue;
      const consentGiven = channel === "email" ? client.email_consent : client.sms_consent;

      attemptedCount += 1;
      const result = await sendMessage(supabase, {
        businessId: ctx.business.id,
        clientId: client.id,
        channel,
        toAddress,
        body: data.message,
        consentGiven,
      });
      if (result.status === "sent") sentCount += 1;
    }
  }

  if (attemptedCount === 0) {
    return { error: "None of the selected clients have contact info for the chosen channels." };
  }

  return {
    success: true,
    message:
      sentCount > 0
        ? `Sent to ${sentCount} of ${attemptedCount} attempted.`
        : `Logged ${attemptedCount} send attempt${attemptedCount === 1 ? "" : "s"} — none went through yet because no provider is connected.`,
  };
}
