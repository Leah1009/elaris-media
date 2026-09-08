"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ChapterPart, Vec3 } from "@/lib/chapters/types";

function lerpVec3(a: Vec3, b: Vec3, t: number, out: Vec3): Vec3 {
  out[0] = THREE.MathUtils.lerp(a[0], b[0], t);
  out[1] = THREE.MathUtils.lerp(a[1], b[1], t);
  out[2] = THREE.MathUtils.lerp(a[2], b[2], t);
  return out;
}

type MorphRigProps = {
  parts: ChapterPart[];
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  lowDetail: boolean;
};

export default function MorphRig({ parts, progressRef, pointerRef, lowDetail }: MorphRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Record<string, THREE.Mesh | null>>({});

  const scratchPos = useMemo<Vec3>(() => [0, 0, 0], []);
  const scratchScale = useMemo<Vec3>(() => [0, 0, 0], []);
  const scratchRot = useMemo<Vec3>(() => [0, 0, 0], []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const eased = p * p * (3 - 2 * p);
    const explode = Math.sin(p * Math.PI);

    for (const part of parts) {
      const mesh = meshRefs.current[part.id];
      if (!mesh) continue;

      lerpVec3(part.from.position, part.to.position, eased, scratchPos);
      lerpVec3(part.from.scale, part.to.scale, eased, scratchScale);
      lerpVec3(part.from.rotation, part.to.rotation, eased, scratchRot);

      const mag = explode * part.explodeMagnitude;
      mesh.position.set(
        scratchPos[0] + part.explodeDir[0] * mag,
        scratchPos[1] + part.explodeDir[1] * mag,
        scratchPos[2] + part.explodeDir[2] * mag
      );
      mesh.rotation.set(
        scratchRot[0] + part.explodeSpin[0] * explode,
        scratchRot[1] + part.explodeSpin[1] * explode,
        scratchRot[2] + part.explodeSpin[2] * explode
      );
      mesh.scale.set(scratchScale[0], scratchScale[1], scratchScale[2]);
    }

    if (groupRef.current) {
      const baseYaw = THREE.MathUtils.lerp(-0.32, 0.32, eased);
      const swirl = explode * 0.18;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        baseYaw + swirl + pointerRef.current.x * 0.12,
        0.15
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointerRef.current.y * -0.08,
        0.15
      );
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
          castShadow
          receiveShadow
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
          />
        </mesh>
      ))}
    </group>
  );
}
