import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Procedural geometry + materials for the three grooming tools.
 * Built once and shared by every view, so the GPU only holds one copy.
 * No external models or textures are downloaded.
 */

export type Kit = ReturnType<typeof buildKit>;
let kit: Kit | null = null;

export function getKit(gl: THREE.WebGLRenderer, lowDetail: boolean) {
  if (!kit) kit = buildKit(gl, lowDetail);
  return kit;
}

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);

/** Smooth closed outline through control points (Catmull-Rom). */
function smoothOutline(points: [number, number][], segments: number) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    true,
    "centripetal"
  );
  return curve.getSpacedPoints(segments).map((p) => v2(p.x, p.y));
}

function extrude(shape: THREE.Shape, depth: number, lowDetail: boolean, bevel = 0.012) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: lowDetail ? 1 : 3,
    curveSegments: lowDetail ? 6 : 12,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

function buildScissors(lowDetail: boolean) {
  const seg = lowDetail ? 60 : 120;

  // Blade with a soft spine; pivot at the origin, tip towards +x.
  const blade = extrude(
    new THREE.Shape(
      smoothOutline(
        [
          [-0.22, -0.1],
          [0.35, -0.02],
          [1.3, -0.012],
          [2.4, 0.0],
          [1.75, 0.075],
          [0.95, 0.14],
          [0.25, 0.19],
          [-0.2, 0.12],
        ],
        seg
      )
    ),
    0.04,
    lowDetail
  );

  // Thinning teeth along the edge of the second blade.
  const teethShape = new THREE.Shape();
  const start = 0.45;
  const end = 2.05;
  const count = lowDetail ? 16 : 24;
  const step = (end - start) / count;
  teethShape.moveTo(start, -0.03);
  for (let i = 0; i < count; i++) {
    const x = start + i * step;
    teethShape.lineTo(x + step * 0.18, 0.04);
    teethShape.lineTo(x + step * 0.62, 0.04);
    teethShape.lineTo(x + step * 0.8, -0.005);
    teethShape.lineTo(x + step, -0.005);
  }
  teethShape.lineTo(end, -0.03);
  teethShape.closePath();
  const teeth = extrude(teethShape, 0.026, lowDetail, 0.004);

  // Shank from the pivot down to the finger ring.
  const shank = extrude(
    new THREE.Shape(
      smoothOutline(
        [
          [0.08, 0.07],
          [-0.45, -0.06],
          [-0.92, -0.27],
          [-1.05, -0.42],
          [-0.6, -0.22],
          [-0.05, -0.09],
        ],
        seg
      )
    ),
    0.045,
    lowDetail
  );

  const radial = lowDetail ? 10 : 18;
  const tubular = lowDetail ? 36 : 64;
  const ring = new THREE.TorusGeometry(0.27, 0.052, radial, tubular);
  const ringLiner = new THREE.TorusGeometry(0.218, 0.018, 8, tubular);
  const hub = new THREE.CylinderGeometry(0.15, 0.15, 0.12, lowDetail ? 20 : 36);
  hub.rotateX(Math.PI / 2);
  const screw = new THREE.CylinderGeometry(0.075, 0.075, 0.04, lowDetail ? 16 : 28);
  screw.rotateX(Math.PI / 2);
  return { blade, teeth, shank, ring, ringLiner, hub, screw };
}

