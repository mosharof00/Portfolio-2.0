import { useEffect } from "react";

const HOT = "a, button, [data-cursor='hot']";

export function useCursor() {
  useEffect(() => {
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    if (!ring || !dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const hot = (e.target as HTMLElement | null)?.closest(HOT);
      ring.classList.toggle("is-hot", Boolean(hot));
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
