export function ReviewsPlaceholder() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-md border border-dashed border-border bg-cream-deep/30 p-6">
          <div className="flex gap-1 text-border">
            {"★★★★★".split("").map((_, s) => (
              <span key={s}>★</span>
            ))}
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-charcoal/10" />
          <div className="mt-2 h-2 w-2/3 rounded-full bg-charcoal/10" />
          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-ink/40">Coming soon</p>
        </div>
      ))}
      <p className="col-span-full text-center text-sm text-ink/60">
        Real reviews from Luxore businesses will appear here once they&apos;re in.
      </p>
    </div>
  );
}
