import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * No SMS provider is wired up. Sending SMS in the US requires a Twilio (or
 * similar) account plus A2P 10DLC campaign registration — a business/legal
 * process, not something that can be switched on from code. Once that
 * exists, set these env vars and getSmsClient() below stops throwing.
 */
export function isSmsConfigured(): boolean {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

/**
 * No transactional email provider is wired up (e.g. Resend, Postmark,
 * SendGrid) — same shape of blocker as SMS: needs a real account and API
 * key only the business owner can create.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_FROM_ADDRESS);
}

type SendMessageInput = {
  businessId: string;
  clientId: string;
  appointmentId?: string | null;
  automationRuleId?: string | null;
  channel: "sms" | "email";
  templateId?: string | null;
  toAddress: string | null;
  subject?: string | null;
  body: string;
  consentGiven: boolean;
};

/**
 * The single choke point every message send goes through — manual
 * "send review request" clicks and the automation evaluator alike. It
 * always writes an audit row to message_log, and only ever reaches a real
 * provider call once one is configured; until then every attempt is
 * logged honestly as provider_not_configured rather than silently
 * pretending to succeed.
 */
export async function sendMessage(
  supabase: SupabaseClient<Database>,
  input: SendMessageInput,
): Promise<{ status: "sent" | "failed" | "skipped_no_consent" | "provider_not_configured" }> {
  const configured = input.channel === "sms" ? isSmsConfigured() : isEmailConfigured();

  let status: "sent" | "failed" | "skipped_no_consent" | "provider_not_configured";
  let error: string | null = null;

  if (!input.consentGiven) {
    status = "skipped_no_consent";
  } else if (!configured) {
    status = "provider_not_configured";
  } else {
    // Real provider integration goes here once Twilio/email credentials
    // exist. Left unimplemented rather than faked.
    status = "failed";
    error = "Provider is configured but no send implementation exists yet.";
  }

  await supabase.from("message_log").insert({
    business_id: input.businessId,
    client_id: input.clientId,
    appointment_id: input.appointmentId ?? null,
    automation_rule_id: input.automationRuleId ?? null,
    channel: input.channel,
    template_id: input.templateId ?? null,
    to_address: input.toAddress,
    subject: input.subject ?? null,
    body: input.body,
    status,
    error,
  });

  return { status };
}
