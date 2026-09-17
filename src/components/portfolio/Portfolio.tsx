import { useEffect, useRef, useState } from "react";
import {
  capabilities,
  education,
  experience,
  nav,
  process,
  projects,
  site,
  stats,
  tools,
} from "../../data/site";
import { useReveal } from "../../hooks/useReveal";
import { downloadResume } from "../../lib/resume";
import { GlassCard } from "../ui/GlassCard";
import { ArrowIcon, CapIcon, DownloadIcon } from "../ui/Icons";
import { WorkVisual } from "./WorkVisual";
import "./Portfolio.css";

// Preserved for the next design pass; switch on when the company timeline is ready.
const SHOW_EXPERIENCE = false;

export function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal(root);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  const featured = projects.slice(0, 3);
  const more = projects.slice(3);

  return (
    <section className="folio" ref={root}>
      <header className="folio-nav">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">{site.shortName}</span>
        </a>
        <nav className="nav-pills" aria-label="Portfolio">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="folio-nav-end">
          <a className="nav-cta" href="#contact">
            Let&apos;s talk
          </a>
          <button
            type="button"
            className={`menu-btn ${menuOpen ? "is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            Menu
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav glass" id="mobile-nav" aria-label="Mobile">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <div className="intro wrap" id="about" data-reveal>
        <div className="intro-copy">
          <p className="eyebrow">{site.tagline}</p>
          <h2>
            Senior
            <br />
            Flutter
            <br />
            Developer
          </h2>
          <p className="intro-lead">{site.summary}</p>
          <div className="intro-actions">
            <a className="btn btn--solid" href="#work">
              View my work <ArrowIcon />
            </a>
            <button type="button" className="btn btn--ghost" onClick={downloadResume}>
              Download resume <DownloadIcon />
            </button>
          </div>
        </div>

        <div className="intro-portrait">
          <svg className="orbit-ring" viewBox="0 0 320 320" aria-hidden>
            <defs>
              <path
                id="orbit-path"
                d="M160,160 m-126,0 a126,126 0 1,1 252,0 a126,126 0 1,1 -252,0"
              />
            </defs>
            <circle cx="160" cy="160" r="126" className="orbit-track" />
            <text>
              <textPath href="#orbit-path">
                {site.availability.toUpperCase()} · DHAKA · FLUTTER · FULL-STACK ·
              </textPath>
            </text>
          </svg>
          <img
            className="intro-photo"
            src="/mosharof-portrait.png"
            alt={`${site.name}, ${site.role}`}
            width={610}
            height={1148}
          />
          <i className="orbit-star" aria-hidden />
        </div>
      </div>

      <div className="stats wrap" aria-label="Highlights" data-stagger>
        {stats.map((s, i) => (
          <GlassCard key={s.label} className="stat-card" index={`0${i + 1}`}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </GlassCard>
        ))}
      </div>

      <div className="work wrap" id="work">
        <div className="section-head" data-reveal>
          <h3>Featured work</h3>
          <a href="#work-more">
            Explore all projects <ArrowIcon />
          </a>
        </div>
        <div className="work-grid" data-stagger>
          {featured.map((project, i) => (
            <GlassCard
              as="a"
              key={project.id}
              className="work-card"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              index={`0${i + 1}`}
            >
              <WorkVisual kind={project.visual} />
              <div className="work-meta">
                <div>
                  <p>{project.kicker}</p>
                  <h4>{project.title}</h4>
                </div>
                <span className="work-go" aria-hidden>
                  <ArrowIcon />
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="work-more" id="work-more" data-stagger>
          {more.map((project, i) => (
            <GlassCard
              as="a"
              key={project.id}
              className="work-row"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              index={`0${i + 4}`}
            >
              <div>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <ul>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <span className="work-go" aria-hidden>
                <ArrowIcon />
              </span>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="split wrap" id="capabilities">
        <div>
          <h3 data-reveal>Core capabilities</h3>
          <div className="cap-grid" data-stagger>
            {capabilities.map((cap, i) => (
              <GlassCard key={cap.title} className="cap-card" index={`0${i + 1}`}>
                <CapIcon name={cap.icon} />
                <h4>{cap.title}</h4>
                <p>{cap.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="split-side">
          <div>
            <h3 data-reveal>Tools & technologies</h3>
            <ul className="tools" data-stagger>
              {tools.map((tool) => (
                <li key={tool} className="glass glass--mini" data-cursor="hot">
                  <span>{tool.slice(0, 2)}</span>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 data-reveal>Education</h3>
            <ul className="edu" data-stagger>
              {education.map((item) => (
                <li key={item.title} className="glass glass--mini" data-cursor="hot">
                  <i />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.place}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {SHOW_EXPERIENCE && (
        <div className="about wrap">
          <h3 data-reveal>Experience</h3>
          <ol className="jobs" data-stagger>
            {experience.map((job, i) => (
              <GlassCard
                as="li"
                key={job.company + job.period}
                className="job-card"
                index={`0${i + 1}`}
              >
                <div className="job-top">
                  <h4>
                    {job.role}
                    <span> — {job.company}</span>
                  </h4>
                  <p>
                    {job.period}
                    <span> · {job.place}</span>
                  </p>
                </div>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </ol>
        </div>
      )}

      <div className="process wrap" id="process">
        <h3 data-reveal>How I ship</h3>
        <ol className="process-grid" data-stagger>
          {process.map((step) => (
            <GlassCard as="li" key={step.n} className="process-card" index={step.n}>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </GlassCard>
          ))}
        </ol>
      </div>

      <GlassCard className="cta wrap" id="contact">
        <h2 data-reveal>
          Let&apos;s create
          <br />
          something
          <br />
          extraordinary
        </h2>
        <div className="cta-mid" data-reveal>
          <p>
            I&apos;m currently leading Flutter delivery in Dhaka and open to select
            product collaborations.
          </p>
          <a className="btn btn--solid" href={site.emailHref}>
            Let&apos;s work together <ArrowIcon />
          </a>
        </div>
        <ul className="cta-contact" data-reveal>
          <li>
            <span>Email</span>
            <a href={site.emailHref}>{site.email}</a>
          </li>
          <li>
            <span>Phone</span>
            <a href={site.phoneHref}>{site.phone}</a>
          </li>
          <li>
            <span>Location</span>
            {site.location}
          </li>
        </ul>
      </GlassCard>

      <footer className="folio-foot wrap">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div>
          <span>Let&apos;s connect</span>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </section>
  );
}
