"use client";

import { useActionState } from "react";
import { submitSupportTicket } from "@/lib/luxora/support-actions";
import { t, type Locale } from "@/lib/luxora/i18n";

const CATEGORIES = [
  "account_login",
  "booking_calendar",
  "clients",
  "payments",
  "subscription_billing",
  "website",
  "inventory",
  "marketing",
  "technical",
  "other",
] as const;

const CATEGORY_LABEL_KEY: Record<(typeof CATEGORIES)[number], Parameters<typeof t>[1]> = {
  account_login: "category_account_login",
  booking_calendar: "category_booking_calendar",
  clients: "category_clients",
  payments: "category_payments",
  subscription_billing: "category_subscription_billing",
  website: "category_website",
  inventory: "category_inventory",
  marketing: "category_marketing",
  technical: "category_technical",
  other: "category_other",
};

export function SupportTicketForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitSupportTicket, null);

  if (state?.success) {
    return (
      <div className="rounded-sm border border-gold-deep bg-cream-deep p-6 text-center">
        <p className="text-charcoal">{t(locale, "support_ticket_thank_you")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-charcoal">
          {t(locale, "field_category")} <span className="text-gold-deep">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        >
          <option value="" disabled>
            —
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(locale, CATEGORY_LABEL_KEY[c])}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium text-charcoal">
          {t(locale, "field_subject")} <span className="text-gold-deep">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          required
          className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
        />
        {state?.fieldErrors?.subject ? <p className="text-sm text-danger">{state.fieldErrors.subject[0]}</p> : null}
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
