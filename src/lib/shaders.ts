/**
 * Shared GLSL — palette sampled from the Anchor AI screenshot sequence.
 * Blue channel stays dominant; green climbs with heat; red stays low so
 * additive blending never chalk-washes to pure white. Outer mist is violet.
 */

const NOISE = /* glsl */ `
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  return hash11(p.x + p.y * 57.0);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += vnoise(p) * amp;
    p *= 2.05;
    amp *= 0.5;
  }
  return v;
}
`;

export const particleVertex = /* glsl */ `
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uReveal;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMirror;

attribute vec3 aSphere;
attribute vec3 aTree;
attribute vec3 aCube;
attribute float aSeed;
attribute float aSphereHeat;
attribute float aTreeHeat;
attribute float aCubeHeat;

varying float vHeat;
varying float vCube;
varying float vSeed;
varying float vAlpha;
varying float vExposure;

${NOISE}

float noise3(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 57.0 + p.z * 113.0;
  float y1 = mix(mix(hash11(n), hash11(n + 1.0), f.x),
                 mix(hash11(n + 57.0), hash11(n + 58.0), f.x), f.y);
  float y2 = mix(mix(hash11(n + 113.0), hash11(n + 114.0), f.x),
                 mix(hash11(n + 170.0), hash11(n + 171.0), f.x), f.y);
  return mix(y1, y2, f.z);
}

vec3 curl(vec3 p) {
  float e = 0.15;
  return normalize(vec3(
    noise3(p + vec3(0.0, e, 0.0)) - noise3(p - vec3(0.0, e, 0.0)),
    noise3(p + vec3(0.0, 0.0, e)) - noise3(p - vec3(0.0, 0.0, e)),
    noise3(p + vec3(e, 0.0, 0.0)) - noise3(p - vec3(e, 0.0, 0.0))
  ) + 0.0001);
}

void main() {
  float delay = aSeed * 0.08;
  float p = clamp((uProgress - delay) / (1.0 - delay + 0.001), 0.0, 1.0);

  float sTree = smoothstep(0.26, 0.44, p);
  float sCube = smoothstep(0.6, 0.8, p);

  vec3 pos = mix(mix(aSphere, aTree, sTree), aCube, sCube);
  float heat = mix(mix(aSphereHeat, aTreeHeat, sTree), aCubeHeat, sCube);

  // Motion only during morph windows — settled tree/cube stay sharp
  float toTree = smoothstep(0.24, 0.34, p) * (1.0 - smoothstep(0.38, 0.48, p));
  float toCube = smoothstep(0.58, 0.68, p) * (1.0 - smoothstep(0.74, 0.86, p));
  float morphing = max(toTree, toCube);

  vec3 hub = vec3(0.0, 1.05, 0.0);
  pos += normalize(pos - hub + 0.001) * toCube * (0.08 + aSeed * 0.2);

  pos += curl(pos * 1.5 + vec3(uTime * 0.1, aSeed * 6.0, uTime * 0.045))
       * morphing * 0.2;
  pos += curl(pos * 0.7 + uTime * 0.02) * mix(0.003, 0.025, morphing);

  vec3 mouse3 = vec3(uMouse.x * 2.4, uMouse.y * 1.2 + 1.1, 0.55);
  float d = length(pos - mouse3);
  float push = smoothstep(0.85, 0.0, d) * uMouseStrength * mix(0.25, 1.0, morphing);
  pos += normalize(pos - mouse3 + 0.001) * push * 0.22;

  // Loading: sphere rises from the floor (hemisphere → full sphere)
  float sweep = mix(-0.4, 3.0, uReveal);
  float revealed = 1.0 - smoothstep(sweep - 0.14, sweep + 0.14, aSphere.y);
  revealed = mix(revealed, 1.0, max(sTree, step(0.98, uReveal)));

  // Mirror reflection under the water plane
  if (uMirror > 0.5) {
    pos.y = -pos.y * 0.92 - 0.04;
    revealed *= smoothstep(-2.4, -0.05, pos.y) * 0.45;
  }

  vHeat = heat;
  vCube = sCube;
  vSeed = aSeed;
  vAlpha = revealed;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float atten = clamp(7.0 / -mv.z, 0.4, 2.4);
  float onTree = sTree * (1.0 - sCube);
  float stage = 1.0 + 0.38 * onTree - 0.14 * sCube;
  vExposure = mix(1.0, 0.55, onTree) * mix(1.0, 0.7, uMirror);
  gl_PointSize =
    uSize * atten * stage * (0.52 + min(heat, 1.0) * 0.48) * revealed;
}
`;

