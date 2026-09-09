import "server-only";
import { headers } from "next/headers";

/**
 * Resolves the app's own public base URL for building redirect/callback
 * URLs (Stripe onboarding return links, webhooks). Prefers an explicit env
 * var — set this once the app has a real deployed domain — and falls back
 * to the incoming request's host so it also works before that's set.
 */
export async function getAppUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
