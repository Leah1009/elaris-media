"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import { DEPTH_TIMELINE_DESKTOP, DEPTH_TIMELINE_MOBILE } from "@/lib/depth/timeline";

const DepthScene = dynamic(() => import("./DepthScene"), { ssr: false });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  clamp01((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

type CaptionCopy = { eyebrow: DictKey; headline: DictKey; body: DictKey; segment: [number, number] };

// Captions run on their OWN, tighter schedule than the 3D objects. The
// objects deliberately overlap for the depth-travel feel, but two blocks of
// readable text on screen at once is just illegible — so each caption gets
// a clean crossfade window that never significantly overlaps its neighbor.
const CAPTION_FADE = 0.05;

const CAPTIONS_DESKTOP: CaptionCopy[] = [
  { eyebrow: "hero.camera.eyebrow", headline: "hero.camera.headline", body: "hero.camera.body", segment: [0.1, 0.24] },
  { eyebrow: "hero.phone.eyebrow", headline: "hero.phone.headline", body: "hero.phone.body", segment: [0.4, 0.51] },
  { eyebrow: "hero.laptop.eyebrow", headline: "hero.laptop.headline", body: "hero.laptop.body", segment: [0.66, 0.76] },
  { eyebrow: "hero.grow.eyebrow", headline: "hero.grow.headline", body: "hero.grow.body", segment: [0.9, 1.0] },
];

const CAPTIONS_MOBILE: CaptionCopy[] = [
  { eyebrow: "hero.camera.eyebrow", headline: "hero.camera.headline", body: "hero.camera.body", segment: [0.11, 0.22] },
  { eyebrow: "hero.phone.eyebrow", headline: "hero.phone.headline", body: "hero.phone.body", segment: [0.45, 0.55] },
  { eyebrow: "hero.laptop.eyebrow", headline: "hero.laptop.headline", body: "hero.laptop.body", segment: [0.74, 0.82] },
  { eyebrow: "hero.grow.eyebrow", headline: "hero.grow.headline", body: "hero.grow.body", segment: [0.96, 1.0] },
];

function captionOpacity(p: number, [segStart, segEnd]: [number, number]) {
  if (p < segStart - CAPTION_FADE) return 0;
  if (p < segStart) return mapRange(p, segStart - CAPTION_FADE, segStart, 0, 1);
  if (p <= segEnd) return 1;
  if (p < segEnd + CAPTION_FADE) return mapRange(p, segEnd, segEnd + CAPTION_FADE, 1, 0);
  return 0;
}

export default function CinematicHero() {
  const { t } = useLanguage();
  const [lowDetail, setLowDetail] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const camOverlayRef = useRef<HTMLDivElement>(null);

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

  const timeline = lowDetail ? DEPTH_TIMELINE_MOBILE : DEPTH_TIMELINE_DESKTOP;
  const captions = lowDetail ? CAPTIONS_MOBILE : CAPTIONS_DESKTOP;
  const cameraConfig = timeline[0];

  useEffect(() => {
    if (!ready || reducedMotion) return;
    if (!wrapperRef.current || !pinRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const applyFrame = (p: number) => {
      captions.forEach((copy, i) => {
        const el = captionRefs.current[i];
        if (el) el.style.opacity = String(captionOpacity(p, copy.segment));
      });
      if (progressFillRef.current) progressFillRef.current.style.height = `${p * 100}%`;
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(mapRange(p, 0, 0.05, 1, 0));
      }
      if (camOverlayRef.current) {
        const camWin = cameraConfig.window;
        const fadeIn = mapRange(p, camWin.inStart, camWin.inPeak, 0, 1);
        const fadeOut = mapRange(p, camWin.outPeak, camWin.outEnd, 1, 0);
        camOverlayRef.current.style.opacity = String(Math.min(fadeIn, fadeOut));
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
          applyFrame(self.progress);
        },
      });
      applyFrame(0);
      return () => trigger.kill();
    }, wrapperRef);

    return () => ctx.revert();
  }, [ready, reducedMotion, timeline, captions, cameraConfig]);

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
    if (reducedMotion) progressRef.current = 1;
  }, [reducedMotion]);

  if (!ready) {
    return <div className="h-screen w-full bg-cream" aria-hidden />;
  }

  if (reducedMotion) {
    return (
      <section className="relative flex h-screen w-full flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <div className="h-[46vh] w-full max-w-md">
          <DepthScene
            objects={[{ ...DEPTH_TIMELINE_DESKTOP[3] }]}
            progressRef={progressRef}
            pointerRef={pointerRef}
            lowDetail={lowDetail}
          />
        </div>
        <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">{t("hero.grow.headline")}</h2>
        <p className="max-w-md text-sm text-ink/70">{t("hero.grow.body")}</p>
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: lowDetail ? "400vh" : "480vh" }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-cream">
        <div className="absolute right-6 top-1/2 z-20 hidden h-40 w-[2px] -translate-y-1/2 bg-ink/10 md:block">
          <div ref={progressFillRef} className="absolute bottom-0 left-0 w-full bg-gold-deep" style={{ height: "0%" }} />
        </div>

        <div className="absolute inset-0">
          <DepthScene objects={timeline} progressRef={progressRef} pointerRef={pointerRef} lowDetail={lowDetail} />
        </div>

        {/* Restrained camera UI detail — focus brackets + REC, HTML overlay
            rather than 3D so the text stays crisp; visible only during the
            camera's own window. */}
        <div
          ref={camOverlayRef}
          className={`pointer-events-none absolute left-1/2 z-10 h-[30vh] w-[26vh] max-w-[240px] -translate-x-1/2 -translate-y-1/2 opacity-0 md:h-[38vh] md:w-[30vh] md:max-w-[280px] ${
            lowDetail ? "top-[34%]" : "top-1/2"
          }`}
        >
          <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-gold-light/70" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-gold-light/70" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-gold-light/70" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-gold-light/70" />
          <span className="absolute right-1 top-1 flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-gold-light">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {t("hero.rec")}
          </span>
        </div>

        <div className="absolute left-6 top-6 z-20 text-[11px] uppercase tracking-[0.28em] text-gold-deep">
          {t("hero.kicker")}
        </div>

        {captions.map((copy, i) => (
          <div
            key={copy.headline}
            ref={(el) => {
              captionRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex flex-col items-center gap-3 px-6 text-center opacity-0"
          >
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold-deep">{t(copy.eyebrow)}</span>
            <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">{t(copy.headline)}</h2>
            <p className="max-w-sm text-sm text-ink/70">{t(copy.body)}</p>
          </div>
        ))}

        <div
          ref={scrollHintRef}
          className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink/50"
        >
          <span>{t("hero.scrollHint")}</span>
          <span className="block h-8 w-[1px] animate-pulse bg-ink/30" />
        </div>
      </div>
    </div>
  );
}