export const particleFragment = /* glsl */ `
precision highp float;

varying float vHeat;
varying float vCube;
varying float vSeed;
varying float vAlpha;
varying float vExposure;

// Exact-feeling palette from the tree/sphere/cube screenshots
const vec3 C_MIST   = vec3(0.42, 0.14, 0.82); // violet outer fringe
const vec3 C_INDIGO = vec3(0.28, 0.18, 0.92);
const vec3 C_ROYAL  = vec3(0.16, 0.36, 1.00);
const vec3 C_AZURE  = vec3(0.18, 0.52, 1.00);
const vec3 C_CYAN   = vec3(0.32, 0.78, 1.00); // trunk / hot body
const vec3 C_HOT    = vec3(0.55, 0.88, 1.00); // soft cyan-white, never chalk
const vec3 C_TEXT   = vec3(0.9, 0.96, 1.00);

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float t = clamp(vHeat, 0.0, 1.0);

  vec3 col = mix(C_MIST, C_INDIGO, smoothstep(0.0, 0.2, t));
  col = mix(col, C_ROYAL, smoothstep(0.15, 0.4, t));
  col = mix(col, C_AZURE, smoothstep(0.35, 0.62, t));
  col = mix(col, C_CYAN, smoothstep(0.55, 0.85, t));
  col = mix(col, C_HOT, smoothstep(0.82, 1.0, t));
  col = mix(col, C_TEXT, smoothstep(1.0, 1.2, vHeat));

  // Cube: magenta/violet on cooler face particles; edges stay cyan
  vec3 magenta = vec3(0.72, 0.2, 0.95);
  col = mix(col, magenta, vCube * (1.0 - t) * 0.55);

  float grain = 0.55 + 1.2 * pow(vSeed, 4.0);
  float alpha = smoothstep(0.5, 0.14, d);
  alpha *= (0.13 + t * 0.22) * grain * vAlpha * vExposure;

  gl_FragColor = vec4(col * (0.7 + t * 0.38), alpha);
}
`;

export const floorVertex = /* glsl */ `
varying vec2 vPos;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPos = world.xz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const floorFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uReveal;
uniform float uSpread;

varying vec2 vPos;

${NOISE}

void main() {
  vec2 q = vPos;
  float r = length(q);
  vec2 dir = q / max(r, 0.001);

  // Organic water warp — matching the wispy ring texture in refs
  float warp = fbm(q * 0.11 + vec2(uTime * 0.014, -uTime * 0.009)) - 0.5;
  warp += (fbm(q * 0.35 - uTime * 0.02) - 0.5) * 0.25;
  float rw = max(r + warp * 0.55, 0.0);

  float phase = pow(rw, 0.88) * 1.65 - uTime * 0.07;
  float f = fract(phase);
  float d = min(f, 1.0 - f);

  float aa = clamp(fwidth(phase), 0.0008, 0.22);
  float width = max(0.009, aa * 0.75);
  float line = 1.0 - smoothstep(width, width + aa * 1.6, d);

  // Broken / wispy arcs around the circumference
  float wisp = fbm(dir * 2.4 + vec2(0.0, rw * 0.4 - uTime * 0.035));
  line *= 0.15 + 1.5 * wisp;

  float f2 = fract(phase * 0.5 + 0.33);
  float line2 = (1.0 - smoothstep(width * 1.2, width * 1.2 + aa * 2.2, min(f2, 1.0 - f2)))
              * 0.28;

  float rings = line + line2;
  float fade = smoothstep(7.2, 0.35, r);

  // Soft reflection pool under the object (refs show clear glow under trunk/cube)
  float pool = exp(-r * r * 1.35 / uSpread);
  float smear = exp(-q.x * q.x * 4.5 / uSpread)
              * exp(-max(q.y, 0.0) * 0.95)
              * smoothstep(-0.9, 0.3, q.y);

  vec3 deep   = vec3(0.08, 0.18, 0.7);
  vec3 mid    = vec3(0.16, 0.42, 1.0);
  vec3 sky    = vec3(0.38, 0.72, 1.0);
  vec3 violet = vec3(0.4, 0.16, 0.95);
  vec3 magenta = vec3(0.7, 0.22, 0.85);

  vec3 col = mix(deep, mid, smoothstep(0.04, 0.55, rings));
  col = mix(col, sky, smoothstep(0.55, 1.35, rings));
  // Outer rings pick up magenta/violet fringe like the video floor
  col = mix(col, mix(violet, magenta, 0.35), smoothstep(2.8, 8.5, r) * 0.55);
  col = mix(col, sky, min(pool + smear, 1.0) * 0.55);

  float alpha = (rings * 0.42 + pool * 0.28 + smear * 0.18) * fade * uReveal;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;
