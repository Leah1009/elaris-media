"use client";

import { useState } from "react";
import { t, type Locale } from "@/lib/luxora/i18n";

const STORAGE_KEY = "luxore_cookie_preferences";

type CookiePrefs = { analytics: boolean; preferences: boolean; marketing: boolean };

function savePrefs(prefs: CookiePrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Private browsing or blocked storage — nothing to persist, not fatal.
  }
}

function loadPrefs(): CookiePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fall through to defaults.
  }
  return { analytics: false, preferences: true, marketing: false };
}

export function CookiePreferencesLink({ locale, className }: { locale: Locale; className?: string }) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(() => (typeof window !== "undefined" ? loadPrefs() : { analytics: false, preferences: true, marketing: false }));

  function openModal() {
    setPrefs(loadPrefs());
    setOpen(true);
  }

  function saveAndClose(next: CookiePrefs) {
    savePrefs(next);
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        {t(locale, "footer_cookies")}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/60 px-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
            <h2 className="font-display text-xl text-charcoal">{t(locale, "cookie_modal_title")}</h2>
            <p className="mt-2 text-sm text-ink">{t(locale, "cookie_modal_intro")}</p>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">{t(locale, "cookie_necessary")}</p>
                  <p className="mt-0.5 text-xs text-ink/60">{t(locale, "cookie_necessary_desc")}</p>
                </div>
                <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink/40">
                  {t(locale, "cookie_always_on")}
                </span>
              </div>

              <label className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">{t(locale, "cookie_analytics")}</p>
                  <p className="mt-0.5 text-xs text-ink/60">{t(locale, "cookie_analytics_desc")}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  className="h-4 w-4 shrink-0 accent-gold-deep"
                />
              </label>

              <label className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">{t(locale, "cookie_preferences_cat")}</p>
                  <p className="mt-0.5 text-xs text-ink/60">{t(locale, "cookie_preferences_desc")}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.preferences}
                  onChange={(e) => setPrefs((p) => ({ ...p, preferences: e.target.checked }))}
                  className="h-4 w-4 shrink-0 accent-gold-deep"
                />
              </label>

              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">{t(locale, "cookie_marketing")}</p>
                  <p className="mt-0.5 text-xs text-ink/60">{t(locale, "cookie_marketing_desc")}</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  className="h-4 w-4 shrink-0 accent-gold-deep"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => saveAndClose({ analytics: false, preferences: true, marketing: false })}
                className="flex-1 rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold-deep"
              >
                {t(locale, "cookie_reject_nonessential")}
              </button>
              <button
                type="button"
                onClick={() => saveAndClose(prefs)}
                className="flex-1 rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold-deep"
              >
                {t(locale, "cookie_save_preferences")}
              </button>
              <button
                type="button"
                onClick={() => saveAndClose({ analytics: true, preferences: true, marketing: true })}
                className="flex-1 rounded-sm bg-charcoal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal-soft"
              >
                {t(locale, "cookie_accept_all")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
