export type Vec3 = [number, number, number];

export type StaticPart = {
  id: string;
  geometry: "box" | "cylinder" | "sphere";
  segments: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness: number;
  roughness: number;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  /** special per-frame behavior, driven by progress-within-the-object's-own-window */
  role?: "playhead" | "bar";
  /** role:"playhead" — local x it travels between */
  travel?: [number, number];
  /** role:"bar" — resting scale.y it grows toward (from 0) */
  barHeight?: number;
};

export type DepthWindow = {
  /** fractions of the master scroll progress (0..1) */
  inStart: number;
  inPeak: number;
  outPeak: number;
  outEnd: number;
  /** opacity the object fades to after outEnd — objects stay faintly visible behind the next one, not gone */
  restingOpacity: number;
};

export type DepthObjectConfig = {
  id: "camera" | "phone" | "laptop" | "dashboard";
  parts: StaticPart[];
  window: DepthWindow;
  /** anchor position at full presence (peak) */
  restXY: [number, number];
  restScale: number;
  farScale: number;
  farZ: number;
  settleZ: number;
};
