type Kind = "foodx" | "lovelynk" | "academy" | "shift" | "import";

export function WorkVisual({ kind }: { kind: Kind }) {
  if (kind === "foodx") {
    return (
      <div className="viz viz--foodx">
        <div className="viz-chrome">
          <span />
          <span />
          <span />
        </div>
        <p className="viz-kicker">Today&apos;s volume</p>
        <p className="viz-metric">12,480</p>
        <div className="viz-bars" aria-hidden>
          {[40, 62, 48, 80, 58, 92, 70].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (kind === "lovelynk") {
    return (
      <div className="viz viz--lovelynk">
        <div className="viz-orb viz-orb--a" />
        <div className="viz-orb viz-orb--b" />
        <div className="viz-widgets">
          <span>12:00</span>
          <span>Lock</span>
          <span>Home</span>
          <span>Sync</span>
        </div>
      </div>
    );
  }

  if (kind === "academy") {
    return (
      <div className="viz viz--academy">
        <div className="phone">
          <div className="phone-notch" />
          <p className="phone-label">Smart Academy</p>
          <p className="phone-score">4.9</p>
          <p className="phone-sub">Marketplace rating</p>
          <div className="phone-bar">
            <i style={{ width: "86%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "shift") {
    return (
      <div className="viz viz--shift">
        <div className="shift-row">
          <b>AM</b>
          <span>Warehouse · 06:00</span>
        </div>
        <div className="shift-row shift-row--on">
          <b>PM</b>
          <span>Retail floor · 14:00</span>
        </div>
        <div className="shift-row">
          <b>NT</b>
          <span>Dispatch · 22:00</span>
        </div>
      </div>
    );
  }

  return (
    <div className="viz viz--import">
      <div className="import-grid">
        <span>Admin</span>
        <span>Manager</span>
        <span className="import-grid--wide">Customer portal</span>
      </div>
    </div>
  );
}
