"use client";

import { useActionState } from "react";
import { updateOnlineBookingSettings } from "@/lib/luxora/online-booking-settings-actions";
import { CopyLinkButton } from "@/components/copy-link-button";
import { t, type Locale } from "@/lib/luxora/i18n";
import type { ActionState } from "@/lib/luxora/actions";

export function OnlineBookingSettingsForm({
  settings,
  bookingUrl,
  locale,
}: {
  settings: {
    online_booking_enabled: boolean;
    booking_window_days: number;
    min_notice_hours: number;
    buffer_minutes: number;
  };
  bookingUrl: string;
  locale: Locale;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateOnlineBookingSettings, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <section className="rounded-sm border border-border bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg text-charcoal">{t(locale, "online_booking_status_title")}</h2>
            <p className="mt-1 text-sm text-ink/70">{t(locale, "online_booking_status_desc")}</p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-charcoal">
            <input
              type="checkbox"
              name="onlineBookingEnabled"
              defaultChecked={settings.online_booking_enabled}
              className="h-4 w-4 accent-gold-deep"
            />
            {t(locale, "online_booking_status_toggle")}
          </label>
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink/50">
          {settings.online_booking_enabled ? t(locale, "online_booking_status_on") : t(locale, "online_booking_status_off")}
        </p>
      </section>

      <section className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "online_booking_rules_title")}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bookingWindowDays" className="text-sm font-medium text-charcoal">
              {t(locale, "online_booking_window_label")}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="bookingWindowDays"
                name="bookingWindowDays"
                type="number"
                min="1"
                defaultValue={settings.booking_window_days}
                className="w-20 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
              />
              <span className="text-sm text-ink/60">{t(locale, "unit_days")}</span>
            </div>
            {state?.fieldErrors?.bookingWindowDays ? (
              <p className="text-sm text-danger">{state.fieldErrors.bookingWindowDays[0]}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="minNoticeHours" className="text-sm font-medium text-charcoal">
              {t(locale, "online_booking_notice_label")}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="minNoticeHours"
                name="minNoticeHours"
                type="number"
                min="0"
                defaultValue={settings.min_notice_hours}
                className="w-20 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
              />
              <span className="text-sm text-ink/60">{t(locale, "unit_hours")}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bufferMinutes" className="text-sm font-medium text-charcoal">
              {t(locale, "online_booking_buffer_label")}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="bufferMinutes"
                name="bufferMinutes"
                type="number"
                min="0"
                defaultValue={settings.buffer_minutes}
                className="w-20 rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
              />
              <span className="text-sm text-ink/60">{t(locale, "unit_minutes")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-border bg-white p-6">
        <h2 className="font-display text-lg text-charcoal">{t(locale, "online_booking_link_title")}</h2>
        <p className="mt-1 text-sm text-ink/70">{t(locale, "online_booking_link_desc")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-sm bg-cream-deep px-3 py-2 font-mono text-xs text-charcoal">{bookingUrl}</span>
          <CopyLinkButton url={bookingUrl} label={t(locale, "copy_link")} copiedLabel={t(locale, "link_copied")} />
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-gold-deep underline underline-offset-2"
          >
            {t(locale, "online_booking_view_page")}
          </a>
        </div>
      </section>

      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-sm bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft disabled:opacity-60"
      >
        {pending ? t(locale, "saving_ellipsis") : t(locale, "save_changes")}
      </button>
    </form>
  );
}
