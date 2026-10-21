"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { stage } from "@/lib/stage";
import { services } from "@/content";
import type { ServiceObject } from "@/content";
import { getKit } from "./kit";
import { Bottle, Comb, Scissors } from "./Models";

type V3 = [number, number, number];
type Pose = { p: V3; r: V3; s: number };
type Trio = { scissors: Pose; comb: Pose; bottle: Pose; open: number };

const { damp, clamp } = THREE.MathUtils;

function applyPose(obj: THREE.Object3D | null, pose: Pose, lambda: number, dt: number) {
  if (!obj) return;
  if (!obj.userData.init) {
    // First frame: start small and slightly low so every object eases in.
    obj.userData.init = true;
    obj.scale.setScalar(0.0001);
    obj.position.set(pose.p[0], pose.p[1] - 0.6, pose.p[2] - 0.5);
    obj.rotation.set(pose.r[0], pose.r[1] - 0.6, pose.r[2]);
  }
  obj.position.set(
    damp(obj.position.x, pose.p[0], lambda, dt),
    damp(obj.position.y, pose.p[1], lambda, dt),
    damp(obj.position.z, pose.p[2], lambda, dt)
  );
  obj.rotation.set(
    damp(obj.rotation.x, pose.r[0], lambda, dt),
    damp(obj.rotation.y, pose.r[1], lambda, dt),
    damp(obj.rotation.z, pose.r[2], lambda, dt)
  );
  const s = damp(obj.scale.x, pose.s, lambda, dt);
  obj.scale.setScalar(Math.max(s, 0.0001));
  obj.visible = s > 0.01;
}

/** Adds a gentle idle float on top of a pose. */
function float(pose: Pose, t: number, phase: number, amount: number): Pose {
  if (!amount) return pose;
  return {
    p: [pose.p[0], pose.p[1] + Math.sin(t * 0.6 + phase) * 0.07 * amount, pose.p[2]],
    r: [
      pose.r[0] + Math.sin(t * 0.45 + phase) * 0.05 * amount,
      pose.r[1] + Math.sin(t * 0.35 + phase * 2) * 0.07 * amount,
      pose.r[2] + Math.cos(t * 0.5 + phase) * 0.03 * amount,
    ],
    s: pose.s,
  };
}

const add = (pose: Pose, dp: V3, dr: V3): Pose => ({
  p: [pose.p[0] + dp[0], pose.p[1] + dp[1], pose.p[2] + dp[2]],
  r: [pose.r[0] + dr[0], pose.r[1] + dr[1], pose.r[2] + dr[2]],
  s: pose.s,
});

const HIDDEN = (p: V3): Pose => ({ p, r: [0, 0, 0], s: 0 });

/* ───────────────────────── Hero ───────────────────────── */

const HERO: Trio = {
  scissors: { p: [0.1, 0.05, 0.6], r: [0.3, -0.45, 0.72], s: 0.84 },
  comb: { p: [-0.85, 1.45, -1.4], r: [0.55, 0.45, -0.38], s: 0.62 },
  bottle: { p: [1.0, -1.25, -0.9], r: [0.12, 0.5, -0.12], s: 0.62 },
  open: 0.26,
};

const HERO_MOBILE: Trio = {
  scissors: { p: [-0.1, 0.05, 0.4], r: [0.3, -0.45, 0.62], s: 0.78 },
  comb: HIDDEN([-1, 1.4, -1.4]),
  bottle: { p: [1.0, -0.65, -1.4], r: [0.12, 0.5, -0.12], s: 0.5 },
  open: 0.3,
};

/* ─────────────────────── Services ─────────────────────── */

const BACK_L: V3 = [-1.5, 1.55, -2.8];
const BACK_R: V3 = [1.5, -1.45, -2.8];
const back = (p: V3, r: V3, s = 0.36): Pose => ({ p, r, s });

const SERVICE_POSES: Record<ServiceObject, Trio> = {
  bottle: {
    bottle: { p: [0, -0.05, 0.5], r: [0.12, 0.5, -0.06], s: 1.08 },
    scissors: back(BACK_L, [0.2, -0.3, 0.8]),
    comb: back(BACK_R, [0.4, 0.3, -0.3]),
    open: 0.22,
  },
  "bottle-tilt": {
    bottle: { p: [0.05, -0.05, 0.5], r: [0.28, -0.9, 0.24], s: 1.02 },
    scissors: back(BACK_R, [0.2, 0.4, -0.6]),
    comb: back(BACK_L, [0.5, -0.3, 0.3]),
    open: 0.1,
  },
  scissors: {
    scissors: { p: [0.1, 0, 0.7], r: [0.25, -0.35, 0.62], s: 1.0 },
    bottle: back(BACK_R, [0.1, 0.6, -0.1]),
    comb: back(BACK_L, [0.4, 0.3, -0.3]),
    open: 0.32,
  },
  "scissors-closed": {
    scissors: { p: [0, 0, 0.7], r: [0.15, 0.55, -0.95], s: 1.0 },
    comb: back(BACK_L, [0.5, -0.2, 0.25]),
    bottle: back(BACK_R, [0.15, -0.4, 0.1]),
    open: 0.03,
  },
  comb: {
    comb: { p: [0, -0.1, 0.6], r: [0.38, 0.32, -0.22], s: 0.98 },
    scissors: back(BACK_R, [0.2, -0.3, 0.8]),
    bottle: back([-1.55, -1.35, -2.8], [0.1, 0.4, 0.05]),
    open: 0.2,
  },
  trio: {
    scissors: { p: [0.15, 0.25, 0.6], r: [0.3, -0.4, 0.7], s: 0.8 },
    comb: { p: [-0.7, 1.3, -0.8], r: [0.45, 0.35, -0.3], s: 0.58 },
    bottle: { p: [0.9, -1.1, -0.4], r: [0.12, 0.4, -0.1], s: 0.58 },
    open: 0.3,
  },
};

