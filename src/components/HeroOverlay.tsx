type Props = {
  chapter: number;
  loading: boolean;
  loadPct: number;
};

const CHAPTERS = [
  {
    badge: "Operational intelligence",
    title: "Streamlined\nTravel Ops",
    body: "Visas and work permits — arranged before you leave the ground.",
  },
  {
    badge: "Trusted network",
    title: "Partners\nin Motion",
    body: "A constellation of carriers and insurers orbiting one operating system.",
  },
  {
    badge: "Intelligence with purpose",
    title: "Clarity\nat Scale",
    body: "From underwriting signals to case velocity — one luminous source of truth.",
  },
] as const;

export function HeroOverlay({ chapter, loading, loadPct }: Props) {
  const c = CHAPTERS[Math.min(chapter, CHAPTERS.length - 1)];

  return (
    <>
      <header className={`nav ${loading ? "nav--hidden" : ""}`}>
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">Vistora</span>
        </div>
        <nav className="nav-pills" aria-label="Primary">
          <a href="#platform">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#analytics">Analytics</a>
        </nav>
        <a className="nav-cta" href="#demo">
          Request Demo
        </a>
      </header>

      {loading && (
        <div className="loader" aria-live="polite">
          <span
            className="brand-mark brand-mark--lg"
            style={{ opacity: Math.max(0, 1 - loadPct / 35) }}
            aria-hidden
          />
          <div className="loader-readout">
            <p className="loader-label">Loading</p>
            <p className="loader-pct">{Math.round(loadPct)}%</p>
          </div>
        </div>
      )}

      <div
        className={`hero-copy ${loading ? "hero-copy--hidden" : ""}`}
        data-chapter={chapter}
        key={chapter}
      >
        <span className="badge">
          <i />
          {c.badge}
        </span>
        <h1>
          {c.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p>{c.body}</p>
      </div>

      <div className={`scroll-hint ${loading ? "hero-copy--hidden" : ""}`}>
        <span>Scroll</span>
        <i />
      </div>
    </>
  );
}
