"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerBusiness, type ActionState } from "@/lib/luxora/actions";
import { FormField } from "@/components/form-field";
import { BUSINESS_TYPES, US_STATES } from "@/lib/luxora/business-types";
import { t, type Locale } from "@/lib/luxora/i18n";

export function RegisterForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    registerBusiness,
    null,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [businessType, setBusinessType] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "es">(locale);

  const step1HasErrors = Boolean(
    state?.fieldErrors &&
      Object.keys(state.fieldErrors).some((key) =>
        [
          "businessName",
          "ownerFullName",
          "businessPhone",
          "businessEmail",
          "addressLine1",
          "city",
          "state",
          "zip",
          "businessType",
          "businessTypeOther",
        ].includes(key),
      ),
  );

  return (
    <>
      <ol className="mt-8 flex gap-6 text-sm font-medium text-ink" aria-label="Registration steps">
        <li className={step === 1 ? "text-charcoal" : ""}>{t(locale, "step1_label")}</li>
        <li className={step === 2 ? "text-charcoal" : ""}>{t(locale, "step2_label")}</li>
      </ol>

      <form action={formAction} className="mt-6 flex flex-col gap-5" noValidate>
        <fieldset hidden={step !== 1} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">
              {t(locale, "dashboard_language_label")} <span className="text-gold-deep">*</span>
            </label>
            <input type="hidden" name="preferredLanguage" value={preferredLanguage} />
            <div className="flex overflow-hidden rounded-sm border border-border">
              <button
                type="button"
                onClick={() => setPreferredLanguage("en")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
                  preferredLanguage === "en" ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-cream-deep"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPreferredLanguage("es")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
                  preferredLanguage === "es" ? "bg-charcoal text-white" : "bg-white text-charcoal hover:bg-cream-deep"
                }`}
              >
                Español
              </button>
            </div>
            <p className="text-xs text-ink/50">{t(locale, "dashboard_language_note")}</p>
          </div>

          <FormField
            label={t(locale, "field_business_name")}
            name="businessName"
            required
            errors={state?.fieldErrors?.businessName}
          />
          <FormField
            label={t(locale, "field_owner_full_name")}
            name="ownerFullName"
            required
            errors={state?.fieldErrors?.ownerFullName}
          />
          <FormField
            label={t(locale, "field_business_phone")}
            name="businessPhone"
            type="tel"
            required
            errors={state?.fieldErrors?.businessPhone}
          />
          <FormField
            label={t(locale, "field_business_email")}
            name="businessEmail"
            type="email"
            required
            errors={state?.fieldErrors?.businessEmail}
          />
          <FormField
            label={t(locale, "field_address")}
            name="addressLine1"
            required
            errors={state?.fieldErrors?.addressLine1}
          />
          <div className="grid grid-cols-3 gap-3">
            <FormField label={t(locale, "field_city")} name="city" required errors={state?.fieldErrors?.city} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="state" className="text-sm font-medium text-charcoal">
                {t(locale, "field_state")} <span className="text-gold-deep">*</span>
              </label>
              <select
                id="state"
                name="state"
                required
                defaultValue=""
                className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
              >
                <option value="" disabled>
                  —
                </option>
                {US_STATES.map((abbr) => (
                  <option key={abbr} value={abbr}>
                    {abbr}
                  </option>
                ))}
              </select>
            </div>
            <FormField label={t(locale, "field_zip")} name="zip" required errors={state?.fieldErrors?.zip} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="businessType" className="text-sm font-medium text-charcoal">
              {t(locale, "field_business_type")} <span className="text-gold-deep">*</span>
            </label>
            <select
              id="businessType"
              name="businessType"
              required
              defaultValue=""
              onChange={(e) => setBusinessType(e.target.value)}
              className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
            >
              <option value="" disabled>
                {t(locale, "select_business_type")}
              </option>
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt.value} value={bt.value}>
                  {bt.label}
                </option>
              ))}
            </select>
          </div>

          {businessType === "other" ? (
            <FormField
              label={t(locale, "field_business_type_other")}
              name="businessTypeOther"
              required
              errors={state?.fieldErrors?.businessTypeOther}
            />
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-charcoal">
              {t(locale, "field_description_optional")}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="rounded-sm border border-border bg-white px-3.5 py-2.5 text-base text-charcoal outline-none focus:border-gold-deep"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-2 rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
          >
            {t(locale, "continue_button")}
          </button>
        </fieldset>

        <fieldset hidden={step !== 2} className="flex flex-col gap-5">
          {step1HasErrors ? (
            <p className="text-sm text-danger">{t(locale, "step1_errors_note")}</p>
          ) : null}
          <FormField
            label={t(locale, "field_email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            errors={state?.fieldErrors?.email}
          />
          <FormField
            label={t(locale, "field_password")}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            errors={state?.fieldErrors?.password}
          />
          <FormField
            label={t(locale, "field_confirm_password")}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            errors={state?.fieldErrors?.confirmPassword}
          />

          {state?.error ? (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          ) : null}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-sm border border-border px-6 py-3 text-sm font-medium tracking-wide text-charcoal transition hover:border-gold-deep"
            >
              {t(locale, "back")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
            >
              {pending ? t(locale, "creating_account") : t(locale, "create_account_button")}
            </button>
          </div>
        </fieldset>
      </form>

      <p className="mt-6 text-sm text-ink">
        {t(locale, "already_have_account")}{" "}
        <Link href="/login" className="font-medium text-gold-deep underline underline-offset-2">
          {t(locale, "log_in_link")}
        </Link>
      </p>
    </>
  );
}
