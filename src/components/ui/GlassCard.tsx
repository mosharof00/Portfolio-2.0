import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";

type Props = {
  as?: "article" | "a" | "div" | "li";
  href?: string;
  target?: string;
  rel?: string;
  index?: string;
  className?: string;
  id?: string;
  children: ReactNode;
};

export function GlassCard({
  as = "article",
  href,
  target,
  rel,
  index,
  className = "",
  id,
  children,
}: Props) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const classes = `glass ${className}`.trim();

  const setRef = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  const onMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = nodeRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty(
      "--rx",
      `${((e.clientY - r.top) / r.height - 0.5) * -7}deg`,
    );
    el.style.setProperty(
      "--ry",
      `${((e.clientX - r.left) / r.width - 0.5) * 9}deg`,
    );
  }, []);

  const onLeave = useCallback(() => {
    const el = nodeRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  const body = (
    <>
      <span className="glass-shine" aria-hidden />
      {index ? <span className="glass-index">{index}</span> : null}
      {children}
    </>
  );

  const shared = {
    id,
    className: classes,
    "data-cursor": "hot" as const,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
  };

  if (as === "a" || href) {
    return (
      <a ref={setRef} href={href} target={target} rel={rel} {...shared}>
        {body}
      </a>
    );
  }

  if (as === "li") {
    return (
      <li ref={setRef} {...shared}>
        {body}
      </li>
    );
  }

  if (as === "div") {
    return (
      <div ref={setRef} {...shared}>
        {body}
      </div>
    );
  }

  return (
    <article ref={setRef} {...shared}>
      {body}
    </article>
  );
}
