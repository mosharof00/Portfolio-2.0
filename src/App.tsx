import { HeroScene } from "./components/HeroScene";
import { HeroOverlay } from "./components/HeroOverlay";
import { Portfolio } from "./components/portfolio/Portfolio";
import { useCursor } from "./hooks/useCursor";
import { useHero } from "./hooks/useHero";
import "./App.css";

export default function App() {
  const { progress, reveal, mouse, pinRef, chapter, loading, loadPct } =
    useHero();
  useCursor();

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

      <Portfolio />
    </div>
  );
}
