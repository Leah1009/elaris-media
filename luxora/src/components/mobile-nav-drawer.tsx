"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { t, type Locale } from "@/lib/luxora/i18n";
import { DashboardNav } from "@/components/dashboard-nav";

/**
 * Mobile-only nav: an overlay drawer instead of the old inline <details>
 * accordion, which used to push all page content down by the full nav
 * height. Desktop keeps the static <aside> in the layout untouched.
 */
export function MobileNavDrawer({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation. Adjusting state from a prop change
  // during render (React's documented pattern for this) instead of an
  // effect, so it takes effect before paint with no extra render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="border-b border-border bg-white md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-charcoal"
      >
        <span aria-hidden>☰</span> {t(lang, "menu")}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-sm uppercase tracking-[0.25em] text-charcoal">Luxore</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t(lang, "cancel")}
                className="text-lg text-ink/50 hover:text-charcoal"
              >
                ✕
              </button>
            </div>
            <DashboardNav lang={lang} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
