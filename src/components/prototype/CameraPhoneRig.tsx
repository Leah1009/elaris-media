"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PARTS, type Vec3 } from "@/lib/prototype/poses";

function lerpVec3(a: Vec3, b: Vec3, t: number, out: Vec3): Vec3 {
  out[0] = THREE.MathUtils.lerp(a[0], b[0], t);
  out[1] = THREE.MathUtils.lerp(a[1], b[1], t);
  out[2] = THREE.MathUtils.lerp(a[2], b[2], t);
  return out;
}

type CameraPhoneRigProps = {
  /** 0 = fully assembled camera, 1 = fully assembled phone. Written every scroll tick. */
  progressRef: React.MutableRefObject<number>;
  /** normalized pointer position (-1..1), only populated on fine-pointer desktops */
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  lowDetail: boolean;
};

export default function CameraPhoneRig({
  progressRef,
  pointerRef,
  lowDetail,
}: CameraPhoneRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Record<string, THREE.Mesh | null>>({});

  // Scratch vectors reused every frame to avoid per-frame allocation.
  const scratchPos = useMemo<Vec3>(() => [0, 0, 0], []);
  const scratchScale = useMemo<Vec3>(() => [0, 0, 0], []);
  const scratchRot = useMemo<Vec3>(() => [0, 0, 0], []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    // Smoothstep easing for the base morph so the reassembly settles gently.
    const eased = p * p * (3 - 2 * p);
    // Peaks at p = 0.5, zero at both ends — the "decompose then reassemble" bulge.
    const explode = Math.sin(p * Math.PI);

    for (const part of PARTS) {
      const mesh = meshRefs.current[part.id];
      if (!mesh) continue;

      lerpVec3(part.camera.position, part.phone.position, eased, scratchPos);
      lerpVec3(part.camera.scale, part.phone.scale, eased, scratchScale);
      lerpVec3(part.camera.rotation, part.phone.rotation, eased, scratchRot);

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
      {PARTS.map((part) => (
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
