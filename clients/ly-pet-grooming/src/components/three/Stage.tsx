"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { stage, subscribeSlots, type SlotId } from "@/lib/stage";
import { FinalRig, HeroRig, Lights, ServicesRig } from "./Rigs";

/**
 * One fixed, transparent WebGL canvas for the whole page.
 * Each <View> draws only inside its DOM "slot" (hero, services, final CTA),
 * so there is a single WebGL context and nothing is drawn over text.
 * Rendering stops completely while no slot is on screen.
 */
export default function Stage() {
  const [slots, setSlots] = useState(() => ({ ...stage.slots }));
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => subscribeSlots(() => setSlots({ ...stage.slots })), []);

  // Pause the render loop when no 3D slot is visible.
  useEffect(() => {
    const els = Object.values(slots).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setActive(visible.size > 0);
      },
      { rootMargin: "120px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slots]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stage.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const tracks = useMemo(() => {
    const out: Partial<Record<SlotId, React.RefObject<HTMLElement>>> = {};
    (Object.keys(slots) as SlotId[]).forEach((id) => {
      out[id] = { current: slots[id]! };
    });
    return out;
  }, [slots]);

  return (
    <Canvas
      className="stage-canvas"
      data-ready={ready}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      frameloop={active ? "always" : "never"}
      dpr={stage.lowDetail ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 30, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NeutralToneMapping,
      }}
      onCreated={() => requestAnimationFrame(() => setReady(true))}
    >
      {tracks.hero && (
        <View track={tracks.hero as React.RefObject<HTMLElement>}>
          <Lights />
          <HeroRig />
        </View>
      )}
      {tracks.services && (
        <View track={tracks.services as React.RefObject<HTMLElement>}>
          <Lights />
          <ServicesRig />
        </View>
      )}
      {tracks.final && (
        <View track={tracks.final as React.RefObject<HTMLElement>}>
          <Lights />
          <FinalRig />
        </View>
      )}
    </Canvas>
  );
}
