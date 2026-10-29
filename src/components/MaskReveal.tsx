"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type MaskRevealProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  html?: string;
  children?: React.ReactNode;
  delay?: number;
};

export default function MaskReveal({ as = "h2", className = "", html, children, delay = 0 }: MaskRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!innerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(innerRef.current, {
        yPercent: 110,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 88%" },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [delay]);

  const Tag = as;

  return (
    <div ref={wrapRef} className="overflow-hidden">
      {html ? (
        <Tag ref={innerRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <Tag ref={innerRef} className={className}>
          {children}
        </Tag>
      )}
    </div>
  );
}
