import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroScene } from "./components/HeroScene";
import { HeroOverlay } from "./components/HeroOverlay";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const progress = useRef(0);
  const reveal = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const pinRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  // Preload sweep — also drives the sphere assembling out of the floor
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2600);
      const eased = 1 - Math.pow(1 - t, 3);
      reveal.current = eased;
      setLoadPct(eased * 100);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        reveal.current = 1;
        setLoading(false);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

  // Custom cursor
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

  return (
    <div className="app">
      <div className="cursor-dot" aria-hidden />
      <div className="cursor-ring" aria-hidden />

      <div className="scroll-track" ref={pinRef}>
        <div className="stage">
          <HeroScene progress={progress} reveal={reveal} mouse={mouse} />
          <HeroOverlay
            chapter={chapter}
            loading={loading}
            loadPct={loadPct}
          />
        </div>
      </div>

      <section className="after" id="platform">
        <h2>Built for operators who move people.</h2>
        <p>
          This prototype replaces image-sequence heroes with a live GPU point
          cloud — sphere, fountain, cube — scrubbed by scroll.
        </p>
      </section>
    </div>
  );
}
