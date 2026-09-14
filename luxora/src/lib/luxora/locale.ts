import { cookies } from "next/headers";
import type { Locale } from "@/lib/luxora/i18n";

export const LOCALE_COOKIE = "luxore_locale";

/** Locale for unauthenticated pages (landing, login, register), before any business/user record exists. */
export async function getPublicLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "es" ? "es" : "en";
}

/**
 * Locale for a business's public page/booking wizard, driven by that
 * business's `public_language_mode` (en / es / both) rather than the
 * visitor's own preference — except in "both" mode, where the visitor's
 * cookie choice (if any) picks between the two.
 */
export async function getBusinessPublicLocale(publicLanguageMode: string): Promise<Locale> {
  if (publicLanguageMode === "es") return "es";
  if (publicLanguageMode === "both") return getPublicLocale();
  return "en";
}
