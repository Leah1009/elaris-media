"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { DepthObjectConfig } from "@/lib/depth/types";

const smoothstep = (t: number) => {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};
const clamp01 = (v: number) => THREE.MathUtils.clamp(v, 0, 1);

const ENTRY_OFFSET: [number, number] = [0, 0.18];
const EXIT_OFFSET: [number, number] = [0, -0.15];

type DepthObjectProps = {
  config: DepthObjectConfig;
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  lowDetail: boolean;
};

export default function DepthObject({ config, progressRef, pointerRef, lowDetail }: DepthObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Record<string, THREE.Mesh | null>>({});
  const { window: w, parts, restXY, restScale, farScale, farZ, settleZ } = config;

  useFrame(() => {
    const p = clamp01(progressRef.current);
    const group = groupRef.current;
    if (!group) return;

    let opacity: number;
    let z: number;
    let scale: number;
    let x: number;
    let y: number;

    if (p <= w.inStart) {
      opacity = 0;
      z = farZ;
      scale = farScale;
      x = restXY[0] + ENTRY_OFFSET[0];
      y = restXY[1] + ENTRY_OFFSET[1];
    } else if (p < w.inPeak) {
      const e = smoothstep((p - w.inStart) / (w.inPeak - w.inStart));
      opacity = e;
      z = THREE.MathUtils.lerp(farZ, 0, e);
      scale = THREE.MathUtils.lerp(farScale, restScale, e);
      x = THREE.MathUtils.lerp(restXY[0] + ENTRY_OFFSET[0], restXY[0], e);
      y = THREE.MathUtils.lerp(restXY[1] + ENTRY_OFFSET[1], restXY[1], e);
    } else if (p <= w.outPeak) {
      opacity = 1;
      z = 0;
      scale = restScale;
      x = restXY[0];
      y = restXY[1];
    } else if (p < w.outEnd) {
      const e = smoothstep((p - w.outPeak) / (w.outEnd - w.outPeak));
      opacity = THREE.MathUtils.lerp(1, w.restingOpacity, e);
      z = THREE.MathUtils.lerp(0, settleZ, e);
      scale = THREE.MathUtils.lerp(restScale, restScale * 0.85, e);
      x = THREE.MathUtils.lerp(restXY[0], restXY[0] + EXIT_OFFSET[0], e);
      y = THREE.MathUtils.lerp(restXY[1], restXY[1] + EXIT_OFFSET[1], e);
    } else {
      opacity = w.restingOpacity;
      z = settleZ;
      scale = restScale * 0.85;
      x = restXY[0] + EXIT_OFFSET[0];
      y = restXY[1] + EXIT_OFFSET[1];
    }

    group.position.set(x, y, z);
    group.scale.setScalar(scale);

    const spanProgress = clamp01((p - w.inStart) / Math.max(0.001, w.outEnd - w.inStart));
    const baseYaw = THREE.MathUtils.lerp(-0.16, 0.16, spanProgress);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, baseYaw + pointerRef.current.x * 0.1, 0.15);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointerRef.current.y * -0.06, 0.15);

    const domScrub = clamp01((p - w.inPeak) / Math.max(0.001, w.outPeak - w.inPeak));

    for (const part of parts) {
      const mesh = meshRefs.current[part.id];
      if (!mesh) continue;

      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      mat.opacity = opacity;

      if (part.role === "playhead" && part.travel) {
        mesh.position.set(THREE.MathUtils.lerp(part.travel[0], part.travel[1], domScrub), part.position[1], part.position[2]);
        mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
        mesh.scale.set(part.scale[0], part.scale[1], part.scale[2]);
      } else if (part.role === "bar" && part.barHeight != null) {
        const h = Math.max(0.001, part.barHeight * domScrub);
        mesh.scale.set(part.scale[0], h, part.scale[2]);
        mesh.position.set(part.position[0], part.position[1] + h / 2, part.position[2]);
        mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
      } else {
        mesh.position.set(part.position[0], part.position[1], part.position[2]);
        mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
        mesh.scale.set(part.scale[0], part.scale[1], part.scale[2]);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {parts.map((part) => (
        <mesh
          key={part.id}
          ref={(el) => {
            meshRefs.current[part.id] = el;
          }}
        >
          {part.geometry === "box" && <boxGeometry args={[1, 1, 1]} />}
          {part.geometry === "cylinder" && (
            <cylinderGeometry
              args={[1, 1, 1, lowDetail ? Math.max(8, part.segments / 2) : part.segments]}
            />
          )}
          {part.geometry === "sphere" && (
            <sphereGeometry
              args={[1, lowDetail ? Math.max(8, part.segments / 2) : part.segments, lowDetail ? 8 : part.segments]}
            />
          )}
          <meshPhysicalMaterial
            color={part.color}
            metalness={part.metalness}
            roughness={part.roughness}
            emissive={part.emissive ?? "#000000"}
            emissiveIntensity={part.emissiveIntensity ?? 0}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}
