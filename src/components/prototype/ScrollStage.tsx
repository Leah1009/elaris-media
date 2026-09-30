"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, type Lang } from "@/lib/prototype/copy";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  clamp01((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

export default function ScrollStage() {
  const [lang, setLang] = useState<Lang>("en");
  const [lowDetail, setLowDetail] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cameraCaptionRef = useRef<HTMLDivElement>(null);
  const phoneCaptionRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Detect viewport size + reduced-motion preference once on mount, and keep
  // them in sync if the user changes settings mid-session.
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setLowDetail(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    update();
    setReady(true);

    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  // Scroll-driven timeline: GSAP ScrollTrigger writes the scroll progress
  // (0..1) into a ref that the R3F rig reads in its own render loop, and
  // updates the HTML captions imperatively — nothing here re-renders React
  // on every scroll tick.
  useEffect(() => {
    if (!ready || reducedMotion) return;
    if (!wrapperRef.current || !pinRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const applyCaptions = (p: number) => {
      if (cameraCaptionRef.current) {
        cameraCaptionRef.current.style.opacity = String(mapRange(p, 0, 0.28, 1, 0));
      }
      if (phoneCaptionRef.current) {
        phoneCaptionRef.current.style.opacity = String(mapRange(p, 0.72, 1, 0, 1));
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.height = `${p * 100}%`;
      }
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(mapRange(p, 0, 0.06, 1, 0));
      }
    };

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          applyCaptions(self.progress);
        },
      });
      applyCaptions(0);
      return () => trigger.kill();
    }, wrapperRef);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  // Subtle pointer parallax — desktop, fine-pointer only, purely input-driven
  // (never time-driven), so it never reads as autoplay.
  useEffect(() => {
    if (!ready || reducedMotion || lowDetail) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const onMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready, reducedMotion, lowDetail]);

  useEffect(() => {
    if (reducedMotion) progressRef.current = 0.5;
  }, [reducedMotion]);

  const t = copy[lang];

  const langToggle = (
    <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-cream-soft/80 p-1 text-[11px] uppercase tracking-[0.14em] backdrop-blur">
      {(["en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 transition ${
            lang === l ? "bg-ink text-cream-soft" : "text-ink/60 hover:text-ink"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  if (!ready) {
    return <div className="h-screen w-full bg-cream" aria-hidden />;
  }

  if (reducedMotion) {
    return (
      <section className="relative flex h-screen w-full flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <div className="absolute right-6 top-6 z-10">{langToggle}</div>
        <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t.kicker}</span>
        <div className="h-[46vh] w-full max-w-md">
          <Scene progressRef={progressRef} pointerRef={pointerRef} lowDetail={lowDetail} />
        </div>
        <h1 className="max-w-lg font-display text-3xl text-ink md:text-4xl">
          {t.reduced.headline}
        </h1>
        <p className="max-w-md text-sm text-ink/70">{t.reduced.body}</p>
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: lowDetail ? "220vh" : "320vh" }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-cream">
        <div className="absolute right-6 top-6 z-20">{langToggle}</div>

        <div className="absolute left-6 top-6 z-20 text-[11px] uppercase tracking-[0.28em] text-gold-deep">
          {t.kicker}
        </div>

        {/* Scroll progress rail */}
        <div className="absolute right-6 top-1/2 z-20 hidden h-40 w-[2px] -translate-y-1/2 bg-ink/10 md:block">
          <div ref={progressFillRef} className="absolute bottom-0 left-0 w-full bg-gold-deep" style={{ height: "0%" }} />
        </div>

        <div className="absolute inset-0">
          <Scene progressRef={progressRef} pointerRef={pointerRef} lowDetail={lowDetail} />
        </div>

        <div
          ref={cameraCaptionRef}
          className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex flex-col items-center gap-3 px-6 text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.24em] text-gold-deep">
            {t.camera.eyebrow}
          </span>
          <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">
            {t.camera.headline}
          </h2>
          <p className="max-w-sm text-sm text-ink/70">{t.camera.body}</p>
        </div>

        <div
          ref={phoneCaptionRef}
          className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex flex-col items-center gap-3 px-6 text-center opacity-0"
        >
          <span className="text-[11px] uppercase tracking-[0.24em] text-gold-deep">
            {t.phone.eyebrow}
          </span>
          <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">
            {t.phone.headline}
          </h2>
          <p className="max-w-sm text-sm text-ink/70">{t.phone.body}</p>
        </div>

        <div
          ref={scrollHintRef}
          className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink/50"
        >
          <span>{t.scrollHint}</span>
          <span className="block h-8 w-[1px] animate-pulse bg-ink/30" />
        </div>
      </div>
    </div>
  );
}