/** Which object is the protagonist of each pose (others are supporting). */
const LEAD: Record<ServiceObject, "scissors" | "comb" | "bottle" | null> = {
  bottle: "bottle",
  "bottle-tilt": "bottle",
  scissors: "scissors",
  "scissors-closed": "scissors",
  comb: "comb",
  trio: null,
};

/* ───────────────────────── Rigs ───────────────────────── */

function useTrioRefs() {
  return {
    root: useRef<THREE.Group>(null),
    scissors: useRef<THREE.Group>(null),
    comb: useRef<THREE.Group>(null),
    bottle: useRef<THREE.Group>(null),
    open: useRef(0),
  };
}

function useKitFromGl() {
  const gl = useThree((s) => s.gl);
  return getKit(gl, stage.lowDetail);
}

function Trio({ refs }: { refs: ReturnType<typeof useTrioRefs> }) {
  const kit = useKitFromGl();
  return (
    <group ref={refs.root}>
      <Scissors ref={refs.scissors} kit={kit} open={refs.open} />
      <Comb ref={refs.comb} kit={kit} />
      <Bottle ref={refs.bottle} kit={kit} />
    </group>
  );
}

function pointerTilt(root: THREE.Group | null, strength: number, dt: number) {
  if (!root) return;
  const m = stage.reducedMotion || stage.lowDetail ? 0 : strength;
  root.rotation.y = damp(root.rotation.y, stage.pointer.x * 0.2 * m, 2.5, dt);
  root.rotation.x = damp(root.rotation.x, -stage.pointer.y * 0.12 * m, 2.5, dt);
}

export function HeroRig() {
  const refs = useTrioRefs();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const el = stage.slots.hero;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // 0 while the hero is in view → 1 once it has scrolled away.
    const prog = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
    const m = stage.reducedMotion ? 0 : 1;
    const P = stage.lowDetail ? HERO_MOBILE : HERO;

    applyPose(
      refs.scissors.current,
      float(add(P.scissors, [0, prog * 0.7 * m, 0], [0, prog * 0.9 * m, prog * 0.45 * m]), t, 0, m),
      3.2,
      dt
    );
    applyPose(refs.comb.current, float(add(P.comb, [0, prog * 1.3 * m, 0], [0, 0, -prog * 0.4 * m]), t, 2, m), 3, dt);
    applyPose(refs.bottle.current, float(add(P.bottle, [0, prog * 0.3 * m, 0], [0, prog * 0.8 * m, 0]), t, 4, m), 3, dt);
    refs.open.current = P.open + Math.sin(t * 0.5) * 0.05 * m + prog * 0.2 * m;
    pointerTilt(refs.root.current, 1, dt);
  });

  return <Trio refs={refs} />;
}

export function ServicesRig() {
  const refs = useTrioRefs();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const m = stage.reducedMotion ? 0 : 1;
    const item = services.items[stage.activeService] ?? services.items[0];
    const key = item.object;
    const P = SERVICE_POSES[key];
    const lead = LEAD[key];

    // Continuous, scroll-linked turn while moving through the list.
    let sp = 0;
    const track = stage.servicesTrack;
    if (track) {
      const r = track.getBoundingClientRect();
      sp = clamp(-r.top / Math.max(r.height - window.innerHeight, 1), 0, 1);
    }
    const turn = (sp - 0.5) * 0.9 * m;

    (["scissors", "comb", "bottle"] as const).forEach((name, i) => {
      let pose = P[name];
      const isLead = lead === name;
      // Mobile shows only the protagonist (fewer objects, less GPU work).
      if (stage.lowDetail && lead && !isLead) pose = { ...pose, s: 0 };
      if (isLead || !lead) pose = add(pose, [0, 0, 0], [0, turn, 0]);
      applyPose(refs[name].current, float(pose, t, i * 2, isLead || !lead ? m : m * 0.5), 3, dt);
    });
    refs.open.current = P.open + Math.sin(t * 0.5) * 0.04 * m;
    pointerTilt(refs.root.current, 0.6, dt);
  });

  return <Trio refs={refs} />;
}

const FINAL: Pose = { p: [0, 0, 0], r: [0.35, -0.3, 0.55], s: 0.95 };

export function FinalRig() {
  const kit = useKitFromGl();
  const ref = useRef<THREE.Group>(null);
  const open = useRef(0.15);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const m = stage.reducedMotion ? 0 : 1;
    applyPose(ref.current, float(add(FINAL, [0, 0, 0], [0, Math.sin(t * 0.3) * 0.5 * m, 0]), t, 1, m), 2.5, dt);
    open.current = 0.12 + Math.sin(t * 0.6) * 0.08 * m;
  });

  return <Scissors ref={ref} kit={kit} open={open} />;
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#FFF8F1" />
      <directionalLight position={[3, 5, 6]} intensity={1.7} color="#FFF6EC" />
      <directionalLight position={[-5, 1.5, 2]} intensity={0.45} color="#F3EDE5" />
      {/* Faint blush rim light — the only pink in the lighting. */}
      <directionalLight position={[-2, -3, -4]} intensity={0.6} color="#F4E4E1" />
    </>
  );
}
