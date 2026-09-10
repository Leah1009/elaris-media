"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-cream/95 shadow-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center px-6 py-5 sm:px-10 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className={`font-display text-sm uppercase tracking-[0.35em] transition-colors ${
            scrolled ? "text-charcoal" : "text-white"
          }`}
        >
          Luxore
        </Link>

        <nav aria-label="Primary" className="hidden items-center justify-self-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${
                scrolled ? "text-ink hover:text-gold-deep" : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center justify-self-end gap-5 md:flex">
          <Link
            href="/login"
            className={`text-sm font-medium tracking-wide transition-colors ${
              scrolled ? "text-ink hover:text-gold-deep" : "text-white/90 hover:text-white"
            }`}
          >
            Log In
          </Link>
          <Link
            href="/register"
            className={`rounded-sm px-5 py-2 text-sm font-medium tracking-wide transition ${
              scrolled
                ? "bg-charcoal text-white hover:bg-charcoal-soft"
                : "bg-gold-deep text-white hover:opacity-90"
            }`}
          >
            Start Free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={`flex h-9 w-9 flex-col items-center justify-center justify-self-end gap-1.5 md:hidden ${
            scrolled ? "text-charcoal" : "text-white"
          }`}
        >
          <span className="block h-px w-6 bg-current" />
          <span className="block h-px w-6 bg-current" />
          <span className="block h-px w-6 bg-current" />
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream px-6 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm uppercase tracking-[0.35em] text-charcoal">Luxore</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-2xl leading-none text-charcoal"
            >
              ✕
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-12 flex flex-col gap-6">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl text-charcoal"
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)} className="font-display text-2xl text-charcoal">
              Log In
            </Link>
          </nav>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="mt-auto rounded-sm bg-charcoal px-6 py-3.5 text-center text-sm font-medium tracking-wide text-white"
          >
            Start Your Free Month
          </Link>
        </div>
      ) : null}
    </header>
  );
}
