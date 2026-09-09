"use client";

import { useState } from "react";

export function ReviewForm({ token }: { token: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Choose a rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/public/review/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(json.error ?? "Could not submit your review.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="text-sm text-ink">Thank you — your review has been submitted.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className={`text-3xl ${n <= rating ? "text-gold-deep" : "text-ink/20"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your visit (optional)"
        rows={4}
        className="rounded-sm border border-border px-3 py-2 text-sm"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-sm bg-charcoal px-4 py-2 text-sm text-white transition hover:bg-charcoal/90 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
