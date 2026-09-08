export type Vec3 = [number, number, number];

export type Pose = {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
};

export type ChapterPart = {
  id: string;
  geometry: "box" | "cylinder" | "sphere";
  segments: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness: number;
  roughness: number;
  from: Pose;
  to: Pose;
  explodeDir: Vec3;
  explodeMagnitude: number;
  explodeSpin: Vec3;
};
