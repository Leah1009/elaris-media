"use client";

import { Canvas } from "@react-three/fiber";
import CameraPhoneRig from "./CameraPhoneRig";

type SceneProps = {
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  lowDetail: boolean;
};

export default function Scene({ progressRef, pointerRef, lowDetail }: SceneProps) {
  return (
    <Canvas
      shadows={!lowDetail}
      dpr={lowDetail ? 1 : [1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 32 }}
      gl={{ antialias: !lowDetail, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#F3E8D6"]} />
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.4}
        color="#FBF6EA"
        castShadow={!lowDetail}
      />
      <directionalLight position={[-4, 1, 3]} intensity={0.4} color="#FBF6EA" />
      <pointLight position={[-3, -2, -2]} intensity={0.35} color="#B08A54" />
      <CameraPhoneRig progressRef={progressRef} pointerRef={pointerRef} lowDetail={lowDetail} />
    </Canvas>
  );
}
