/* AutoVend — shared UI primitives */
const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } = React;

// ── Router context ──────────────────────────────────────────────────
const RouterCtx = createContext(null);
const useRouter = () => useContext(RouterCtx);

function Link({ to, children, className = "", ...rest }) {
  const r = useRouter();
  return (
    <a
      href={"#" + to}
      className={className}
      onClick={(e) => { e.preventDefault(); r.go(to); }}
      {...rest}
    >
      {children}
    </a>
  );
}

// ── App store (cross-page state) ────────────────────────────────────
const StoreCtx = createContext(null);
const useStore = () => useContext(StoreCtx);

function useAppStore() {
  const [leads, setLeads] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const submitLead = useCallback((type, payload) => {
    const lead = { id: "L-" + Math.random().toString(36).slice(2, 7).toUpperCase(), type, payload, createdAt: Date.now() };
    setLeads((l) => [lead, ...l]);
    pushToast(`Submitted · ${type} · ref ${lead.id}`);
    return lead;
  }, [pushToast]);

  const submitSurvey = useCallback((payload) => {
    const s = { id: "S-" + Math.random().toString(36).slice(2, 7).toUpperCase(), payload, createdAt: Date.now() };
    setSurveys((l) => [s, ...l]);
    pushToast(`Survey received · ref ${s.id}`);
    return s;
  }, [pushToast]);

  return { leads, surveys, demoUnlocked, setDemoUnlocked, submitLead, submitSurvey, toasts };
}

// ── Header ──────────────────────────────────────────────────────────
function Header() {
  const r = useRouter();
  const path = r.path;
  const links = [
    { to: "/features", label: "Features" },
    { to: "/solutions/location-partner", label: "Location partners" },
    { to: "/solutions/advertising-partner", label: "Advertising" },
    { to: "/reach", label: "Reach" },
    { to: "/dashboard-demo", label: "Dashboard" },
    { to: "/resources", label: "Resources" },
  ];
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="AutoVend Systems · Home">
          <span className="mark">AV</span>
          <span>AutoVend<span style={{ color: "var(--ink-3)", fontWeight: 400 }}>/Systems</span></span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={"nav-link" + (path.startsWith(l.to) ? " active" : "")}>{l.label}</Link>
          ))}
        </nav>
        <span className="nav-spacer" />
        <div className="nav-cta">
          <Link to="/contact" className="btn btn-ghost btn-sm">Contact</Link>
          <Link to="/contact?form=placement" className="btn btn-accent btn-sm">Request placement</Link>
        </div>
      </div>
    </header>
  );
}

// ── Footer ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="assets/autovend-logo-trans.png" alt="AutoVend Systems" className="brand-logo brand-logo-footer" style={{ marginBottom: 16, marginLeft: -8 }} />
            <p style={{ color: "var(--ink-3)", fontSize: 13, maxWidth: "32ch", margin: 0 }}>
              Predictive automated retail. Smart vending hardware, fleet telemetry, and an HD ad surface — operated as one platform.
            </p>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/dashboard-demo">Dashboard demo</Link></li>
              <li><Link to="/reach">Reach map</Link></li>
              <li><Link to="/operating-area">Operating area</Link></li>
            </ul>
          </div>
          <div>
            <h4>Partner with us</h4>
            <ul>
              <li><Link to="/solutions/location-partner">Location partners</Link></li>
              <li><Link to="/solutions/advertising-partner">Advertising partners</Link></li>
              <li><Link to="/survey">Product survey</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/resources">Resources</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 AutoVend Systems · Operated by Supremacy Links Software</span>
          <span>v0.4.2 · Build 2604.a · status · all systems</span>
        </div>
      </div>
    </footer>
  );
}

// ── Toasts ──────────────────────────────────────────────────────────
function Toasts() {
  const { toasts } = useStore();
  return (
    <div style={{
      position: "fixed", right: 20, top: 80, zIndex: 100,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "var(--ink)", color: "var(--bg)",
          padding: "12px 16px", borderRadius: 8,
          fontSize: 13, fontFamily: "var(--font-mono)",
          letterSpacing: "0.01em",
          boxShadow: "0 12px 32px rgba(0,0,0,.18)",
          minWidth: 240,
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

// ── Form helpers ────────────────────────────────────────────────────
function Field({ label, required, hint, error, children }) {
  return (
    <label className="field">
      <span className="field-label">
        <span>{label}</span>
        {required && <span className="req">REQUIRED</span>}
      </span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function Placeholder({ label, height = 280, style }) {
  return <div className="placeholder" data-label={label} style={{ height, ...style }} />;
}

// ── Section header (eyebrow + h2 + lead) ────────────────────────────
function SectionHeader({ eyebrow, title, lead, align = "left", action }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      gap: 24, marginBottom: 40, flexWrap: "wrap",
      textAlign: align,
    }}>
      <div style={{ maxWidth: "60ch" }}>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>}
        {title && <h2 className="h2">{title}</h2>}
        {lead && <p className="lead" style={{ marginTop: 12, marginBottom: 0 }}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Sales spark / bar chart (for dashboard) ─────────────────────────
function SparkBars({ data, height = 80, accent = "var(--daccent, var(--accent))", muted = "var(--drule-2, var(--rule-2))" }) {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 12} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 6);
        const isLast = i === data.length - 1;
        return (
          <rect key={i} x={i * 12 + 1} y={height - h} width={9} height={h} rx={1.5}
            fill={isLast ? accent : muted} />
        );
      })}
    </svg>
  );
}

// ── Inline stat card ────────────────────────────────────────────────
function StatCard({ label, value, delta, deltaTone = "good", footnote }) {
  return (
    <div style={{
      padding: 20,
      border: "1px solid var(--drule, var(--rule))",
      borderRadius: 10,
      background: "var(--dbg-elev, var(--bg-elev))",
    }}>
      <div className="stat-label" style={{ color: "var(--dink-3, var(--ink-3))" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
        <div className="stat-num" style={{ color: "var(--dink, var(--ink))" }}>{value}</div>
        {delta && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: deltaTone === "good" ? "var(--good)" : deltaTone === "bad" ? "var(--bad)" : "var(--dink-3, var(--ink-3))",
          }}>{delta}</span>
        )}
      </div>
      {footnote && <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-4, var(--ink-4))", letterSpacing: ".04em", textTransform: "uppercase" }}>{footnote}</div>}
    </div>
  );
}

Object.assign(window, {
  useRouter, RouterCtx, Link,
  useStore, StoreCtx, useAppStore,
  Header, Footer, Toasts,
  Field, Placeholder, SectionHeader,
  SparkBars, StatCard,
});
