# Portfolio-2.0

Live GPU point-cloud hero inspired by the Anchor AI-style social video — scroll-scrubbed morph between sphere → fountain/tree → cube.

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173 and scroll.

## Stack

- Vite + React + TypeScript
- React Three Fiber / three.js (`THREE.Points` + custom GLSL)
- `@react-three/postprocessing` bloom
- GSAP ScrollTrigger

## Controls

- **Scroll** — morph progress (sphere → tree → cube)
- **Mouse** — subtle camera parallax + soft particle push
