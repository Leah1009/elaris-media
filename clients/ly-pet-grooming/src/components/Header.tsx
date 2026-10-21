"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/content";
import { bookingHref } from "@/lib/links";

export default function Header({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (h: string) => (home ? h : `/${h}`);

  return (
    <header className={`header${scrolled || open ? " is-solid" : ""}`}>
      <div className="container header__inner">
        <a href={home ? "#top" : "/"} className="brand" aria-label={`${site.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width={44} height={44} />
          <span>{site.name}</span>
        </a>

        <nav className="header__nav" aria-label="Main">
          {nav.map((item) => (
            <a key={item.href} href={href(item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href={bookingHref} className="btn btn--dark btn--sm" target="_blank" rel="noopener">
          Book Now
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="header__bars" aria-hidden="true" />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <a key={item.href} href={href(item.href)} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href={bookingHref} className="btn btn--dark btn--block" target="_blank" rel="noopener">
          Book an Appointment
        </a>
      </div>
    </header>
  );
}
