"use client";

import { useState } from "react";

export function WaitlistJoin({ slug, serviceIds }: { slug: string; serviceIds: string[] }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (joined) {
    return <p className="mt-3 text-sm text-charcoal">You&apos;re on the waitlist — we&apos;ll reach out if a spot opens up.</p>;
  }

  async function submit() {
    if (!fullName || !phone) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/${slug}/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, serviceId: serviceIds[0] }),
      });
      if (!res.ok) {
        setError("Could not join the waitlist. Please try again.");
        return;
      }
      setJoined(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
      />
      <input
        placeholder="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="rounded-sm border border-border px-3 py-2 text-sm text-charcoal"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="button"
        onClick={submit}
        disabled={submitting || !fullName || !phone}
        className="self-start rounded-sm border border-border px-4 py-2 text-sm font-medium text-charcoal hover:border-gold-deep disabled:opacity-50"
      >
        {submitting ? "Joining…" : "Join Waitlist"}
      </button>
    </div>
  );
}
