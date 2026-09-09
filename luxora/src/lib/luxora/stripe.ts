import "server-only";
import Stripe from "stripe";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super("Stripe is not connected yet. Add STRIPE_SECRET_KEY to enable payments.");
    this.name = "StripeNotConfiguredError";
  }
}

let cachedClient: Stripe | null = null;

/**
 * Every Stripe-dependent code path in the app calls this instead of
 * constructing a client directly, so "no keys yet" fails in one
 * predictable, catchable way instead of a raw SDK error wherever it
 * happens to first get used.
 */
export function getStripeClient(): Stripe {
  if (cachedClient) return cachedClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new StripeNotConfiguredError();
  }

  cachedClient = new Stripe(secretKey);
  return cachedClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
