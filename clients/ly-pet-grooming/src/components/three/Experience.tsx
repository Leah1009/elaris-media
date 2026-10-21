"use client";

import { useEffect, useState, type ComponentType } from "react";
import { stage } from "@/lib/stage";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Loads the 3D stage only after the page is interactive, so text and
 * buttons paint first (fast LCP). Without WebGL the page still works:
 * the slots keep their soft CSS backdrops.
 */
export default function Experience() {
  const [StageComp, setStageComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    stage.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.lowDetail = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    if (!hasWebGL()) return;

    let cancelled = false;
    const load = () =>
      import("./Stage").then((m) => {
        if (!cancelled) setStageComp(() => m.default);
      });
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback;
    const id = idle ? idle(load, { timeout: 1200 }) : window.setTimeout(load, 300);
    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(id);
    };
  }, []);

  return StageComp ? <StageComp /> : null;
}