function buildComb(lowDetail: boolean) {
  // Greyhound-style comb: coarse teeth on one half, fine teeth on the other.
  const shape = new THREE.Shape();
  const L = 1.5;
  const spineTop = 0.34;
  const toothLen = 0.78;
  shape.moveTo(-L, spineTop - 0.08);
  shape.quadraticCurveTo(-L, spineTop, -L + 0.08, spineTop);
  shape.lineTo(L - 0.08, spineTop);
  shape.quadraticCurveTo(L, spineTop, L, spineTop - 0.08);
  shape.lineTo(L, -toothLen + 0.06);

  const teeth: { x: number; w: number }[] = [];
  // Fine half (right → centre)
  for (let x = L - 0.05; x > 0.02; x -= 0.066) teeth.push({ x, w: 0.03 });
  // Coarse half (centre → left)
  for (let x = -0.06; x > -L + 0.03; x -= 0.11) teeth.push({ x, w: 0.046 });

  teeth.forEach(({ x, w }, i) => {
    const half = w / 2;
    if (i === 0) shape.lineTo(x + half, -toothLen + 0.06);
    else shape.lineTo(x + half, 0);
    shape.lineTo(x + half, -toothLen + 0.04);
    shape.quadraticCurveTo(x, -toothLen - 0.02, x - half, -toothLen + 0.04);
    if (i === teeth.length - 1) shape.lineTo(x - half, -toothLen + 0.06);
    else shape.lineTo(x - half, 0);
  });
  shape.lineTo(-L, -toothLen + 0.06);
  shape.closePath();

  const body = extrude(shape, 0.055, lowDetail, 0.008);
  body.translate(0, toothLen / 2 - spineTop / 2, 0);

  // Slightly thicker spine bar for a premium, weighted look.
  const spine = new THREE.BoxGeometry(L * 2 - 0.02, 0.2, 0.09, 1, 1, 1);
  spine.translate(0, spineTop - 0.12 + toothLen / 2 - spineTop / 2, 0);
  return { body, spine };
}

function buildBottle(lowDetail: boolean) {
  const profile = new THREE.SplineCurve([
    v2(0.0, 0.0),
    v2(0.46, 0.0),
    v2(0.555, 0.05),
    v2(0.58, 0.18),
    v2(0.58, 1.2),
    v2(0.55, 1.46),
    v2(0.42, 1.66),
    v2(0.25, 1.78),
    v2(0.2, 1.84),
    v2(0.2, 1.92),
    v2(0.0, 1.92),
  ]).getSpacedPoints(lowDetail ? 40 : 80);
  const segments = lowDetail ? 32 : 64;
  const body = new THREE.LatheGeometry(profile, segments);
  body.translate(0, -1.1, 0);

  const band = new THREE.TorusGeometry(0.584, 0.01, 6, segments);
  band.rotateX(Math.PI / 2);
  band.translate(0, -0.2, 0);

  const collar = new THREE.CylinderGeometry(0.235, 0.235, 0.16, segments);
  collar.translate(0, 0.89, 0);

  const stem = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16);
  stem.translate(0, 1.03, 0);

  const head = new THREE.CapsuleGeometry(0.17, 0.16, lowDetail ? 4 : 8, segments / 2);
  head.translate(0, 1.22, 0);

  const nozzle = new THREE.CylinderGeometry(0.035, 0.045, 0.22, 16);
  nozzle.rotateZ(Math.PI / 2);
  nozzle.translate(0.24, 1.26, 0);

  return { body, band, collar, stem, head, nozzle };
}

function buildMaterials(gl: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const std = (params: THREE.MeshStandardMaterialParameters) =>
    new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 0.75, ...params });

  return {
    // Brushed champagne silver — blades, hub, collar.
    champagne: std({ color: "#EFE5D8", metalness: 0.92, roughness: 0.24, envMapIntensity: 1.15 }),
    // Softer satin silver for the comb.
    satin: std({ color: "#ECE4DA", metalness: 0.82, roughness: 0.34, envMapIntensity: 1.05 }),
    // Matte taupe coating — finger rings.
    taupe: std({ color: "#AE927A", metalness: 0.05, roughness: 0.62, envMapIntensity: 0.45 }),
    // Matte warm beige.
    beige: std({ color: "#D7C0A6", metalness: 0.0, roughness: 0.6, envMapIntensity: 0.5 }),
    // Ivory pump head.
    ivory: std({ color: "#F5EFE7", metalness: 0.0, roughness: 0.5, envMapIntensity: 0.55 }),
    // Very soft blush — the subtle pink accent.
    blush: std({ color: "#E9B9BE", metalness: 0.0, roughness: 0.55, envMapIntensity: 0.5 }),
    // Bottle body: satin porcelain with a faint blush tint.
    porcelain: new THREE.MeshPhysicalMaterial({
      color: "#F3E6E0",
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.45,
      envMap: env,
      envMapIntensity: 0.6,
    }),
  };
}

function buildKit(gl: THREE.WebGLRenderer, lowDetail: boolean) {
  return {
    scissors: buildScissors(lowDetail),
    comb: buildComb(lowDetail),
    bottle: buildBottle(lowDetail),
    mat: buildMaterials(gl),
  };
}
