export type Vec3 = [number, number, number];

export type Pose = {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
};

export type PartDef = {
  id: string;
  geometry: "box" | "cylinder" | "sphere";
  /** cylinder/sphere segment count, lowered on mobile for perf */
  segments: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness: number;
  roughness: number;
  camera: Pose;
  phone: Pose;
  /** direction the part flies outward toward mid-transition, before reassembling */
  explodeDir: Vec3;
  /** how far it flies outward, in world units */
  explodeMagnitude: number;
  /** extra spin (radians) added at peak explode, per axis */
  explodeSpin: Vec3;
};

const GOLD = "#B08A54";
const GOLD_LIGHT = "#D9BE8E";
const INK = "#16130F";
const INK_SOFT = "#2A241C";

/**
 * Nine parts shared between the "camera" and "phone" silhouettes. Each part
 * keeps the same mesh/geometry across both poses — only position, rotation
 * and scale change — so a single scroll-driven progress value (0 → 1) can
 * lerp every part smoothly between the two assembled forms.
 */
export const PARTS: PartDef[] = [
  {
    id: "body",
    geometry: "box",
    segments: 1,
    color: INK,
    metalness: 0.55,
    roughness: 0.35,
    camera: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.6, 1.0, 0.6] },
    phone: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0.78, 1.55, 0.12] },
    explodeDir: [0, 0, -1],
    explodeMagnitude: 0.12,
    explodeSpin: [0, 0.15, 0],
  },
  {
    id: "screenGlow",
    geometry: "box",
    segments: 1,
    color: GOLD_LIGHT,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.9,
    metalness: 0.1,
    roughness: 0.2,
    camera: { position: [0, 0.62, -0.05], rotation: [0, 0, 0], scale: [0.34, 0.22, 0.22] },
    phone: { position: [0, 0, 0.07], rotation: [0, 0, 0], scale: [0.62, 1.32, 0.02] },
    explodeDir: [0, 1, 0.4],
    explodeMagnitude: 0.55,
    explodeSpin: [0.3, 0, 0],
  },
  {
    id: "lensBarrel",
    geometry: "cylinder",
    segments: 24,
    color: INK_SOFT,
    metalness: 0.7,
    roughness: 0.25,
    camera: { position: [0, -0.02, 0.55], rotation: [Math.PI / 2, 0, 0], scale: [0.38, 0.55, 0.38] },
    phone: { position: [0.22, 0.64, 0.07], rotation: [Math.PI / 2, 0, 0], scale: [0.16, 0.05, 0.16] },
    explodeDir: [0.3, -0.3, 1],
    explodeMagnitude: 0.7,
    explodeSpin: [0, 0, 0.6],
  },
  {
    id: "lensRing",
    geometry: "cylinder",
    segments: 24,
    color: GOLD,
    emissive: GOLD,
    emissiveIntensity: 0.18,
    metalness: 0.85,
    roughness: 0.2,
    camera: { position: [0, -0.02, 0.85], rotation: [Math.PI / 2, 0, 0], scale: [0.42, 0.08, 0.42] },
    phone: { position: [-0.02, 0.64, 0.07], rotation: [Math.PI / 2, 0, 0], scale: [0.09, 0.04, 0.09] },
    explodeDir: [-0.4, 0.2, 1.1],
    explodeMagnitude: 0.85,
    explodeSpin: [0, 0, -0.6],
  },
  {
    id: "viewfinder",
    geometry: "box",
    segments: 1,
    color: INK_SOFT,
    metalness: 0.5,
    roughness: 0.4,
    camera: { position: [0, 0.65, -0.18], rotation: [0, 0, 0], scale: [0.34, 0.22, 0.2] },
    phone: { position: [0, 0.7, 0.075], rotation: [0, 0, 0], scale: [0.08, 0.03, 0.02] },
    explodeDir: [0, 0.8, -0.6],
    explodeMagnitude: 0.5,
    explodeSpin: [0.4, 0, 0],
  },
  {
    id: "flashUnit",
    geometry: "box",
    segments: 1,
    color: GOLD_LIGHT,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.4,
    metalness: 0.3,
    roughness: 0.3,
    camera: { position: [0.55, 0.58, 0.05], rotation: [0, 0, 0], scale: [0.22, 0.14, 0.14] },
    phone: { position: [0.22, 0.56, 0.075], rotation: [0, 0, 0], scale: [0.045, 0.045, 0.02] },
    explodeDir: [1, 0.4, 0.2],
    explodeMagnitude: 0.6,
    explodeSpin: [0, 0.5, 0],
  },
  {
    id: "dialLeft",
    geometry: "cylinder",
    segments: 20,
    color: GOLD,
    emissive: GOLD,
    emissiveIntensity: 0.15,
    metalness: 0.8,
    roughness: 0.25,
    camera: { position: [-0.65, 0.56, -0.1], rotation: [0, 0, 0], scale: [0.16, 0.08, 0.16] },
    phone: { position: [-0.4, 0.2, 0], rotation: [0, 0, 0], scale: [0.045, 0.16, 0.045] },
    explodeDir: [-1, 0.5, -0.3],
    explodeMagnitude: 0.65,
    explodeSpin: [0, 0, 0.8],
  },
  {
    id: "dialRight",
    geometry: "cylinder",
    segments: 20,
    color: GOLD,
    emissive: GOLD,
    emissiveIntensity: 0.15,
    metalness: 0.8,
    roughness: 0.25,
    camera: { position: [0.2, 0.56, -0.15], rotation: [0, 0, 0], scale: [0.16, 0.08, 0.16] },
    phone: { position: [0.4, 0.29, 0], rotation: [0, 0, 0], scale: [0.045, 0.2, 0.045] },
    explodeDir: [1, 0.6, -0.4],
    explodeMagnitude: 0.6,
    explodeSpin: [0, 0, -0.8],
  },
  {
    id: "strapLugL",
    geometry: "sphere",
    segments: 16,
    color: INK_SOFT,
    metalness: 0.6,
    roughness: 0.35,
    camera: { position: [-0.85, 0.15, 0.05], rotation: [0, 0, 0], scale: [0.14, 0.14, 0.14] },
    phone: { position: [-0.85, 0.15, 0.05], rotation: [0, 0, 0], scale: [0.001, 0.001, 0.001] },
    explodeDir: [-1, -0.3, 0.5],
    explodeMagnitude: 0.5,
    explodeSpin: [0.5, 0.5, 0],
  },
  {
    id: "strapLugR",
    geometry: "sphere",
    segments: 16,
    color: INK_SOFT,
    metalness: 0.6,
    roughness: 0.35,
    camera: { position: [0.85, 0.15, 0.05], rotation: [0, 0, 0], scale: [0.14, 0.14, 0.14] },
    phone: { position: [0.85, 0.15, 0.05], rotation: [0, 0, 0], scale: [0.001, 0.001, 0.001] },
    explodeDir: [1, -0.3, 0.5],
    explodeMagnitude: 0.5,
    explodeSpin: [-0.5, 0.5, 0],
  },
];
