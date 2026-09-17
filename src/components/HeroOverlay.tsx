import { heroChapters, nav, site } from "../data/site";

type Props = {
  chapter: number;
  loading: boolean;
  loadPct: number;
};

export function HeroOverlay({ chapter, loading, loadPct }: Props) {
  const c = heroChapters[Math.min(chapter, heroChapters.length - 1)];

  return (
    <>
      <header className={`nav ${loading ? "nav--hidden" : ""}`}>
        <a className="brand" href="#intro">
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">{site.shortName}</span>
        </a>
        <nav className="nav-pills" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Let&apos;s talk
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
