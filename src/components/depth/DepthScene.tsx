"use client";

import { Canvas } from "@react-three/fiber";
import DepthObject from "./DepthObject";
import type { DepthObjectConfig } from "@/lib/depth/types";

type DepthSceneProps = {
  objects: DepthObjectConfig[];
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  lowDetail: boolean;
};

export default function DepthScene({ objects, progressRef, pointerRef, lowDetail }: DepthSceneProps) {
  return (
    <Canvas
      dpr={lowDetail ? 1 : [1, 1.75]}
      camera={{ position: [0, 0, lowDetail ? 6.6 : 5.2], fov: 32 }}
      gl={{ antialias: !lowDetail, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#F3E8D6"]} />
      {/* Cheap, GPU-friendly stand-in for depth blur: objects settling into
          the background fade toward the fog color instead of a real blur pass. */}
      <fog attach="fog" args={["#F3E8D6", 4.2, 9.5]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#FBF6EA" />
      <directionalLight position={[-4, 1, 3]} intensity={0.4} color="#FBF6EA" />
      <pointLight position={[-3, -2, -2]} intensity={0.35} color="#B08A54" />
      {objects.map((obj) => (
        <DepthObject
          key={obj.id}
          config={obj}
          progressRef={progressRef}
          pointerRef={pointerRef}
          lowDetail={lowDetail}
        />
      ))}
    </Canvas>
  );
}
