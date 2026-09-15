export function BarList({
  rows,
  emptyLabel,
}: {
  rows: { label: string; value: number; display: string }[];
  emptyLabel: string;
}) {
  const hasData = rows.some((r) => r.value > 0);
  const max = Math.max(1, ...rows.map((r) => r.value));

  if (!hasData) {
    return <p className="py-6 text-center text-sm text-ink/50">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-ink/70">{r.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-deep">
            <div className="h-full rounded-full bg-gold-deep" style={{ width: `${Math.round((r.value / max) * 100)}%` }} />
          </div>
          <span className="w-16 shrink-0 text-right text-charcoal">{r.display}</span>
        </div>
      ))}
    </div>
  );
}
