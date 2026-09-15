"use client";

import { useState } from "react";
import { formatCents } from "@/lib/luxora/money";
import type { ChartBucket } from "@/lib/luxora/reports-data";

/**
 * One series today (gross), but every payment row already carries whether
 * it's a refund via the caller's netBuckets — kept as a second optional
 * series so a Gross/Net toggle costs nothing extra to add later without
 * refetching.
 */
export function BucketBarChart({
  buckets,
  netBuckets,
  grossLabel,
  netLabel,
  emptyLabel,
}: {
  buckets: ChartBucket[];
  netBuckets?: ChartBucket[];
  grossLabel: string;
  netLabel: string;
  emptyLabel: string;
}) {
  const [mode, setMode] = useState<"gross" | "net">("gross");
  const active = mode === "net" && netBuckets ? netBuckets : buckets;
  const hasData = active.some((b) => b.cents !== 0);
  const maxCents = Math.max(1, ...active.map((b) => Math.abs(b.cents)));
  const labelEvery = active.length > 20 ? 6 : active.length > 10 ? 3 : active.length > 6 ? 2 : 1;

  return (
    <div>
      {netBuckets ? (
        <div className="mb-3 flex w-fit overflow-hidden rounded-sm border border-border text-xs">
          <button
            type="button"
            onClick={() => setMode("gross")}
            className={`px-3 py-1 font-medium ${mode === "gross" ? "bg-charcoal text-white" : "bg-white text-charcoal"}`}
          >
            {grossLabel}
          </button>
          <button
            type="button"
            onClick={() => setMode("net")}
            className={`px-3 py-1 font-medium ${mode === "net" ? "bg-charcoal text-white" : "bg-white text-charcoal"}`}
          >
            {netLabel}
          </button>
        </div>
      ) : null}
      {!hasData ? (
        <p className="flex h-40 items-center justify-center text-sm text-ink/50">{emptyLabel}</p>
      ) : (
        <>
          <div className="flex h-40 items-end gap-1">
            {active.map((b) => {
              const heightPct = Math.max(2, Math.round((Math.abs(b.cents) / maxCents) * 100));
              return (
                <div key={b.key} className="group relative flex-1" title={`${b.label} · ${formatCents(b.cents)}`}>
                  <div
                    className="mx-auto w-full rounded-t-sm bg-gold-deep/80 transition group-hover:bg-gold-deep"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-1 border-t border-border pt-2">
            {active.map((b, i) => (
              <div key={b.key} className="flex-1 text-center text-[10px] text-ink/50">
                {i % labelEvery === 0 ? b.label : ""}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
