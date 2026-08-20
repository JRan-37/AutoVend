import { Link } from "react-router";

export function meta() {
  return [{ title: "Page not found — AutoVend Systems" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <main className="section">
      <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
        <div className="meta" style={{ color: "var(--accent)", marginBottom: 16 }}>
          404 · ROUTE NOT FOUND
        </div>
        <h1 className="h1">That page doesn&apos;t exist.</h1>
        <p className="lead" style={{ margin: "16px auto 32px" }}>
          The address may be old or mistyped. Everything worth seeing is reachable from the
          homepage.
        </p>
        <Link to="/" className="btn btn-primary btn-arrow">
          Back to home
        </Link>
      </div>
    </main>
  );
}
