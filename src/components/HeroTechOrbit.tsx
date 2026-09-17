import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { heroTechOrbit } from "../data/site";

type Props = {
  progress: RefObject<number>;
  loading: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export function HeroTechOrbit({ progress, loading }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = root.current?.querySelectorAll<HTMLElement>(".tech-orbit-pill");
    if (!items?.length) return;

    const update = () => {
      const heroProgress = progress.current;

      items.forEach((item, index) => {
        const start = 0.24 + index * 0.038;
        const duration = 0.47;
        const t = clamp01((heroProgress - start) / duration);
        const angle = Math.PI * t;
        const track = (index % 3) - 1;
        const x = 50 + Math.cos(angle) * 62;
        const y = 61 + track * 7 + Math.sin(angle) * (11 + track * 1.5);
        const depth = Math.sin(angle);
        const enter = smoothstep(t / 0.12);
        const leave = 1 - smoothstep((t - 0.82) / 0.18);
        const opacity = enter * leave;
        const scale = 0.7 + depth * 0.38;
        const blur = (1 - depth) * 2.2;

        gsap.set(item, {
          xPercent: -50,
          yPercent: -50,
          left: `${x}%`,
          top: `${y}%`,
          scale,
          rotation: -5 + t * 10,
          opacity,
          filter: `blur(${blur}px)`,
          zIndex: Math.round(10 + depth * 12),
          visibility: opacity > 0.01 ? "visible" : "hidden",
        });
      });
    };

    gsap.ticker.add(update);
    update();
    return () => gsap.ticker.remove(update);
  }, [progress]);

  return (
    <div
      ref={root}
      className={`tech-orbit ${loading ? "tech-orbit--hidden" : ""}`}
      aria-label="Core technology stack"
    >
      {heroTechOrbit.map((tech) => (
        <span className="tech-orbit-pill" key={tech.label}>
          <i aria-hidden>{tech.mark}</i>
          <b>{tech.label}</b>
        </span>
      ))}
    </div>
  );
}
