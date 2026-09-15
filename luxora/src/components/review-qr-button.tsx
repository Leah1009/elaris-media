"use client";

import { useState } from "react";
import QRCode from "qrcode";

export function ReviewQrButton({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setOpen(true);
    if (dataUrl || error) return;
    try {
      const png = await QRCode.toDataURL(url, { width: 320, margin: 2 });
      setDataUrl(png);
    } catch {
      setError("Couldn't generate the QR code. Try again.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep"
      >
        Get QR
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex w-full max-w-sm flex-col items-center gap-4 rounded-sm bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg text-charcoal">Scan for reviews</h2>
            <p className="text-center text-xs text-ink/60">
              Print this and display it in-salon so clients can view or leave a review.
            </p>
            {error ? (
              <p className="text-sm text-danger">{error}</p>
            ) : dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="QR code linking to your reviews page" className="h-64 w-64" />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center text-sm text-ink/50">Generating…</div>
            )}
            <p className="break-all text-center text-xs text-ink/50">{url}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm bg-charcoal px-5 py-2 text-sm font-medium text-white hover:bg-charcoal-soft"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
