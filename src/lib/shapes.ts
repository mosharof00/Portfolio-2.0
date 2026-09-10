/**
 * Shape generators for the particle hero.
 * Proportions tuned from the Anchor AI screenshot sequence (sphere → tree → cube).
 */

const TAU = Math.PI * 2;

export const TREE_HEIGHT = 2.15;
export const TREE_RADIUS = 1.45;
export const SPHERE_RADIUS = 1.15;
export const SPHERE_Y = 1.2;
export const CUBE_SIZE = 1.55;
export const CUBE_Y = 1.1;
/** Resting yaw — two faces + front vertical edge visible like the refs. */
export const CUBE_YAW = 0.55;

export type Shape = {
  positions: Float32Array;
  heat: Float32Array;
};

export function hash(i: number, salt = 0): number {
  const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function hashSigned(i: number, salt = 0): number {
  return hash(i, salt) * 2 - 1;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Fibonacci sphere — shell-biased so the rim reads; azure + violet rim heat. */
export function generateSphere(
  count: number,
  radius = SPHERE_RADIUS,
  centerY = SPHERE_Y,
): Shape {
  const positions = new Float32Array(count * 3);
  const heat = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const y = 1 - t * 2;
    const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const fill = Math.pow(hash(i, 1), 0.32);
    const rr = radius * fill * (1 + 0.02 * hashSigned(i, 2));

    positions[i * 3] = Math.cos(theta) * rAtY * rr;
    positions[i * 3 + 1] = y * rr + centerY;
    positions[i * 3 + 2] = Math.sin(theta) * rAtY * rr;
    // Outer shell cooler (violet), mid shell azure — matches loading sphere
    heat[i] = Math.max(0.05, 0.88 - fill * 0.55 + (1 - Math.abs(y)) * 0.12);
  }
  return { positions, heat };
}

/**
 * Silhouette radius at height fraction v.
 * Narrow trunk → hard flare → wide rounded mushroom canopy (ref tree frames).
 */
function treeProfile(v: number): number {
  const flare = smoothstep(0.16, 0.48, v);
  const dome = 1 - Math.pow(Math.max(0, (v - 0.55) / 0.5), 1.85);
  const trunk = (0.038 + 0.28 * Math.min(v, 0.28)) * (1 - flare * 0.6);
  return trunk + flare * Math.max(0, dome);
}

const PROFILE_STEPS = 160;

function buildHeightCdf(power: number): Float32Array {
  const cdf = new Float32Array(PROFILE_STEPS + 1);
  let acc = 0;
  for (let k = 0; k < PROFILE_STEPS; k++) {
    const v = (k + 0.5) / PROFILE_STEPS;
    // Brightest around the throat / lower canopy (ref: glowing trunk→cap junction)
    const bias = 0.5 + 1.05 * Math.exp(-Math.pow((v - 0.52) / 0.4, 2));
    acc += Math.pow(treeProfile(v), power) * bias;
    cdf[k + 1] = acc;
  }
  for (let k = 0; k <= PROFILE_STEPS; k++) cdf[k] /= acc;
  return cdf;
}

function sampleHeight(cdf: Float32Array, u: number): number {
  let lo = 0;
  let hi = PROFILE_STEPS;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid + 1] < u) lo = mid + 1;
    else hi = mid;
  }
  const span = cdf[lo + 1] - cdf[lo] || 1;
  return (lo + (u - cdf[lo]) / span) / PROFILE_STEPS;
}

/**
 * Classic mushroom tree from the screenshot sequence:
 * bright cyan trunk, wide blue canopy, violet outer mist.
 */
export function generateTree(
  count: number,
  height = TREE_HEIGHT,
  radius = TREE_RADIUS,
): Shape {
  const positions = new Float32Array(count * 3);
  const heat = new Float32Array(count);
  const volumeCdf = buildHeightCdf(1.35);
  const surfaceCdf = buildHeightCdf(1);
  const strands = 96;

  for (let i = 0; i < count; i++) {
    const roll = hash(i, 10);

    let v: number;
    let fill: number;
    let fibre: number;
    let core = 0;

    if (roll < 0.1) {
      // Trunk column — sparse enough to stay cyan, not chalk white
      v = Math.pow(hash(i, 11), 1.15) * 0.48;
      fill = 0.25 + hash(i, 12) * 0.65;
      fibre = 0.014;
      core = 0.32;
    } else if (roll < 0.34) {
      // Funnel streamers trunk → canopy
      v = sampleHeight(surfaceCdf, hash(i, 11));
      fill = 0.5 + hash(i, 12) * 0.5;
      fibre = 0.03;
      core = 0.14;
    } else if (roll < 0.82) {
      // Canopy bulk — bias outward so middle doesn't become a white plume
      v = sampleHeight(volumeCdf, hash(i, 11));
      fill = Math.pow(hash(i, 12), 0.38);
      fibre = 0.08;
    } else {
      // Outer violet mist / soft fringe
      v = 0.4 + hash(i, 11) * 0.58;
      fill = 1.05 + Math.pow(hash(i, 12), 1.6) * 0.55;
      fibre = 0.5;
    }

    const strand = Math.floor(hash(i, 13) * strands);
    const twist = (strand % 2 === 0 ? 1 : -1) * v * 0.42;
    const angle = (strand / strands) * TAU + twist;
    const ridge =
      1 + 0.16 * Math.sin(strand * 2.6) + 0.09 * Math.sin(strand * 5.2 + 1.1);

    const r = Math.max(0.004, radius * treeProfile(v) * fill * ridge);
    const y = Math.max(0, v * height + hashSigned(i, 15) * 0.016);
    const off = hashSigned(i, 14) * fibre;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    positions[i * 3] = cos * r - sin * off;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = sin * r + cos * off;

    // Hot near axis/trunk, violet at canopy rim (low heat)
    heat[i] = Math.min(1, Math.max(0, 0.95 + core - fill * 0.78 - v * 0.28));
  }
  return { positions, heat };
}

