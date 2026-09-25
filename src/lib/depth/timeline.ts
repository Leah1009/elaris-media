import type { DepthObjectConfig } from "./types";
import { CAMERA_ASSEMBLY, PHONE_ASSEMBLY, LAPTOP_ASSEMBLY, DASHBOARD_ASSEMBLY } from "./assemblies";

/**
 * Four objects, each keeping its own shape, traveling through depth with
 * deliberately overlapping windows so consecutive objects briefly coexist
 * at different depths instead of one replacing the other like a slide.
 */
export const DEPTH_TIMELINE_DESKTOP: DepthObjectConfig[] = [
  {
    id: "camera",
    parts: CAMERA_ASSEMBLY,
    window: { inStart: 0.0, inPeak: 0.08, outPeak: 0.28, outEnd: 0.4, restingOpacity: 0.12 },
    restXY: [0, 0.05],
    restScale: 1.05,
    farScale: 0.5,
    farZ: -3.2,
    settleZ: -1.7,
  },
  {
    id: "phone",
    parts: PHONE_ASSEMBLY,
    window: { inStart: 0.22, inPeak: 0.38, outPeak: 0.55, outEnd: 0.66, restingOpacity: 0.12 },
    restXY: [0.36, -0.08],
    restScale: 0.95,
    farScale: 0.5,
    farZ: -3.2,
    settleZ: -1.7,
  },
  {
    id: "laptop",
    parts: LAPTOP_ASSEMBLY,
    window: { inStart: 0.5, inPeak: 0.64, outPeak: 0.8, outEnd: 0.9, restingOpacity: 0.14 },
    restXY: [-0.32, 0.06],
    restScale: 1.2,
    farScale: 0.55,
    farZ: -3.2,
    settleZ: -1.7,
  },
  {
    id: "dashboard",
    parts: DASHBOARD_ASSEMBLY,
    window: { inStart: 0.74, inPeak: 0.9, outPeak: 1.0, outEnd: 1.0, restingOpacity: 1 },
    restXY: [0, -0.04],
    restScale: 1.1,
    farScale: 0.55,
    farZ: -3.2,
    settleZ: -1.7,
  },
];

/**
 * Same story, tuned for portrait screens. There's no width to spare, so two
 * objects fading in/out near the same horizontal center at once turns into
 * a muddy overlap — instead each object gets its own vertical band (the one
 * axis portrait has plenty of) and the handoff windows are tightened so
 * fewer frames ever hold two objects at high opacity simultaneously.
 */
export const DEPTH_TIMELINE_MOBILE: DepthObjectConfig[] = [
  {
    id: "camera",
    parts: CAMERA_ASSEMBLY,
    window: { inStart: 0.0, inPeak: 0.09, outPeak: 0.26, outEnd: 0.34, restingOpacity: 0.08 },
    restXY: [0, 0.34],
    restScale: 0.85,
    farScale: 0.4,
    farZ: -3.0,
    settleZ: -1.7,
  },
  {
    id: "phone",
    parts: PHONE_ASSEMBLY,
    window: { inStart: 0.3, inPeak: 0.43, outPeak: 0.58, outEnd: 0.66, restingOpacity: 0.08 },
    restXY: [0.06, -0.1],
    restScale: 0.82,
    farScale: 0.4,
    farZ: -3.0,
    settleZ: -1.7,
  },
  {
    id: "laptop",
    parts: LAPTOP_ASSEMBLY,
    window: { inStart: 0.62, inPeak: 0.72, outPeak: 0.85, outEnd: 0.92, restingOpacity: 0.1 },
    restXY: [-0.04, -0.34],
    restScale: 0.88,
    farScale: 0.42,
    farZ: -3.0,
    settleZ: -1.7,
  },
  {
    id: "dashboard",
    parts: DASHBOARD_ASSEMBLY,
    window: { inStart: 0.88, inPeak: 0.96, outPeak: 1.0, outEnd: 1.0, restingOpacity: 1 },
    restXY: [0, -0.05],
    restScale: 0.78,
    farScale: 0.42,
    farZ: -3.0,
    settleZ: -1.7,
  },
];
