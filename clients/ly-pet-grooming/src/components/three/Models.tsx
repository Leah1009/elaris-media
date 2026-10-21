"use client";

import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Kit } from "./kit";

type ModelProps = { kit: Kit };

/** Thinning shears. `open` is the target opening angle in radians. */
export const Scissors = forwardRef<THREE.Group, ModelProps & { open: { current: number } }>(
  function Scissors({ kit, open }, ref) {
    const a = useRef<THREE.Group>(null);
    const b = useRef<THREE.Group>(null);
    const { scissors: g, mat } = kit;

    useFrame((_, dt) => {
      if (!a.current || !b.current) return;
      const target = open.current / 2;
      const next = THREE.MathUtils.damp(a.current.rotation.z, target, 5, Math.min(dt, 0.05));
      a.current.rotation.z = next;
      b.current.rotation.z = -next;
    });

    return (
      <group ref={ref}>
        {/* Centre the composition roughly on the pivot/blade midpoint. */}
        <group position={[-0.45, 0.1, 0]}>
          <group ref={a} position={[0, 0, 0.03]}>
            <mesh geometry={g.blade} material={mat.champagne} />
            <mesh geometry={g.shank} material={mat.champagne} />
            <mesh geometry={g.ring} material={mat.taupe} position={[-1.25, -0.55, 0]} />
            <mesh geometry={g.ringLiner} material={mat.blush} position={[-1.25, -0.55, 0.012]} />
          </group>
          <group ref={b} position={[0, 0, -0.03]}>
            <group scale={[1, -1, 1]}>
              <mesh geometry={g.blade} material={mat.champagne} />
              <mesh geometry={g.shank} material={mat.champagne} />
              <mesh geometry={g.ring} material={mat.taupe} position={[-1.25, -0.55, 0]} />
            </group>
            <mesh geometry={g.teeth} material={mat.champagne} />
          </group>
          <mesh geometry={g.hub} material={mat.champagne} />
          <mesh geometry={g.screw} material={mat.blush} position={[0, 0, 0.075]} />
        </group>
      </group>
    );
  }
);

export const Comb = forwardRef<THREE.Group, ModelProps>(function Comb({ kit }, ref) {
  const { comb: g, mat } = kit;
  return (
    <group ref={ref}>
      <mesh geometry={g.body} material={mat.satin} />
      <mesh geometry={g.spine} material={mat.beige} />
    </group>
  );
});

export const Bottle = forwardRef<THREE.Group, ModelProps>(function Bottle({ kit }, ref) {
  const { bottle: g, mat } = kit;
  return (
    <group ref={ref}>
      <mesh geometry={g.body} material={mat.porcelain} />
      <mesh geometry={g.band} material={mat.champagne} />
      <mesh geometry={g.collar} material={mat.champagne} />
      <mesh geometry={g.stem} material={mat.ivory} />
      <mesh geometry={g.head} material={mat.ivory} />
      <mesh geometry={g.nozzle} material={mat.ivory} />
    </group>
  );
});
