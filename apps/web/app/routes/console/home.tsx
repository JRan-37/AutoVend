import { Link } from "react-router";

export default function ConsoleHome() {
  return (
    <div
      className="card card-pad"
      style={{ maxWidth: 440, width: "100%", padding: 32, textAlign: "center" }}
    >
      <div className="meta" style={{ color: "var(--accent)", marginBottom: 16 }}>
        OPERATOR CONSOLE · AUTOVEND SYSTEMS
      </div>
      <h1 className="h2" style={{ marginBottom: 12 }}>
        Sign-in isn&apos;t open yet.
      </h1>
      <p style={{ color: "var(--ink-3)", fontSize: 14, marginBottom: 24 }}>
        The real console — machines, venues, leads, routes — arrives with Phase 3 of the build,
        behind operator sign-in. Until then, the public demo shows what it will look like.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/dashboard-demo" className="btn btn-primary btn-arrow">
          View the demo
        </Link>
        <Link to="/" className="btn btn-ghost">
          Back to site
        </Link>
      </div>
    </div>
  );
}
