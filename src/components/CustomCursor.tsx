"use client";

import { useEffect, useRef } from "react";

/**
 * A restrained desktop-only cursor ring — grows slightly over links and
 * buttons. Fine-pointer devices only; never touches mobile/touch, and
 * respects prefers-reduced-motion by not mounting at all.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      ring.classList.toggle("is-active", !!target.closest("a, button, [role='button'], summary"));
    };

    const tick = () => {
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] h-6 w-6 rounded-full border border-gold-deep/60 opacity-0 transition-[width,height,opacity] duration-200 [.has-custom-cursor_&]:opacity-100 [&.is-active]:h-9 [&.is-active]:w-9 [&.is-active]:border-gold-deep"
    />
  );
}
