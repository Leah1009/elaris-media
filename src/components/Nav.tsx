"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import LangToggle from "./LangToggle";

const LINKS: { href: string; key: DictKey }[] = [
  { href: "#services", key: "nav.services" },
  { href: "#dental-billing", key: "nav.dental" },
  { href: "#admin-services", key: "nav.admin" },
  { href: "#about", key: "nav.about" },
  { href: "#faq", key: "nav.faq" },
  { href: "#contact", key: "nav.contact" },
];

export default function Nav() {
  const { t } = useLanguage();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? "bg-cream-soft/90 backdrop-blur border-b border-ink/10" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#home" className="font-display text-lg tracking-wide text-ink">
            Elaris <span className="text-gold-deep">Media</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] uppercase tracking-[0.08em] text-ink/70 transition hover:text-ink"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LangToggle className="hidden sm:flex" />
            <a
              href="#contact"
              className="hidden rounded-full bg-ink px-5 py-2.5 text-[12px] uppercase tracking-[0.12em] text-cream-soft transition hover:bg-gold-deep sm:inline-block"
            >
              {t("nav.bookCall")}
            </a>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={`block h-[1.5px] w-5 bg-ink transition ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
              />
              <span className={`block h-[1.5px] w-5 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`block h-[1.5px] w-5 bg-ink transition ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col gap-1 bg-cream px-6 pt-24 transition-transform duration-300 lg:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="border-b border-ink/10 py-4 font-display text-xl text-ink"
          >
            {t(link.key)}
          </a>
        ))}
        <div className="mt-6 flex items-center justify-between">
          <LangToggle />
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="rounded-full bg-ink px-5 py-2.5 text-[12px] uppercase tracking-[0.12em] text-cream-soft"
          >
            {t("nav.bookFreeCall")}
          </a>
        </div>
      </div>
    </>
  );
}
