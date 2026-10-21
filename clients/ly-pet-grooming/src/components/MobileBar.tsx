"use client";

import { useEffect, useState } from "react";
import { bookingHref, telHref, whatsappHref } from "@/lib/links";

/** Bottom booking bar on phones — appears once the hero buttons are out of view. */
export default function MobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`mobile-bar${show ? " is-visible" : ""}`} aria-hidden={!show}>
      <a href={telHref} className="mobile-bar__alt" tabIndex={show ? 0 : -1}>
        Call
      </a>
      <a href={whatsappHref} className="mobile-bar__alt" target="_blank" rel="noopener" tabIndex={show ? 0 : -1}>
        WhatsApp
      </a>
      <a href={bookingHref} className="btn btn--dark" target="_blank" rel="noopener" tabIndex={show ? 0 : -1}>
        Book Now
      </a>
    </div>
  );
}
