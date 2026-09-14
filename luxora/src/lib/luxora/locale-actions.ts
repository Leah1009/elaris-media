"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/luxora/locale";
import type { Locale } from "@/lib/luxora/i18n";

/** Persists the visitor's language choice for unauthenticated pages (landing, login, register, public booking). */
export async function setPublicLocale(locale: Locale) {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
