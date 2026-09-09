export const MANUAL_METHODS = ["cash", "zelle", "cash_app", "other"] as const;
export const CARD_METHODS = ["card", "terminal", "tap_to_pay"] as const;

export const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  zelle: "Zelle",
  cash_app: "Cash App",
  other: "Other",
  card: "Card (online)",
  terminal: "Terminal",
  tap_to_pay: "Tap to Pay",
};

export function computeTax(subtotalCents: number, taxRatePercent: number): number {
  return Math.round((subtotalCents * taxRatePercent) / 100);
}

export function computeTotal({
  servicesCents,
  productsCents = 0,
  discountCents = 0,
  taxCents,
  tipCents = 0,
  depositAppliedCents = 0,
}: {
  servicesCents: number;
  productsCents?: number;
  discountCents?: number;
  taxCents: number;
  tipCents?: number;
  depositAppliedCents?: number;
}): number {
  return Math.max(
    0,
    servicesCents + productsCents - discountCents + taxCents + tipCents - depositAppliedCents,
  );
}
