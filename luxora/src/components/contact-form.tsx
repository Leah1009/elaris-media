"use client";

import { useActionState } from "react";
import { submitContactRequest } from "@/lib/luxora/contact-actions";
import { FormField } from "@/components/form-field";
import { t, type Locale } from "@/lib/luxora/i18n";

const REASONS = [
  "sales",
  "existing_customer",
  "billing",
  "payments",
  "partnership",
  "privacy",
  "other",
] as const;

const REASON_LABEL_KEY: Record<(typeof REASONS)[number], Parameters<typeof t>[1]> = {
  sales: "reason_sales",
  existing_customer: "reason_existing_customer",
  billing: "reason_billing",
  payments: "reason_payments",
  partnership: "reason_partnership",
  privacy: "reason_privacy",
  other: "reason_other",
};

export function ContactForm({ locale, defaultReason }: { locale: Locale; defaultReason?: string }) {
  const [state, formAction, pending] = useActionState(submitContactRequest, null);

  if (state?.success) {
    return (
      <div className="rounded-sm border border-gold-deep bg-cream-deep p-6 text-center">
        <p className="text-charcoal">{t(locale, "contact_thank_you")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label={t(locale, "field_first_name")} name="firstName" required errors={state?.fieldErrors?.firstName} />
        <FormField label={t(locale, "field_last_name")} name="lastName" required errors={state?.fieldErrors?.lastName} />
      </div>
      <FormField label={t(locale, "field_business_name_optional")} name="businessName" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label={t(locale, "field_email")} name="email" type="email" required errors={state?.fieldErrors?.email} />
        <FormField label={t(locale, "field_phone_optional")} name="phone" type="tel" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reason" className="text-sm font-medium text-charcoal">
          {t(locale, "field_reason_for_contact")} <span className="text-gold-deep">*</span>
        </label>
        <select
          id="reason"
          name="reason"
          required
          defaultValue={defaultReason === "demo" ? "sales" : ""}
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="" disabled>
            —
          </option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {t(locale, REASON_LABEL_KEY[r])}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-charcoal">
          {t(locale, "field_message")} <span className="text-gold-deep">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        />
        {state?.fieldErrors?.message ? <p className="text-sm text-danger">{state.fieldErrors.message[0]}</p> : null}
      </div>

      {/* Honeypot — hidden from real visitors, catches simple bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state?.error === "rate_limited" ? <p className="text-sm text-danger">{t(locale, "contact_rate_limited")}</p> : null}
      {state?.error && state.error !== "rate_limited" ? <p className="text-sm text-danger">{t(locale, "generic_form_error")}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? t(locale, "sending_ellipsis") : t(locale, "send_message_button")}
      </button>
    </form>
  );
}
