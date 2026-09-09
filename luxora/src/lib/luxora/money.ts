export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function dollarsToCents(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
