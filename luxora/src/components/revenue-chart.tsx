import { formatCents } from "@/lib/luxora/money";

export type RevenueDay = { dateStr: string; label: string; cents: number };

/**
 * Minimal real bar chart — no charting library in this project, and this
 * is a single series (net revenue per day), so a hand-built set of bars
 * with native title-attribute tooltips covers it without extra JS weight.
 */
export function RevenueChart({ days }: { days: RevenueDay[] }) {
  const maxCents = Math.max(1, ...days.map((d) => d.cents));
  const labelEvery = days.length > 14 ? 5 : days.length > 9 ? 2 : 1;

  return (
    <div>
      <div className="flex h-40 items-end gap-1">
        {days.map((day) => {
          const heightPct = Math.max(2, Math.round((day.cents / maxCents) * 100));
          return (
            <div key={day.dateStr} className="group relative flex-1" title={`${day.label} · ${formatCents(day.cents)}`}>
              <div
                className="mx-auto w-full rounded-t-sm bg-gold-deep/80 transition group-hover:bg-gold-deep"
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1 border-t border-border pt-2">
        {days.map((day, i) => (
          <div key={day.dateStr} className="flex-1 text-center text-[10px] text-ink/50">
            {i % labelEvery === 0 ? day.label : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