/** Wireframe cube + face veil + sparse interior — matches holographic refs. */
export function generateCube(
  count: number,
  size = CUBE_SIZE,
  centerY = CUBE_Y,
): Shape {
  const positions = new Float32Array(count * 3);
  const heat = new Float32Array(count);
  const half = size / 2;

  for (let i = 0; i < count; i++) {
    const roll = hash(i, 20);
    let x: number;
    let y: number;
    let z: number;
    let h: number;

    if (roll < 0.34) {
      // Edges — denser for crisp cyan wireframe
      const edge = Math.floor(hash(i, 21) * 12);
      const t = hashSigned(i, 22);
      const axis = Math.floor(edge / 4);
      const corner = edge % 4;
      const a = corner < 2 ? half : -half;
      const b = corner % 2 === 0 ? half : -half;

      if (axis === 0) {
        x = t * half;
        y = a;
        z = b;
      } else if (axis === 1) {
        y = t * half;
        x = a;
        z = b;
      } else {
        z = t * half;
        x = a;
        y = b;
      }
      x += hashSigned(i, 23) * 0.007;
      y += hashSigned(i, 24) * 0.007;
      z += hashSigned(i, 25) * 0.007;
      h = 0.88 + hash(i, 26) * 0.1;
    } else if (roll < 0.78) {
      const face = Math.floor(hash(i, 27) * 6);
      const u =
        Math.sign(hashSigned(i, 28)) * Math.pow(hash(i, 29), 0.52) * half;
      const w =
        Math.sign(hashSigned(i, 30)) * Math.pow(hash(i, 31), 0.52) * half;
      const depth = hash(i, 32) * 0.045;
      const s = face % 2 === 0 ? 1 : -1;
      const plane = (half - depth) * s;

      if (face < 2) {
        x = plane;
        y = u;
        z = w;
      } else if (face < 4) {
        y = plane;
        x = u;
        z = w;
      } else {
        z = plane;
        x = u;
        y = w;
      }
      const border = Math.max(Math.abs(u), Math.abs(w)) / half;
      h = 0.08 + border * border * 0.42;
    } else {
      x = hashSigned(i, 33) * half * 0.82;
      y = hashSigned(i, 34) * half * 0.82;
      z = hashSigned(i, 35) * half * 0.82;
      h = 0.06;
    }

    // Cyan sheen streak on a face (refs show a bright face hotspot)
    const spot = Math.hypot(x - half * 0.55, y + half * 0.35, z - half) / 0.4;
    h += Math.max(0, 1 - spot) * 0.75;

    const cos = Math.cos(CUBE_YAW);
    const sin = Math.sin(CUBE_YAW);
    positions[i * 3] = x * cos + z * sin;
    positions[i * 3 + 1] = y + centerY;
    positions[i * 3 + 2] = z * cos - x * sin;
    heat[i] = Math.min(1, h);
  }
  return { positions, heat };
}

export function stampTextOnCube(
  cube: Shape,
  text: string,
  size = CUBE_SIZE,
  centerY = CUBE_Y,
): Shape {
  const half = size / 2;
  const canvas = document.createElement("canvas");
  const w = 768;
  const h = 256;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return cube;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 128px Syne, Arial Black, sans-serif";
  ctx.fillText(text, w / 2, h / 2);

  const { data } = ctx.getImageData(0, 0, w, h);
  const hits: number[] = [];
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      if (data[(py * w + px) * 4] > 150) hits.push(py * w + px);
    }
  }
  if (hits.length === 0) return cube;

  const count = cube.heat.length;
  const textCount = Math.floor(count * 0.1);
  const glyphW = size * 0.82;
  const glyphH = (glyphW / w) * h;
  const cos = Math.cos(CUBE_YAW);
  const sin = Math.sin(CUBE_YAW);

  for (let i = 0; i < textCount; i++) {
    const hit = hits[Math.floor(hash(i, 40) * hits.length)];
    const x = ((hit % w) / w - 0.5) * glyphW + hashSigned(i, 41) * 0.005;
    const y = (0.5 - Math.floor(hit / w) / h) * glyphH + size * 0.1;
    const z = half + 0.012 + hash(i, 43) * 0.018;
    const j = count - textCount + i;

    cube.positions[j * 3] = x * cos + z * sin;
    cube.positions[j * 3 + 1] = y + centerY + hashSigned(i, 42) * 0.005;
    cube.positions[j * 3 + 2] = z * cos - x * sin;
    cube.heat[j] = 1.05 + hash(i, 44) * 0.12;
  }
  return cube;
}

export function pickParticleCount(): number {
  if (typeof window === "undefined") return 100_000;
  const cores = navigator.hardwareConcurrency ?? 4;
  const w = window.innerWidth;
  if (w < 720 || cores <= 4) return 45_000;
  if (w < 1100) return 85_000;
  return 130_000;
}
