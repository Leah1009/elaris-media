import type { StaticPart } from "./types";
import { CAMERA_TO_PHONE } from "@/lib/chapters/cameraToPhone";
import { PHONE_TO_LAPTOP } from "@/lib/chapters/phoneToLaptop";

const GOLD = "#B08A54";
const GOLD_DEEP = "#8C6C3A";
const GOLD_LIGHT = "#D9BE8E";
const INK = "#16130F";
const INK_SOFT = "#2A241C";

/**
 * The depth-cinematic hero doesn't morph one shape into the next anymore —
 * each object keeps its own fixed silhouette and simply travels through
 * depth. So we lift the two static poses we already validated (the
 * assembled camera, the assembled phone, the assembled laptop) straight out
 * of the explode/reassemble pose tables instead of re-authoring coordinates.
 */
export const CAMERA_ASSEMBLY: StaticPart[] = CAMERA_TO_PHONE.map((part) => ({
  id: part.id,
  geometry: part.geometry,
  segments: part.segments,
  color: part.color,
  emissive: part.emissive,
  emissiveIntensity: part.emissiveIntensity,
  metalness: part.metalness,
  roughness: part.roughness,
  position: part.from.position,
  rotation: part.from.rotation,
  scale: part.from.scale,
}));

export const PHONE_ASSEMBLY: StaticPart[] = [
  ...CAMERA_TO_PHONE.map((part) => ({
    id: part.id,
    geometry: part.geometry,
    segments: part.segments,
    color: part.color,
    emissive: part.emissive,
    emissiveIntensity: part.emissiveIntensity,
    metalness: part.metalness,
    roughness: part.roughness,
    position: part.to.position,
    rotation: part.to.rotation,
    scale: part.to.scale,
  })),
  // A restrained sign of life on the phone screen: a timeline track and a
  // playhead that moves with scroll progress through this object's own
  // window (never with time/autoplay).
  {
    id: "timelineTrack",
    geometry: "box",
    segments: 1,
    color: INK_SOFT,
    metalness: 0.2,
    roughness: 0.6,
    position: [0, -0.32, 0.08],
    rotation: [0, 0, 0],
    scale: [0.52, 0.012, 0.008],
  },
  {
    id: "playhead",
    geometry: "box",
    segments: 1,
    color: GOLD,
    emissive: GOLD,
    emissiveIntensity: 0.3,
    metalness: 0.6,
    roughness: 0.3,
    position: [-0.26, -0.32, 0.09],
    rotation: [0, 0, 0],
    scale: [0.022, 0.05, 0.012],
    role: "playhead",
    travel: [-0.26, 0.26],
  },
];

export const LAPTOP_ASSEMBLY: StaticPart[] = [
  ...PHONE_TO_LAPTOP.map((part) => ({
    id: part.id,
    geometry: part.geometry,
    segments: part.segments,
    color: part.color,
    emissive: part.emissive,
    emissiveIntensity: part.emissiveIntensity,
    metalness: part.metalness,
    roughness: part.roughness,
    position: part.to.position,
    rotation: part.to.rotation,
    scale: part.to.scale,
  })),
  // A quiet suggestion of a website interface on the laptop screen —
  // static, not literal: a hero block and a couple of text-line bars.
  {
    id: "screenHeroBlock",
    geometry: "box",
    segments: 1,
    color: GOLD_LIGHT,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.25,
    metalness: 0.15,
    roughness: 0.3,
    position: [-0.18, 0.42, -0.155],
    rotation: [-0.06, 0, 0],
    scale: [0.38, 0.28, 0.012],
  },
  {
    id: "screenLine1",
    geometry: "box",
    segments: 1,
    color: INK_SOFT,
    metalness: 0.2,
    roughness: 0.6,
    position: [0.22, 0.5, -0.155],
    rotation: [-0.06, 0, 0],
    scale: [0.34, 0.02, 0.008],
  },
  {
    id: "screenLine2",
    geometry: "box",
    segments: 1,
    color: INK_SOFT,
    metalness: 0.2,
    roughness: 0.6,
    position: [0.22, 0.44, -0.155],
    rotation: [-0.06, 0, 0],
    scale: [0.24, 0.02, 0.008],
  },
];

export const DASHBOARD_ASSEMBLY: StaticPart[] = [
  {
    id: "panel",
    geometry: "box",
    segments: 1,
    color: INK,
    metalness: 0.45,
    roughness: 0.4,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1.7, 1.08, 0.05],
  },
  {
    id: "panelScreen",
    geometry: "box",
    segments: 1,
    color: GOLD_LIGHT,
    emissive: GOLD_LIGHT,
    emissiveIntensity: 0.35,
    metalness: 0.1,
    roughness: 0.3,
    position: [0, 0, 0.03],
    rotation: [0, 0, 0],
    scale: [1.54, 0.92, 0.015],
  },
  {
    id: "bar1",
    geometry: "box",
    segments: 1,
    color: GOLD,
    metalness: 0.25,
    roughness: 0.3,
    position: [-0.45, -0.22, 0.07],
    rotation: [0, 0, 0],
    scale: [0.16, 0.001, 0.02],
    role: "bar",
    barHeight: 0.32,
  },
  {
    id: "bar2",
    geometry: "box",
    segments: 1,
    color: GOLD_DEEP,
    metalness: 0.25,
    roughness: 0.3,
    position: [-0.16, -0.22, 0.07],
    rotation: [0, 0, 0],
    scale: [0.16, 0.001, 0.02],
    role: "bar",
    barHeight: 0.52,
  },
  {
    id: "bar3",
    geometry: "box",
    segments: 1,
    color: INK_SOFT,
    metalness: 0.25,
    roughness: 0.3,
    position: [0.13, -0.22, 0.07],
    rotation: [0, 0, 0],
    scale: [0.16, 0.001, 0.02],
    role: "bar",
    barHeight: 0.42,
  },
  {
    id: "trendDot",
    geometry: "sphere",
    segments: 16,
    color: GOLD,
    emissive: GOLD,
    emissiveIntensity: 0.5,
    metalness: 0.5,
    roughness: 0.2,
    position: [0.5, 0.28, 0.08],
    rotation: [0, 0, 0],
    scale: [0.045, 0.045, 0.045],
  },
  {
    id: "cardOutline",
    geometry: "box",
    segments: 1,
    color: INK_SOFT,
    metalness: 0.2,
    roughness: 0.5,
    position: [0.5, 0.05, 0.06],
    rotation: [0, 0, 0],
    scale: [0.4, 0.015, 0.01],
  },
];
