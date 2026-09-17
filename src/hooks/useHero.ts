import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHero() {
  const progress = useRef(0);
  const reveal = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const pinRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 2600);
      const eased = 1 - Math.pow(1 - t, 3);
      reveal.current = eased;
      setLoadPct(eased * 100);
      if (t >= 1) {
        reveal.current = 1;
        setLoading(false);
        clearInterval(id);
      }
    };
    const id = window.setInterval(tick, 16);
    tick();
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (loading || !pinRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        onUpdate: (self) => {
          progress.current = self.progress;
          if (self.progress < 0.38) setChapter(0);
          else if (self.progress < 0.72) setChapter(1);
          else setChapter(2);
        },
      });
    });

    return () => ctx.revert();
  }, [loading]);

  return { progress, reveal, mouse, pinRef, chapter, loading, loadPct };
}
