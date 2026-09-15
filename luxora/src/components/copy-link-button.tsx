"use client";

import { useState } from "react";

export function CopyLinkButton({ url, label, copiedLabel }: { url: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (permissions, insecure context) —
      // the link is still visible as plain text, so this fails silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-charcoal transition hover:border-gold-deep"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
