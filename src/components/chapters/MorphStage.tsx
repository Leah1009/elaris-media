"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ChapterPart } from "@/lib/chapters/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";

const MorphScene = dynamic(() => import("./MorphScene"), { ssr: false });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  clamp01((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

export type MorphStageCopyKeys = {
  fromEyebrow: DictKey;
  fromHeadline: DictKey;
  fromBody: DictKey;
  toEyebrow: DictKey;
  toHeadline: DictKey;
  toBody: DictKey;
  scrollHint: DictKey;
};

type MorphStageProps = {
  parts: ChapterPart[];
  copy: MorphStageCopyKeys;
  /** static mid-progress fallback used when the user prefers reduced motion */
  reducedProgress?: number;
};

export default function MorphStage({ parts, copy, reducedProgress = 0.5 }: MorphStageProps) {
  const { t } = useLanguage();
  const [lowDetail, setLowDetail] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const fromCaptionRef = useRef<HTMLDivElement>(null);
  const toCaptionRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    if (!ready || reducedMotion) return;
    if (!wrapperRef.current || !pinRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const applyCaptions = (p: number) => {
      if (fromCaptionRef.current) {
        fromCaptionRef.current.style.opacity = String(mapRange(p, 0, 0.28, 1, 0));
      }
      if (toCaptionRef.current) {
        toCaptionRef.current.style.opacity = String(mapRange(p, 0.72, 1, 0, 1));
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
    if (reducedMotion) progressRef.current = reducedProgress;
  }, [reducedMotion, reducedProgress]);

  if (!ready) {
    return <div className="h-screen w-full bg-cream" aria-hidden />;
  }

  if (reducedMotion) {
    return (
      <section className="relative flex h-screen w-full flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <div className="h-[46vh] w-full max-w-md">
          <MorphScene parts={parts} progressRef={progressRef} pointerRef={pointerRef} lowDetail={lowDetail} />
        </div>
        <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">{t(copy.toHeadline)}</h2>
        <p className="max-w-md text-sm text-ink/70">{t(copy.toBody)}</p>
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: lowDetail ? "220vh" : "320vh" }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-cream">
        <div className="absolute right-6 top-1/2 z-20 hidden h-40 w-[2px] -translate-y-1/2 bg-ink/10 md:block">
          <div ref={progressFillRef} className="absolute bottom-0 left-0 w-full bg-gold-deep" style={{ height: "0%" }} />
        </div>

        <div className="absolute inset-0">
          <MorphScene parts={parts} progressRef={progressRef} pointerRef={pointerRef} lowDetail={lowDetail} />
        </div>

        <div
          ref={fromCaptionRef}
          className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex flex-col items-center gap-3 px-6 text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.24em] text-gold-deep">{t(copy.fromEyebrow)}</span>
          <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">{t(copy.fromHeadline)}</h2>
          <p className="max-w-sm text-sm text-ink/70">{t(copy.fromBody)}</p>
        </div>

        <div
          ref={toCaptionRef}
          className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex flex-col items-center gap-3 px-6 text-center opacity-0"
        >
          <span className="text-[11px] uppercase tracking-[0.24em] text-gold-deep">{t(copy.toEyebrow)}</span>
          <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">{t(copy.toHeadline)}</h2>
          <p className="max-w-sm text-sm text-ink/70">{t(copy.toBody)}</p>
        </div>

        <div
          ref={scrollHintRef}
          className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink/50"
        >
          <span>{t(copy.scrollHint)}</span>
          <span className="block h-8 w-[1px] animate-pulse bg-ink/30" />
        </div>
      </div>
    </div>
  );
}
